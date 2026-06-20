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

  // Với 5 mục, ở grid-cols-2 (mobile) card "Tốt nghiệp" rơi lẻ một mình ở
  // hàng cuối -> tách riêng + tự căn giữa CHỈ ở mobile. Từ sm trở lên (3/5
  // cột), 5 mục luôn lấp vừa các hàng nên giữ nguyên 1 grid như trước.
  const gridCategories = categories.filter((category) => category.key !== "05-tot-nghiep");
  const graduationCategory = categories.find((category) => category.key === "05-tot-nghiep");

  return (
    <>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 sm:hidden">
        {gridCategories.map((category) => (
          <GalleryCard
            key={category.key}
            category={category}
            onOpen={() => setOpenKey(category.key)}
          />
        ))}
      </div>

      {graduationCategory && (
        <div className="mx-auto mt-4 flex max-w-6xl justify-center sm:hidden">
          <div className="w-[calc(50%-0.5rem)]">
            <GalleryCard
              category={graduationCategory}
              onOpen={() => setOpenKey(graduationCategory.key)}
            />
          </div>
        </div>
      )}

      <div className="mx-auto mt-10 hidden max-w-6xl grid-cols-3 gap-6 sm:grid lg:grid-cols-5">
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
