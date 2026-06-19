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

export default function CollageTile({
  src,
  layout,
  range,
  scrollYProgress,
  simplified,
  priority,
}: {
  src: string;
  layout: TileLayout;
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
    [1, 1.5, 0.4],
  );
  const glow = useTransform(
    scrollYProgress,
    [range.start, peak, range.end],
    [0, 0.7, 0],
  );

  // Ép qua useMotionTemplate (giá trị string) thay vì gán trực tiếp số —
  // framer-motion 12.x không đồng bộ đúng style.opacity dạng số lồng trong
  // cấu trúc motion.div này, nhưng template string thì luôn đồng bộ đúng.
  const opacityStyle = useMotionTemplate`${opacity}`;
  const filter = useMotionTemplate`brightness(${brightness})`;
  const boxShadow = useMotionTemplate`0 0 40px rgba(126, 200, 227, ${glow})`;

  return (
    <motion.div
      className="glass absolute overflow-hidden rounded-2xl p-1"
      style={{
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        zIndex: layout.z,
        opacity: opacityStyle,
        ...(simplified ? {} : { filter, boxShadow }),
      }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-xl"
        style={{ transformOrigin: layout.origin }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
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
    </motion.div>
  );
}
