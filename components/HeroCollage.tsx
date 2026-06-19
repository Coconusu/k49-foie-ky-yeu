"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type CollageTile = {
  src: string;
  left: string;
  top: string;
  width: string;
  height: string;
  z: number;
  origin: string;
  duration: number;
};

const tiles: CollageTile[] = [
  // lớp nền — vài ảnh to
  { src: "/images/01-nhap-hoc/z7835022534399_4ea8460a0580ad9eed488013e81041c9.jpg", left: "-6%", top: "-6%", width: "56%", height: "62%", z: 10, origin: "top left", duration: 18 },
  { src: "/images/03-su-kien-gala/DSC03927.JPG", left: "38%", top: "8%", width: "52%", height: "56%", z: 11, origin: "top right", duration: 20 },
  { src: "/images/04-da-ngoai/AI6A6898.jpeg", left: "4%", top: "42%", width: "50%", height: "58%", z: 10, origin: "bottom left", duration: 16 },
  // lớp đè lên — ảnh nhỏ hơn, lệch vị trí
  { src: "/images/02-hoat-dong-clb/IMG_4349_Original.JPG", left: "10%", top: "10%", width: "20%", height: "24%", z: 20, origin: "center", duration: 15 },
  { src: "/images/01-nhap-hoc/z7938926022342_c56a366091763109b1aa18772106f7d4.jpg", left: "62%", top: "6%", width: "19%", height: "22%", z: 21, origin: "top right", duration: 19 },
  { src: "/images/03-su-kien-gala/IMG_8552.JPG", left: "74%", top: "48%", width: "21%", height: "26%", z: 20, origin: "bottom right", duration: 17 },
  { src: "/images/02-hoat-dong-clb/IMG_5210_Original.JPG", left: "32%", top: "62%", width: "20%", height: "24%", z: 22, origin: "bottom left", duration: 20 },
  { src: "/images/04-da-ngoai/IMG_5469.JPG", left: "52%", top: "36%", width: "18%", height: "22%", z: 23, origin: "center", duration: 16 },
];

export default function HeroCollage() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {tiles.map((tile, index) => (
        <div
          key={tile.src}
          className="glass absolute overflow-hidden rounded-2xl p-1"
          style={{ left: tile.left, top: tile.top, width: tile.width, height: tile.height, zIndex: tile.z }}
        >
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-xl"
            style={{ transformOrigin: tile.origin }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: tile.duration, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={tile.src}
              alt="Ảnh tập thể K49 - FOIE"
              fill
              priority={index === 0}
              sizes="(min-width: 640px) 35vw, 60vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
