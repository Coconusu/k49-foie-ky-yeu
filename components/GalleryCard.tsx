"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import CardThumbnail from "@/components/CardThumbnail";
import type { GalleryCategory } from "@/lib/gallery";

export default function GalleryCard({
  category,
  onOpen,
}: {
  category: GalleryCategory;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 1.15, 0.55]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 0]);
  const filter = useMotionTemplate`brightness(${brightness})`;
  const boxShadow = useMotionTemplate`0 0 50px rgba(126, 200, 227, ${glow})`;

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={onOpen}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      style={{ filter, boxShadow }}
      className="glass relative aspect-[4/5] w-full overflow-hidden rounded-3xl text-left"
    >
      {category.thumbnails.length > 0 ? (
        <CardThumbnail images={category.thumbnails} alt={category.label} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center">
          <span className="text-4xl">🎓</span>
          <span className="font-be-vietnam text-sm text-white/60">
            Đang chờ ngày tốt nghiệp
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/90 to-transparent px-3 pb-3 pt-10">
        <span className="font-itim text-lg text-white md:text-xl">
          {category.label}
        </span>
      </div>
    </motion.button>
  );
}
