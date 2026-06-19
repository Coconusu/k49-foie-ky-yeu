"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type DriftItem = {
  src: string;
  left: number;
  top: number;
  duration: number;
  delay: number;
  rotateAmp: number;
  driftAmp: number;
};

export default function DriftingImage({
  item,
  isFocused,
  isDimmed,
  onToggle,
}: {
  item: DriftItem;
  isFocused: boolean;
  isDimmed: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className="absolute h-24 w-24 cursor-pointer overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md sm:h-32 sm:w-32"
      style={{ left: `${item.left}%`, top: `${item.top}%`, zIndex: isFocused ? 30 : 10 }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: isDimmed ? 0.25 : 1,
        scale: isFocused ? 1.1 : 1,
        x: isFocused ? 0 : [0, item.driftAmp, -item.driftAmp, 0],
        y: isFocused ? 0 : [0, -item.driftAmp, item.driftAmp, 0],
        rotate: isFocused ? 0 : [0, item.rotateAmp, -item.rotateAmp, 0],
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        x: isFocused
          ? { duration: 0.3 }
          : { duration: item.duration, delay: item.delay, repeat: Infinity, ease: "easeInOut" },
        y: isFocused
          ? { duration: 0.3 }
          : { duration: item.duration, delay: item.delay, repeat: Infinity, ease: "easeInOut" },
        rotate: isFocused
          ? { duration: 0.3 }
          : { duration: item.duration, delay: item.delay, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <Image src={item.src} alt="" fill sizes="160px" className="object-cover" />
    </motion.div>
  );
}
