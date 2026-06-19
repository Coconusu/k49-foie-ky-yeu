"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import LightRefraction from "@/components/LightRefraction";
import DriftingImage, { type DriftItem } from "@/components/DriftingImage";
import type { GalleryCategory } from "@/lib/gallery";

// Số ảnh trôi cùng lúc được tính theo diện tích viewport thực tế (gần tràn
// kín màn hình), có trần an toàn riêng cho mobile/desktop để tránh giật lag.
const MOBILE_BREAKPOINT = 640;
const MOBILE_TILE_FOOTPRINT = 100 * 100;
const DESKTOP_TILE_FOOTPRINT = 150 * 150;
const FILL_DENSITY = 0.55;
const MOBILE_FLOOR = 6;
const MOBILE_CEILING = 20;
const DESKTOP_FLOOR = 12;
const DESKTOP_CEILING = 45;

function computeCap(): number {
  if (typeof window === "undefined") return DESKTOP_FLOOR;

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const tileFootprint = isMobile ? MOBILE_TILE_FOOTPRINT : DESKTOP_TILE_FOOTPRINT;
  const dynamic = Math.round(
    (window.innerWidth * window.innerHeight * FILL_DENSITY) / tileFootprint,
  );

  return isMobile
    ? Math.max(MOBILE_FLOOR, Math.min(dynamic, MOBILE_CEILING))
    : Math.max(DESKTOP_FLOOR, Math.min(dynamic, DESKTOP_CEILING));
}

function sample<T>(source: T[], count: number): T[] {
  if (source.length <= count) return source;
  const shuffled = [...source];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function buildDriftItems(images: string[]): DriftItem[] {
  const shown = sample(images, computeCap());

  const cols = Math.max(1, Math.round(Math.sqrt(shown.length * 1.6)));
  const rows = Math.ceil(shown.length / cols);

  return shown.map((src, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    const jitterX = (Math.random() - 0.5) * cellWidth * 0.6;
    const jitterY = (Math.random() - 0.5) * cellHeight * 0.6;

    return {
      src,
      left: Math.min(90, Math.max(8, col * cellWidth + cellWidth / 2 + jitterX)),
      top: Math.min(86, Math.max(12, row * cellHeight + cellHeight / 2 + jitterY)),
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 3,
      rotateAmp: 3 + Math.random() * 5,
      driftAmp: 10 + Math.random() * 12,
    };
  });
}

export default function GalleryOverlay({
  category,
  onClose,
}: {
  category: GalleryCategory;
  onClose: () => void;
}) {
  const [driftItems] = useState<DriftItem[]>(() => buildDriftItems(category.images));
  const [focusedSrc, setFocusedSrc] = useState<string | null>(null);

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
          driftItems.map((item) => (
            <DriftingImage
              key={item.src}
              item={item}
              isFocused={focusedSrc === item.src}
              isDimmed={focusedSrc !== null && focusedSrc !== item.src}
              onToggle={() =>
                setFocusedSrc((current) => (current === item.src ? null : item.src))
              }
            />
          ))
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
