export default function Hero() {
  return (
    <section className="min-h-screen pt-16 bg-chalk border-b-2 border-ink overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 h-full">
        {/* top label row */}
        <div className="flex items-center gap-4 pt-16 pb-8 border-b border-ink/20">
          <span className="font-mono text-[11px] text-muted uppercase tracking-widest">
            Est. 2026
          </span>
          <span className="w-1 h-1 bg-muted rounded-full" />
          <span className="font-mono text-[11px] text-muted uppercase tracking-widest">
            Nigeria
          </span>
          <span className="w-1 h-1 bg-muted rounded-full" />
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-brand uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
            Live now
          </span>
        </div>

        {/* main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 min-h-[70vh]">
          {/* left — headline */}
          <div className="flex flex-col justify-center py-12 lg:border-r-2 lg:border-ink lg:pr-12">
            <h1 className="font-syne font-extrabold text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.92] tracking-[-3px] text-ink uppercase">
              Nigeria
              <br />
              has <span className="text-brand italic">prob</span>
              <br />
              lems.
            </h1>
            <div className="mt-8 flex items-start gap-6">
              <div className="w-12 h-0.5 bg-brand mt-3 flex-shrink-0" />
              <p className="text-muted text-base leading-relaxed max-w-sm">
                DoAm is a directory of real community problems across Nigeria —
                open for anyone ready to step up and fix something.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#problems"
                className="bg-brand text-white font-mono font-bold text-[13px] px-8 py-4 border-2 border-ink hover:bg-ink transition-colors"
              >
                Browse problems →
              </a>

              <a
                href="#join"
                className="bg-transparent text-ink font-mono font-bold text-[13px] px-8 py-4 border-2 border-ink hover:bg-ink hover:text-white transition-colors"
              >
                Submit a problem
              </a>
            </div>
          </div>

          {/* right — stat block */}
          <div className="hidden lg:flex flex-col justify-end pb-12 pl-12">
            <div className="space-y-0">
              {[
                { num: "840+", label: "Problems listed" },
                { num: "213", label: "Solved so far" },
                { num: "36", label: "States covered" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`py-6 ${i !== 2 ? "border-b border-ink/20" : ""}`}
                >
                  <div className="font-syne font-extrabold text-5xl text-ink leading-none">
                    {s.num}
                  </div>
                  <div className="font-mono text-[11px] text-muted uppercase tracking-widest mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-brand p-5">
              <p className="font-mono text-[11px] text-white/70 uppercase tracking-widest mb-1">
                Tagline
              </p>
              <p className="font-syne font-bold text-xl text-white leading-tight">
                See the problem.
                <br />
                Be the solution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
