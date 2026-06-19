import { getGalleryCategories } from "@/lib/gallery";
import KyYeuGallery from "@/components/KyYeuGallery";

export default function KyYeuSection() {
  const categories = getGalleryCategories();

  return (
    <section id="ky-yeu" className="scroll-mt-24 bg-navy-deep px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-itim text-3xl text-white md:text-4xl">Kỷ yếu chung</h2>
        <p className="mt-2 font-be-vietnam text-white/70">
          Chạm vào từng khung kính để xem lại khoảnh khắc của khối
        </p>
      </div>
      <KyYeuGallery categories={categories} />
    </section>
  );
}
