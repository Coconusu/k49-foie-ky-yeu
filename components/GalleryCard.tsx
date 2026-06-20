"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import CardThumbnail from "@/components/CardThumbnail";
import { GRADUATION_KEY } from "@/lib/constants";
import type { GalleryCategory } from "@/lib/gallery";

export default function GalleryCard({
  category,
  onOpen,
  onUploadClick,
}: {
  category: GalleryCategory;
  onOpen: () => void;
  onUploadClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 1.15, 0.55]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 0]);
  const filter = useMotionTemplate`brightness(${brightness})`;
  const boxShadow = useMotionTemplate`0 0 50px rgba(126, 200, 227, ${glow})`;

  return (
    <motion.div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen();
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      style={{ filter, boxShadow }}
      className="glass relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-3xl text-left"
    >
      {category.thumbnails.length > 0 ? (
        <CardThumbnail images={category.thumbnails} alt={category.label} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center">
          <span className="text-4xl">🎓</span>
          <span className="font-be-vietnam text-sm text-white/60">
            Đang chờ ngày tốt nghiệp
          </span>
          {category.key === GRADUATION_KEY && onUploadClick && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onUploadClick();
              }}
              className="glass flex items-center gap-1 rounded-full px-3 py-1.5 font-be-vietnam text-xs text-white/90 hover:text-white"
            >
              <span className="text-base leading-none">+</span> Thêm khoảnh khắc của bạn
            </button>
          )}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/90 to-transparent px-3 pb-3 pt-10">
        <span className="font-itim text-lg text-white md:text-xl">
          {category.label}
        </span>
      </div>
    </motion.div>
  );
}
