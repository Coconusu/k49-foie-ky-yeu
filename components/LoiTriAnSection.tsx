import TriAnForm from "@/components/TriAnForm";
import TriAnWall from "@/components/TriAnWall";

export default function LoiTriAnSection() {
  return (
    <section id="loi-tri-an" className="scroll-mt-24 bg-navy-mid px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-itim text-3xl text-white md:text-4xl">Lời tri ân từ K49</h2>
        <p className="mt-2 font-be-vietnam text-white/70">
          Những lời chia sẻ chân thành từ các anh chị K49 gửi tới Khoa Kinh
          tế Quốc tế, như một lời cảm ơn dành cho chặng đường đồng hành, dìu
          dắt và trưởng thành suốt những năm tháng thanh xuân tại Học viện
          Ngoại giao.
        </p>
      </div>

      <div className="mt-10">
        <TriAnForm />
      </div>

      <TriAnWall />
    </section>
  );
}
