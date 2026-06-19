"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import GalleryCard from "@/components/GalleryCard";
import GalleryOverlay from "@/components/GalleryOverlay";
import type { GalleryCategory } from "@/lib/gallery";

export default function KyYeuGallery({
  categories,
}: {
  categories: GalleryCategory[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openCategory = categories.find((category) => category.key === openKey) ?? null;

  return (
    <>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
        {categories.map((category) => (
          <GalleryCard
            key={category.key}
            category={category}
            onOpen={() => setOpenKey(category.key)}
          />
        ))}
      </div>

      <AnimatePresence>
        {openCategory && (
          <GalleryOverlay
            key={openCategory.key}
            category={openCategory}
            onClose={() => setOpenKey(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
