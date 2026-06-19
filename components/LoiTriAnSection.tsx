import TriAnForm from "@/components/TriAnForm";
import TriAnWall from "@/components/TriAnWall";

export default function LoiTriAnSection() {
  return (
    <section id="loi-tri-an" className="scroll-mt-24 bg-navy-mid px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-itim text-3xl text-white md:text-4xl">Lời tri ân</h2>
        <p className="mt-2 font-be-vietnam text-white/70">
          Ký tên và gửi lại một lời nhắn cho K49 - FOIE
        </p>
      </div>

      <div className="mt-10">
        <TriAnForm />
      </div>

      <TriAnWall />
    </section>
  );
}
