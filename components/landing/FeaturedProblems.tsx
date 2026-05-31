type Problem = {
  tag: string;
  location: string;
  age: string;
  title: string;
  desc: string;
  followers: number;
  urgent?: boolean;
};

const problems: Problem[] = [
  {
    tag: "Infrastructure",
    location: "Lagos",
    age: "3 days ago",
    title: "Broken streetlights on Ago Palace Way, Okota",
    desc: "Over 200 residents walking in darkness. Crime rising since last month.",
    followers: 47,
    urgent: true,
  },
  {
    tag: "Health",
    location: "Kano",
    age: "1 week ago",
    title: "No functioning borehole in Gwale LGA community",
    desc: "Residents walk 4km daily for water. Children miss school mornings.",
    followers: 91,
  },
  {
    tag: "Education",
    location: "Enugu",
    age: "5 days ago",
    title: "Primary school in Udi has no chairs or desks",
    desc: "310 pupils sitting on bare floors for 2 full academic sessions.",
    followers: 63,
  },
];

export default function FeaturedProblems() {
  return (
    <section id="problems" className="bg-chalk border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-6">
        {/* header */}
        <div className="py-12 border-b-2 border-ink flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] text-brand uppercase tracking-widest">
              — Featured problems
            </span>
            <h2 className="font-syne font-extrabold text-5xl md:text-6xl tracking-tight text-ink uppercase leading-none mt-2">
              Pick one.
              <br />
              DoAm.
            </h2>
          </div>
          <button className="font-mono text-[12px] text-ink border-2 border-ink px-5 py-2.5 hover:bg-ink hover:text-white transition-colors self-start md:self-auto">
            View all problems →
          </button>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink">
          {problems.map((p) => (
            <div
              key={p.title}
              className="p-8 flex flex-col gap-4 group hover:bg-ink transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[10px] text-brand uppercase tracking-widest border border-brand px-2 py-1">
                  {p.tag}
                </span>
                {p.urgent && (
                  <span className="font-mono text-[10px] text-brand uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                    Urgent
                  </span>
                )}
              </div>

              <div>
                <p className="font-mono text-[11px] text-muted group-hover:text-white/50 mb-2 transition-colors">
                  {p.location} · {p.age}
                </p>
                <h3 className="font-syne font-bold text-lg text-ink group-hover:text-white leading-snug transition-colors">
                  {p.title}
                </h3>
              </div>

              <p className="font-dm text-sm text-muted group-hover:text-white/60 leading-relaxed flex-1 transition-colors">
                {p.desc}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-ink/10 group-hover:border-white/10 transition-colors">
                <span className="font-mono text-[11px] text-muted group-hover:text-white/40 transition-colors">
                  {p.followers} following
                </span>
                <button className="bg-brand text-white font-mono font-bold text-[11px] px-4 py-2 border-2 border-brand group-hover:border-white hover:bg-white hover:text-ink transition-colors">
                  DoAm →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
