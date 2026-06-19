"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeTributes, type Tribute } from "@/lib/tributes";

export default function TriAnWall() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeTributes((next) => {
      setTributes(next);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (!isLoading && tributes.length === 0) {
    return (
      <p className="mt-12 text-center font-be-vietnam italic text-white/50">
        Chưa có lời tri ân nào — hãy là người đầu tiên ký tên!
      </p>
    );
  }

  return (
    <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence initial={false}>
        {tributes.map((tribute) => (
          <motion.div
            key={tribute.id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass flex flex-col gap-3 rounded-3xl p-5"
          >
            {tribute.signature && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tribute.signature}
                alt={`Chữ ký của ${tribute.name}`}
                className="h-24 w-full rounded-xl bg-white object-contain"
              />
            )}
            <p className="font-be-vietnam text-sm leading-relaxed text-white/90">
              &ldquo;{tribute.message}&rdquo;
            </p>
            <p className="font-itim text-base text-blue-light">— {tribute.name}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
