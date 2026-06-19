import fs from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

const CATEGORIES = [
  { folder: "01-nhap-hoc", label: "Nhập học" },
  { folder: "02-hoat-dong-clb", label: "Hoạt động CLB" },
  { folder: "03-su-kien-gala", label: "Sự kiện Gala" },
  { folder: "04-da-ngoai", label: "Dã ngoại" },
  { folder: "05-tot-nghiep", label: "Tốt nghiệp" },
];

const THUMBNAIL_CYCLE_COUNT = 6;

export type GalleryCategory = {
  key: string;
  label: string;
  images: string[];
  thumbnails: string[];
};

export function getGalleryCategories(): GalleryCategory[] {
  const imagesRoot = path.join(process.cwd(), "public", "images");

  return CATEGORIES.map(({ folder, label }) => {
    let files: string[] = [];
    try {
      files = fs
        .readdirSync(path.join(imagesRoot, folder))
        .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
    } catch {
      files = [];
    }

    const images = files.map((file) => `/images/${folder}/${file}`);

    return {
      key: folder,
      label,
      images,
      thumbnails: images.slice(0, THUMBNAIL_CYCLE_COUNT),
    };
  });
}
