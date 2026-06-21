"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MAX_ATTEMPTS,
  getAllQueueItems,
  retryItem,
  startBackgroundRetry,
  subscribeQueue,
  type QueueItem,
} from "@/lib/graduationQueue";

function statusLabel(item: QueueItem): string {
  if (item.status === "uploading") return "Đang gửi lên hệ thống...";
  if (item.status === "failed") return `Không gửi được sau ${item.attempts} lần thử.`;
  return item.attempts > 0 ? `Đang chờ thử lại (đã thử ${item.attempts} lần)...` : "Đã nhận, đang xử lý...";
}

export default function GraduationQueueStatus() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let active = true;
    const reload = () => {
      getAllQueueItems().then((current) => {
        if (active) setItems(current);
      });
    };

    reload();
    const unsubscribe = subscribeQueue(reload);
    const stopRetry = startBackgroundRetry();

    return () => {
      active = false;
      unsubscribe();
      stopRetry();
    };
  }, []);

  // IndexedDB trả về Blob mới mỗi lần đọc, nên tạo lại object URL theo
  // items hiện tại và thu hồi URL cũ để tránh rò rỉ bộ nhớ.
  useEffect(() => {
    const urls: Record<string, string> = {};
    for (const item of items) urls[item.id] = URL.createObjectURL(item.blob);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- object URL chỉ tạo được phía client, cần đồng bộ lại mỗi khi items đổi
    setPreviewUrls(urls);
    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

  if (items.length === 0) return null;

  const failedCount = items.filter((item) => item.status === "failed").length;

  return (
    <div className="fixed bottom-4 right-4 z-[150] font-be-vietnam">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white"
      >
        <span>{failedCount > 0 ? "⚠️" : "📤"}</span>
        {items.length} ảnh Tốt nghiệp {failedCount > 0 ? "cần bạn thử lại" : "đang xử lý"}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass mt-2 max-h-80 w-72 overflow-y-auto rounded-2xl p-3"
          >
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrls[item.id]}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/90">{statusLabel(item)}</p>
                    {item.status === "failed" && (
                      <>
                        {item.lastError && (
                          <p className="mt-0.5 text-xs text-white/50">Lỗi: {item.lastError}</p>
                        )}
                        <p className="mt-1 text-xs text-white/60">
                          Nếu vẫn lỗi, bạn có thể gửi ảnh này qua Zalo nhóm tạm thời cho ban tổ chức.
                        </p>
                        <button
                          type="button"
                          onClick={() => retryItem(item.id)}
                          className="mt-1 rounded-full bg-white/15 px-3 py-1 text-xs text-white hover:bg-white/25"
                        >
                          Thử lại
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-white/40">Tự động thử lại tối đa {MAX_ATTEMPTS} lần.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
