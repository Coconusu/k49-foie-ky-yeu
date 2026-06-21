import TriAnForm from "@/components/TriAnForm";
import TriAnWall from "@/components/TriAnWall";

export default function LoiTriAnSection() {
  return (
    <section id="loi-tri-an" className="scroll-mt-24 bg-navy-mid px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-itim text-3xl text-white md:text-4xl">Lời tri ân từ K49</h2>
        <p className="mt-2 font-be-vietnam text-white/70">
          Cuốn lưu bút này là không gian lưu giữ những lời chia sẻ chân
          thành nhất, những cái ôm siết chặt và lòng biết ơn sâu sắc gửi
          tới các thầy cô Khoa Kinh tế Quốc tế – những người đã định hình
          tư duy và nâng đỡ bước chân của sinh viên Khóa 49.
        </p>
      </div>

      <div className="mt-10">
        <TriAnForm />
      </div>

      <TriAnWall />
    </section>
  );
}
