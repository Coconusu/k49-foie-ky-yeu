import TriAnForm from "@/components/TriAnForm";
import TriAnWall from "@/components/TriAnWall";

export default function LoiTriAnSection() {
  return (
    <section id="loi-tri-an" className="scroll-mt-24 bg-navy-mid px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-itim text-3xl text-white md:text-4xl">Lời tri ân từ K49</h2>
        <p className="mt-2 font-be-vietnam text-white/70">
          Mỗi chữ ký, mỗi lời nhắn gửi tại đây chính là món quà tri ân ý
          nghĩa nhất của sinh viên K49 dành tặng Khoa Kinh tế Quốc tế, ghi
          dấu chặng đường đồng hành và trưởng thành dưới mái nhà DAV.
        </p>
      </div>

      <div className="mt-10">
        <TriAnForm />
      </div>

      <TriAnWall />
    </section>
  );
}
