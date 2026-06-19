"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import CollageTile, { type TileLayout } from "@/components/CollageTile";
import { sampleRandom } from "@/lib/random";

// Bố cục cơ sở (tỉ lệ % màn hình): 3 ảnh to làm nền (z thấp) + 5 ảnh nhỏ
// đè lên (z cao). Vị trí thật sẽ được né vùng tròn an toàn quanh chữ ở
// bước render (xem computePxLayout).
const BASE_LAYOUT: TileLayout[] = [
  { left: "0%", top: "0%", width: "54%", height: "58%", z: 10, origin: "top left", duration: 18 },
  { left: "40%", top: "6%", width: "54%", height: "54%", z: 11, origin: "top right", duration: 20 },
  { left: "6%", top: "46%", width: "50%", height: "52%", z: 10, origin: "bottom left", duration: 16 },
  { left: "8%", top: "8%", width: "20%", height: "24%", z: 20, origin: "center", duration: 15 },
  { left: "60%", top: "6%", width: "19%", height: "22%", z: 21, origin: "top right", duration: 19 },
  { left: "72%", top: "50%", width: "22%", height: "26%", z: 20, origin: "bottom right", duration: 17 },
  { left: "30%", top: "64%", width: "20%", height: "24%", z: 22, origin: "bottom left", duration: 20 },
  { left: "50%", top: "38%", width: "18%", height: "22%", z: 23, origin: "center", duration: 16 },
];

const SAFE_ZONE_RADIUS_RATIO = 0.26; // bán kính = 26% cạnh nhỏ hơn của viewport
const MIN_SIZE_RATIO = 0.12; // không co tile nhỏ hơn 12% cạnh nhỏ hơn của viewport

type PxLayout = TileLayout & { x: number; y: number; w: number; h: number };

// Neo tile vào góc/viewport gần nó nhất (luôn nằm trong khung hero), rồi
// co dần kích thước từ góc đó cho tới khi rời hẳn vùng tròn an toàn.
function fitOutsideSafeZone(
  rect: { x: number; y: number; w: number; h: number },
  viewportW: number,
  viewportH: number,
  cx: number,
  cy: number,
  radius: number,
) {
  const anchorLeft = rect.x + rect.w / 2 < viewportW / 2;
  const anchorTop = rect.y + rect.h / 2 < viewportH / 2;
  const minSize = Math.min(viewportW, viewportH) * MIN_SIZE_RATIO;

  let { w, h } = rect;
  const aspect = rect.w / rect.h;

  const place = () => ({
    x: anchorLeft ? 0 : viewportW - w,
    y: anchorTop ? 0 : viewportH - h,
  });

  const distToCenter = (x: number, y: number) => {
    const closestX = Math.max(x, Math.min(cx, x + w));
    const closestY = Math.max(y, Math.min(cy, y + h));
    return Math.hypot(cx - closestX, cy - closestY);
  };

  let { x, y } = place();
  let guard = 0;
  while (distToCenter(x, y) < radius && w > minSize && h > minSize && guard < 300) {
    w *= 0.97;
    h = w / aspect;
    ({ x, y } = place());
    guard += 1;
  }

  return { x, y, w, h };
}

function computePxLayout(viewportW: number, viewportH: number): PxLayout[] {
  const cx = viewportW / 2;
  const cy = viewportH / 2;
  const radius = Math.min(viewportW, viewportH) * SAFE_ZONE_RADIUS_RATIO;

  return BASE_LAYOUT.map((tile) => {
    const baseRect = {
      x: (parseFloat(tile.left) / 100) * viewportW,
      y: (parseFloat(tile.top) / 100) * viewportH,
      w: (parseFloat(tile.width) / 100) * viewportW,
      h: (parseFloat(tile.height) / 100) * viewportH,
    };

    const fitted = fitOutsideSafeZone(baseRect, viewportW, viewportH, cx, cy, radius);

    return { ...tile, ...fitted };
  });
}

export default function HeroCollage({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const [sources, setSources] = useState<string[] | null>(null);
  const [pxLayout, setPxLayout] = useState<PxLayout[] | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Random ảnh + tính toán layout né vùng tròn chỉ chạy ở client (sau mount)
  // để mỗi lần reload ra 1 tập ảnh khác nhau mà không gây lệch HTML server/
  // client (hydration mismatch), và để biết được kích thước viewport thật.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only setup, must run post-mount to avoid SSR/client mismatch
    setIsMobile(window.innerWidth < 640);
    setSources(sampleRandom(images, BASE_LAYOUT.length));
    setPxLayout(computePxLayout(window.innerWidth, window.innerHeight));
  }, [images]);

  // Thứ tự "cháy sáng rồi tắt" theo scroll đi theo vị trí top-to-bottom thật
  // của từng ảnh trên màn hình (sau khi đã né vùng tròn), không theo thứ tự
  // khai báo trong BASE_LAYOUT.
  const order = pxLayout
    ? [...pxLayout.keys()].sort((a, b) => pxLayout[a].y - pxLayout[b].y)
    : [];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {sources?.map((src, index) => {
        if (!pxLayout) return null;
        const tile = pxLayout[index];
        const rank = order.indexOf(index);
        const range = isMobile
          ? { start: 0, end: 0.4 } // mobile: cả khối fade nhanh cùng lúc, tránh lag
          : { start: rank / pxLayout.length, end: (rank + 1) / pxLayout.length };

        return (
          <CollageTile
            key={src}
            src={src}
            layout={{
              ...tile,
              left: `${tile.x}px`,
              top: `${tile.y}px`,
              width: `${tile.w}px`,
              height: `${tile.h}px`,
            }}
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
