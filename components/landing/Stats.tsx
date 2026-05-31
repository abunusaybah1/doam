const stats = [
  { big: "840+", label: "Problems documented" },
  { big: "213", label: "Problems solved" },
  { big: "4,700+", label: "Active solvers" },
  { big: "120K+", label: "Nigerians impacted" },
];

export default function Stats() {
  return (
    <section className="bg-brand border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-ink/30 border-b-0">
          {stats.map((s) => (
            <div key={s.label} className="py-14 px-8 text-center">
              <div className="font-syne font-extrabold text-[clamp(2.5rem,5vw,4rem)] text-white leading-none mb-2">
                {s.big}
              </div>
              <div className="font-mono text-[11px] text-white/60 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
