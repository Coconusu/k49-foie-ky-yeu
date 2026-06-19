import AnimatedCounter from "@/components/AnimatedCounter";

export default function CounterSection() {
  return (
    <section className="bg-gradient-to-br from-navy-deep via-navy-mid to-navy-mid px-4 py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        <div className="glass rounded-3xl p-8 text-center">
          <p className="font-itim text-4xl text-white md:text-5xl">
            <AnimatedCounter to={4} />
            <span className="ml-1">năm</span>
          </p>
          <p className="mt-2 font-be-vietnam text-sm uppercase tracking-wide text-white/70">
            2022 - 2026
          </p>
        </div>

        <div className="glass rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center gap-6 font-itim text-4xl text-white md:text-5xl">
            <span>
              <AnimatedCounter to={2} />
              <span className="ml-1 text-2xl">ngành</span>
            </span>
            <span className="h-10 w-px bg-white/20" />
            <span>
              <AnimatedCounter to={6} />
              <span className="ml-1 text-2xl">lớp</span>
            </span>
          </div>
          <p className="mt-2 font-be-vietnam text-sm text-white/70">
            Kinh doanh quốc tế &amp; Kinh tế quốc tế
          </p>
        </div>

        <div className="glass rounded-3xl p-8 text-center">
          <p className="font-itim text-4xl text-white md:text-5xl">
            <AnimatedCounter to={440} />
          </p>
          <p className="mt-2 font-be-vietnam text-sm uppercase tracking-wide text-white/70">
            Thành viên
          </p>
        </div>
      </div>
    </section>
  );
}
