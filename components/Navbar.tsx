"use client";

import { useEffect, useState } from "react";

const navItems = [
  { label: "Trang chủ", href: "#trang-chu" },
  { label: "Kỷ yếu", href: "#ky-yeu" },
  { label: "Lời tri ân", href: "#loi-tri-an" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-itim text-xl text-white">K49 · FOIE</span>
        <ul className="flex gap-6 font-be-vietnam text-sm text-white/90 md:text-base">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="transition-colors hover:text-blue-light"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
