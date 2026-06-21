"use client";

import { useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { convertToUploadable, isAcceptedGraduationPhoto } from "@/lib/graduationPhotos";
import { addToQueue, processQueue } from "@/lib/graduationQueue";

type SelectedFile = { file: File; previewUrl: string };

export default function GraduationUploadModal({ onClose }: { onClose: () => void }) {
  const nameId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [senderName, setSenderName] = useState("");
  const [selected, setSelected] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "queued">("idle");

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted: SelectedFile[] = [];
    let rejected = false;

    for (const file of Array.from(files)) {
      if (isAcceptedGraduationPhoto(file)) {
        accepted.push({ file, previewUrl: URL.createObjectURL(file) });
      } else {
        rejected = true;
      }
    }

    setError(rejected ? "Một số ảnh bị bỏ qua (quá 10MB hoặc không đúng định dạng JPG/PNG/WEBP/HEIC)." : null);
    setSelected((current) => [...current, ...accepted]);
  };

  const removeSelected = (index: number) => {
    setSelected((current) => {
      URL.revokeObjectURL(current[index].previewUrl);
      return current.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setStatus("submitting");
    setError(null);

    // Lưu THẬT vào IndexedDB của trình duyệt trước, để ảnh không bị mất dù
    // Firebase Storage đang lỗi hoặc mất mạng. Việc upload thật chạy ngầm
    // và tự thử lại sau (xem GraduationQueueStatus).
    try {
      const trimmedName = senderName.trim().slice(0, 80) || null;
      for (const { file } of selected) {
        const uploadable = await convertToUploadable(file);
        await addToQueue({ ...uploadable, senderName: trimmedName });
      }

      processQueue();
      setStatus("queued");
    } catch {
      setError("Không thể lưu ảnh trên thiết bị này (có thể do trình duyệt đang ở chế độ riêng tư hoặc hết dung lượng). Vui lòng thử lại hoặc dùng thiết bị/trình duyệt khác.");
      setStatus("idle");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className="glass relative w-full max-w-md rounded-3xl p-6"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white"
        >
          ✕
        </button>

        {status === "queued" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="text-4xl">📤</span>
            <p className="font-itim text-xl text-white">Đã nhận ảnh, đang xử lý...</p>
            <p className="font-be-vietnam text-sm text-white/70">
              Ảnh đã được lưu an toàn trên thiết bị này và đang được tự động gửi lên hệ thống. Quá
              trình này có thể mất một chút thời gian — bạn có thể theo dõi trạng thái gửi ở góc màn
              hình. Ảnh chỉ thật sự hiển thị công khai sau khi gửi thành công và được duyệt.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="glass mt-2 rounded-full px-5 py-2 font-be-vietnam text-sm text-white"
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h3 className="font-itim text-xl text-white">Thêm khoảnh khắc của bạn</h3>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="glass flex h-28 w-full flex-col items-center justify-center gap-1 rounded-2xl text-white/80 hover:text-white"
            >
              <span className="text-2xl">+</span>
              <span className="font-be-vietnam text-sm">Chọn ảnh từ thiết bị (chọn được nhiều ảnh)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />

            {selected.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {selected.map((item, index) => (
                  <div key={item.previewUrl} className="relative aspect-square overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelected(index)}
                      aria-label="Bỏ ảnh này"
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label htmlFor={nameId} className="mb-1 block font-be-vietnam text-sm text-white/70">
                Tên của bạn (không bắt buộc)
              </label>
              <input
                id={nameId}
                type="text"
                value={senderName}
                onChange={(event) => setSenderName(event.target.value)}
                maxLength={80}
                placeholder="Ví dụ: Lan K49"
                className="glass w-full rounded-xl px-4 py-2 font-be-vietnam text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>

            {error && <p className="font-be-vietnam text-sm text-red-300">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={selected.length === 0 || status === "submitting"}
              className="glass rounded-full px-5 py-2.5 font-be-vietnam text-sm text-white disabled:opacity-40"
            >
              {status === "submitting" ? "Đang gửi..." : "Gửi ảnh"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
