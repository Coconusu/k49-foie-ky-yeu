import HeroCollage from "@/components/HeroCollage";
import LightRefraction from "@/components/LightRefraction";
import ScrollIndicator from "@/components/ScrollIndicator";

export default function Hero() {
  return (
    <section
      id="trang-chu"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <HeroCollage />
      <div className="hero-overlay absolute inset-0" />
      <LightRefraction />

      <div className="relative z-10 px-4 text-center">
        <h1 className="font-itim text-[15vw] leading-none text-white drop-shadow-lg sm:text-7xl md:text-8xl lg:text-9xl">
          K49 - FOIE
        </h1>
        <p className="mt-6 font-be-vietnam text-lg text-white/90 md:text-2xl">
          4 năm Kinh tế vui thế, một thanh xuân
        </p>
      </div>

      <ScrollIndicator />
    </section>
  );
}
