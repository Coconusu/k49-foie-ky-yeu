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

  // Card "Tốt nghiệp" tách riêng khỏi grid-column để tự căn giữa trong hàng
  // riêng của nó, tránh lệch trái khi nó là card lẻ cuối cùng.
  const gridCategories = categories.filter((category) => category.key !== "05-tot-nghiep");
  const graduationCategory = categories.find((category) => category.key === "05-tot-nghiep");

  return (
    <>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
        {gridCategories.map((category) => (
          <GalleryCard
            key={category.key}
            category={category}
            onOpen={() => setOpenKey(category.key)}
          />
        ))}
      </div>

      {graduationCategory && (
        <div className="mx-auto mt-4 flex max-w-6xl justify-center sm:mt-6">
          <div className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)]">
            <GalleryCard
              category={graduationCategory}
              onOpen={() => setOpenKey(graduationCategory.key)}
            />
          </div>
        </div>
      )}

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
