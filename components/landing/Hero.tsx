import Link from "next/link";

const liveReports = [
  {
    tag: "Infrastructure",
    text: "Broken streetlights on Lagos-Abeokuta Expressway for 4 months",
    loc: "Agege, Lagos · 2 hrs ago",
  },
  {
    tag: "Water",
    text: "Community borehole non-functional since January",
    loc: "Kuje, Abuja · 5 hrs ago",
  },
  {
    tag: "Waste",
    text: "Refuse dump blocking school gate for weeks",
    loc: "Enugu North · 1 day ago",
  },
];

const stats = [
  { label: "Problems filed", num: "1,204" },
  { label: "In progress", num: "38" },
  { label: "Resolved", num: "91" },
];

export default function Hero() {
  return (
    <section
      className="
     px-5 pt-10 pb-8 md:px-10 md:pt-20 md:pb-14 lg:flex lg:gap-16 lg:items-center"
    >
      <div>
        <p className="text-[#cc4e00] text-[0.65rem] uppercase tracking-[0.2em] mb-4">
          Community problem tracker
        </p>
        <h1 className="font-playfair text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] font-black leading-[1.05] mb-5">
          Your community&apos;s problems,{" "}
          <em className="italic text-[#cc4e00]">documented.</em>
        </h1>
        <p className="font-serif-body font-light text-base sm:text-lg leading-[1.85] text-[#f5f5dc]/65 mb-8">
          Do&minus;am is a living record of the real problems facing local
          communities... reported by the people who live them... solved by the
          people who care.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <Link
            href="/signin"
            className="bg-[#cc4e00] text-[#f5f5dc] text-[0.75rem] uppercase tracking-widest px-6 py-4 text-center hover:bg-[#b34400] transition-colors"
          >
            Get Started!
          </Link>
          {/* <Link
            href="/problems"
            className="text-[#f5f5dc]/55 hover:text-[#f5f5dc] text-[0.75rem] uppercase tracking-widest text-center sm:text-left py-2 transition-opacity"
          >
            Browse problems →
          </Link> */}
        </div>
      </div>

      <div className="mt-10 lg:mt-0">
        <div className="border border-[#2a2a2a] bg-[#141414] p-5">
          <div className="flex items-center gap-2 text-[#cc4e00] text-[0.65rem] uppercase tracking-[0.18em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cc4e00] animate-pulse-dot shrink-0" />
            Most recent reports
          </div>
          <div className="divide-y divide-[#2a2a2a]">
            {liveReports.map((r, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0">
                <p className="text-[#cc4e00] text-[0.6rem] uppercase tracking-widest mb-1">
                  {r.tag}
                </p>
                <p className="text-[0.78rem] leading-[1.65]">{r.text}</p>
                <p className="text-[0.6rem] text-[#f5f5dc]/45 mt-1">{r.loc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-px bg-[#2a2a2a] mt-px">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex-1 min-w-[calc(33.333%-1px)] bg-[#141414] py-4 px-2 text-center"
            >
              <p className="font-playfair text-[1.5rem] sm:text-[1.8rem] font-black text-[#cc4e00]">
                {s.num}
              </p>
              <p className="text-[0.58rem] uppercase tracking-[0.08em] text-[#f5f5dc]/45 mt-1 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
