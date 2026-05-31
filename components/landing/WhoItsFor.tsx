const audience = [
  {
    tag: "01 — Citizen",
    title: "The Problem\nSubmitter",
    desc: "You live with this problem every day. Now you have somewhere to document it — and people who will actually show up.",
    perks: [
      "Submit in minutes",
      "Track who's working on it",
      "Get notified when resolved",
    ],
  },
  {
    tag: "02 — Individual / Professional",
    title: "The Problem\nSolver",
    desc: "You have skills, time, or resources and want to make a real difference. DoAm connects you to problems that match.",
    perks: [
      "Browse by skill or location",
      "Build a solver portfolio",
      "Earn impact credentials",
    ],
  },
  {
    tag: "03 — NGO / Company / Govt",
    title: "The\nOrganization",
    desc: "Use DoAm to coordinate CSR, find problems aligned to your mandate, and report impact to your donors.",
    perks: [
      "Access verified problem data",
      "Sponsor LGA problems",
      "Auto-generate impact reports",
    ],
  },
];

export default function WhoItsFor() {
  return (
    <section id="who" className="bg-chalk border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-6">
        <div className="py-12 border-b-2 border-ink">
          <h2 className="font-syne font-extrabold text-5xl md:text-6xl tracking-tight text-ink uppercase leading-none">
            Who it&apos;s for.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink">
          {audience.map((a) => (
            <div key={a.tag} className="p-8 md:p-10">
              <p className="font-mono text-[10px] text-brand uppercase tracking-widest mb-8">
                {a.tag}
              </p>
              <h3 className="font-syne font-extrabold text-3xl text-ink leading-tight mb-4 whitespace-pre-line">
                {a.title}
              </h3>
              <p className="font-dm text-sm text-muted leading-relaxed mb-8">
                {a.desc}
              </p>
              <ul className="space-y-3">
                {a.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-3 font-mono text-[12px] text-ink"
                  >
                    <span className="w-4 h-[2px] bg-brand flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
