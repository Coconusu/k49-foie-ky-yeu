"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "framer-motion";

export type TileLayout = {
  left: string;
  top: string;
  width: string;
  height: string;
  z: number;
  origin: string;
  duration: number;
};

export type ScrollRange = { start: number; end: number };

type DriftLayout = TileLayout & {
  driftX: number;
  driftY: number;
  driftDuration: number;
};

export default function CollageTile({
  src,
  layout,
  range,
  scrollYProgress,
  simplified,
  priority,
}: {
  src: string;
  layout: DriftLayout;
  range: ScrollRange;
  scrollYProgress: MotionValue<number>;
  simplified: boolean;
  priority: boolean;
}) {
  const peak = range.start + (range.end - range.start) * 0.35;

  const opacity = useTransform(
    scrollYProgress,
    [range.start, peak, range.end],
    [1, 1, 0],
  );
  const brightness = useTransform(
    scrollYProgress,
    [range.start, peak, range.end],
    [1, 1.6, 0.4],
  );
  const glow = useTransform(
    scrollYProgress,
    [range.start, peak, range.end],
    [0, 0.85, 0],
  );

  // Ép qua useMotionTemplate (giá trị string) thay vì gán trực tiếp số —
  // framer-motion 12.x không đồng bộ đúng style.opacity dạng số lồng trong
  // cấu trúc motion.div này, nhưng template string thì luôn đồng bộ đúng.
  const opacityStyle = useMotionTemplate`${opacity}`;
  const filter = useMotionTemplate`brightness(${brightness})`;
  const boxShadow = useMotionTemplate`0 0 50px rgba(126, 200, 227, ${glow})`;

  return (
    // Khung NGOÀI không có overflow-hidden — box-shadow (glow) cần render
    // ra ngoài viền tile, overflow-hidden ở đây sẽ cắt mất glow hoàn toàn.
    <motion.div
      className="glass absolute rounded-2xl p-1"
      style={{
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        zIndex: layout.z,
        opacity: opacityStyle,
        ...(simplified ? {} : { filter, boxShadow }),
      }}
      animate={{
        x: [0, layout.driftX, 0, -layout.driftX, 0],
        y: [0, -layout.driftY, 0, layout.driftY, 0],
      }}
      transition={{
        x: { duration: layout.driftDuration, repeat: Infinity, ease: "easeInOut" },
        y: { duration: layout.driftDuration * 1.15, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {/* Lớp trong mới làm nhiệm vụ cắt ảnh đúng khung bo góc */}
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <motion.div
          className="relative h-full w-full"
          style={{ transformOrigin: layout.origin }}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: layout.duration, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={src}
            alt="Ảnh tập thể K49 - FOIE"
            fill
            priority={priority}
            sizes="(min-width: 640px) 35vw, 60vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
