"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { GalleryCategory } from "@/lib/gallery";

export default function GalleryCard({
  category,
  onOpen,
}: {
  category: GalleryCategory;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="glass relative aspect-[4/5] w-full overflow-hidden rounded-3xl text-left"
    >
      {category.thumbnail ? (
        <Image
          src={category.thumbnail}
          alt={category.label}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
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
