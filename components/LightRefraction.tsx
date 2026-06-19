"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function LightRefraction() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const x = useSpring(mx, { stiffness: 40, damping: 20 });
  const y = useSpring(my, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mx.set(event.clientX / window.innerWidth);
      my.set(event.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mx, my]);

  const left = useTransform(x, [0, 1], ["-10%", "40%"]);
  const top = useTransform(y, [0, 1], ["-10%", "30%"]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute h-[60vw] w-[60vw] rounded-full"
        style={{
          left,
          top,
          background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        className="absolute right-[5%] bottom-[5%] h-[40vw] w-[40vw] rounded-full"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle, rgba(126,200,227,0.3), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  );
}
