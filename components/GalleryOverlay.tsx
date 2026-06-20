"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import LightRefraction from "@/components/LightRefraction";
import DriftingImage, { type DriftItem } from "@/components/DriftingImage";
import type { GalleryCategory } from "@/lib/gallery";
import { sampleRandom } from "@/lib/random";

// Ảnh trôi tự do được trải trên một dải canvas RỘNG HƠN màn hình (cuộn ngang
// được) thay vì chỉ gói trong 1 khung hình, để xem hết toàn bộ ảnh trong mục
// mà vẫn giữ mật độ ảnh/diện tích như cũ (không giật lag dù mở mục nhiều ảnh).
const MOBILE_BREAKPOINT = 640;
const CELL_PX_MOBILE = 112;
const CELL_PX_DESKTOP = 150;
const ROWS_MOBILE = 3;
const ROWS_DESKTOP = 3;
const ABSOLUTE_CEILING = 80; // chặn cứng số ảnh trôi cùng lúc dù đã cho cuộn ngang

function buildDriftLayout(images: string[]): { items: DriftItem[]; canvasWidthPx: number } {
  const shown = sampleRandom(images, Math.min(images.length, ABSOLUTE_CEILING));

  const isMobile = typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
  const cellPx = isMobile ? CELL_PX_MOBILE : CELL_PX_DESKTOP;
  const rows = isMobile ? ROWS_MOBILE : ROWS_DESKTOP;
  const cols = Math.max(1, Math.ceil(shown.length / rows));
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const canvasWidthPx = Math.max(viewportWidth, cols * cellPx);

  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  const items = shown.map((src, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const jitterX = (Math.random() - 0.5) * cellWidth * 0.6;
    const jitterY = (Math.random() - 0.5) * cellHeight * 0.6;

    return {
      src,
      left: Math.min(98, Math.max(2, col * cellWidth + cellWidth / 2 + jitterX)),
      top: Math.min(86, Math.max(12, row * cellHeight + cellHeight / 2 + jitterY)),
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 3,
      rotateAmp: 3 + Math.random() * 5,
      driftAmp: 10 + Math.random() * 12,
    };
  });

  return { items, canvasWidthPx };
}

export default function GalleryOverlay({
  category,
  onClose,
}: {
  category: GalleryCategory;
  onClose: () => void;
}) {
  const [driftLayout] = useState(() => buildDriftLayout(category.images));
  const [focusedSrc, setFocusedSrc] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mở overlay ở giữa dải ảnh, để 2 phía trái/phải đều có ảnh cuộn tới xem.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="glass fixed right-4 top-4 z-[110] flex h-10 w-10 items-center justify-center rounded-full text-white"
      >
        ✕
      </button>

      <div className="relative h-full w-full overflow-hidden">
        {category.images.length === 0 ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <LightRefraction />
            <motion.p
              className="font-itim relative z-10 px-6 text-center text-3xl text-white sm:text-5xl"
              style={{
                textShadow:
                  "0 0 20px rgba(126,200,227,0.8), 0 0 60px rgba(255,255,255,0.5)",
              }}
              animate={{ y: [0, -14, 0], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              and the next slide?
            </motion.p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="no-scrollbar h-full w-full overflow-x-auto overflow-y-hidden"
            style={{ touchAction: "pan-x" }}
          >
            <div className="relative h-full" style={{ width: `${driftLayout.canvasWidthPx}px` }}>
              {driftLayout.items.map((item) => (
                <DriftingImage
                  key={item.src}
                  item={item}
                  isFocused={focusedSrc === item.src}
                  isDimmed={focusedSrc !== null && focusedSrc !== item.src}
                  onToggle={() =>
                    setFocusedSrc((current) => (current === item.src ? null : item.src))
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {focusedSrc && (
          <motion.div
            key="focused"
            className="fixed inset-0 z-[105] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              event.stopPropagation();
              setFocusedSrc(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative h-[70vmin] w-[70vmin] max-h-[80vh] max-w-[90vw] cursor-pointer overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
            >
              <Image src={focusedSrc} alt="" fill sizes="70vmin" className="object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
