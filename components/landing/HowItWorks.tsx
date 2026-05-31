const steps = [
  {
    num: "01",
    title: "Browse the directory",
    desc: "Explore hundreds of verified problems from communities across Nigeria. Filter by state, category, or urgency.",
  },
  {
    num: "02",
    title: "Claim a problem",
    desc: "Found one you can solve? Claim it. Share your plan, set a timeline, and let the community know you're on it.",
  },
  {
    num: "03",
    title: "Report back",
    desc: "Done? Submit your solution report with evidence. Community verifies — problem gets marked resolved.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-chalk border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-6">
        {/* header row */}
        <div className="py-12 border-b-2 border-ink flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="font-syne font-extrabold text-5xl md:text-6xl tracking-tight text-ink uppercase leading-none">
            How it
            <br />
            works.
          </h2>
          <p className="font-mono text-[12px] text-muted max-w-xs leading-relaxed">
            No bureaucracy. No gatekeepers. Just problems waiting for people
            willing to act.
          </p>
        </div>

        {/* steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-8 md:p-10 group hover:bg-ink transition-colors duration-200"
            >
              <div className="font-mono font-bold text-[11px] text-brand uppercase tracking-widest mb-6 group-hover:text-brand">
                Step {step.num}
              </div>
              <div className="font-syne font-extrabold text-[5rem] leading-none text-ink/10 group-hover:text-white/10 mb-6 transition-colors">
                {step.num}
              </div>
              <h3 className="font-syne font-bold text-xl text-ink group-hover:text-white mb-3 transition-colors">
                {step.title}
              </h3>
              <p className="font-dm text-sm text-muted group-hover:text-white/60 leading-relaxed transition-colors">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
