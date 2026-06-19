"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import CollageTile, { type TileLayout } from "@/components/CollageTile";
import { sampleRandom } from "@/lib/random";

// Bố cục cố định: 3 ảnh to làm nền (z thấp) + 5 ảnh nhỏ đè lên (z cao),
// tất cả nằm gọn trong [0%,100%] để không tràn ra ngoài khung hero.
const LAYOUT: TileLayout[] = [
  { left: "0%", top: "0%", width: "54%", height: "58%", z: 10, origin: "top left", duration: 18 },
  { left: "40%", top: "6%", width: "54%", height: "54%", z: 11, origin: "top right", duration: 20 },
  { left: "6%", top: "46%", width: "50%", height: "52%", z: 10, origin: "bottom left", duration: 16 },
  { left: "8%", top: "8%", width: "20%", height: "24%", z: 20, origin: "center", duration: 15 },
  { left: "60%", top: "6%", width: "19%", height: "22%", z: 21, origin: "top right", duration: 19 },
  { left: "72%", top: "50%", width: "22%", height: "26%", z: 20, origin: "bottom right", duration: 17 },
  { left: "30%", top: "64%", width: "20%", height: "24%", z: 22, origin: "bottom left", duration: 20 },
  { left: "50%", top: "38%", width: "18%", height: "22%", z: 23, origin: "center", duration: 16 },
];

export default function HeroCollage({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const [sources, setSources] = useState<string[] | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Random ảnh chỉ chạy ở client (sau mount) để mỗi lần reload ra 1 tập
  // ảnh khác nhau mà không gây lệch HTML server/client (hydration mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only randomization, must run post-mount to avoid SSR/client mismatch
    setIsMobile(window.innerWidth < 640);
    setSources(sampleRandom(images, LAYOUT.length));
  }, [images]);

  // Thứ tự "cháy sáng rồi tắt" theo scroll đi theo vị trí top-to-bottom thật
  // của từng ảnh trên màn hình, không theo thứ tự khai báo trong LAYOUT.
  const order = [...LAYOUT.keys()].sort(
    (a, b) => parseFloat(LAYOUT[a].top) - parseFloat(LAYOUT[b].top),
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {sources?.map((src, index) => {
        const rank = order.indexOf(index);
        const range = isMobile
          ? { start: 0, end: 0.4 } // mobile: cả khối fade nhanh cùng lúc, tránh lag
          : { start: rank / LAYOUT.length, end: (rank + 1) / LAYOUT.length };

        return (
          <CollageTile
            key={src}
            src={src}
            layout={LAYOUT[index]}
            range={range}
            scrollYProgress={scrollYProgress}
            simplified={isMobile}
            priority={index === 0}
          />
        );
      })}
    </div>
  );
}
