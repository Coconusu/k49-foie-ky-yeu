import type { Metadata } from "next";
import { Itim, Be_Vietnam_Pro } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const itim = Itim({
  variable: "--font-itim",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "K49 - FOIE | Kỷ yếu",
  description:
    "Kỷ yếu khối K49, Khoa Kinh tế Quốc tế (FOIE), Học viện Ngoại giao Việt Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${itim.variable} ${beVietnamPro.variable}`}>
      <body className="bg-navy-deep font-be-vietnam text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
