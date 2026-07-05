import Link from "next/link";
import { FaUsers, FaTools, FaBullhorn } from "react-icons/fa";

const STEPS = [
  {
    number: "01",
    title: "See it... Report it.",
    body: "Anyone in a community can document a problem — location, photos, a description of what's wrong and how long it's been that way. It takes a few minutes and creates a public report anyone can see.",
  },
  {
    number: "02",
    title: "It lives on the record.",
    body: "Every report becomes part of a public, permanent documentary of community issues. Nothing gets buried or forgotten — it stays visible and searchable until it's actually resolved, not just until people stop talking about it.",
  },
  {
    number: "03",
    title: "Solvers step in.",
    body: "NGOs, engineers, developers, and volunteers browse the list of open problems and claim what they can realistically fix. They commit to a plan and a timeline, and give real updates as work progresses.",
  },
  {
    number: "04",
    title: "Progress is tracked, not assumed.",
    body: "Claimed problems move through clear stages — claimed, in progress, completed — so the community can see exactly what's happening, not just take someone's word for it.",
  },
];

const ROLES = [
  {
    icon: FaBullhorn,
    title: "Community members",
    body: "You live with the problem every day — the pothole, the broken pump, the school with no chairs. Reporting it takes minutes and puts it somewhere it can't be ignored.",
    points: [
      "Submit a report with photos, location, and details",
      "Endorse problems you've also experienced",
      "Track progress as solvers pick it up",
    ],
  },
  {
    icon: FaTools,
    title: "Problem solvers",
    body: "You have the skills, time, or resources to actually fix something. Browse real, documented problems and claim the ones you can act on.",
    points: [
      "Browse open problems by category and location",
      "Claim a problem and submit your plan and timeline",
      "Mark progress and submit proof once it's done",
    ],
  },
  {
    icon: FaUsers,
    title: "Everyone else",
    body: "Even if you're not reporting or solving, endorsing a problem adds weight — it shows solvers and organizations that this issue matters to more than one person.",
    points: [
      "Browse the full public record of problems",
      "Endorse the ones that matter to you",
      "Share problems that need more attention",
    ],
  },
];

const FAQS = [
  {
    q: "Who can report a problem?",
    a: "Anyone with an account. You don't need to be an expert or an organization — just someone who's seen a real issue in their community.",
  },
  {
    q: "Who can claim and solve a problem?",
    a: "Anyone who registers as a solver. Once your solver profile is approved, you can claim open problems that match what you're able to help with.",
  },
  {
    q: "What happens after I claim a problem?",
    a: "You submit a plan and a target timeline. Your claim is reviewed, and once approved, the problem moves to 'in progress' until you mark it complete.",
  },
  {
    q: "Is the record really permanent?",
    a: "Yes. Reports stay visible and searchable even after they're resolved, so there's a real history of what was broken and what got fixed.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-bark">
      <div className="px-6 md:px-10 py-16 max-w-5xl mx-auto">
        {/* hero */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <p className="font-bold text-[.7rem] tracking-[.2em] uppercase text-ember mb-3">
            How Do-am works
          </p>
          <h1
            className="font-black leading-[.95] text-cream"
            style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}
          >
            From a reported problem to a solved problem
          </h1>
          <p className="mt-5 text-parch/70 text-[0.95rem] leading-relaxed">
            Do-am connects the people who see problems every day with the people
            who can actually fix them... with a public record that holds everyone
            accountable in between.
          </p>
        </div>

        {/* steps */}
        <div className="mb-20 flex flex-col gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex gap-6 border-b border-border pb-8 last:border-b-0"
            >
              <div className="font-playfair text-4xl text-orange shrink-0 w-16">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl text-parch mb-2">{step.title}</h3>
                <p className="text-[0.9rem] text-parch/60 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* roles */}
        <div className="mb-20">
          <h2 className="font-playfair text-2xl md:text-3xl text-orange mb-10 text-center">
            Who is Do-Am for?
          </h2>
          <div className="flex flex-wrap gap-6">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="flex-1 min-w-70 bg-surface border border-border p-6 flex flex-col gap-4"
              >
                <role.icon className="text-orange text-2xl" />
                <h3 className="text-lg text-parch">{role.title}</h3>
                <p className="text-[0.85rem] text-parch/60 leading-relaxed">
                  {role.body}
                </p>
                <ul className="flex flex-col gap-2 mt-2">
                  {role.points.map((point) => (
                    <li
                      key={point}
                      className="text-[0.8rem] text-parch/70 flex items-start gap-2"
                    >
                      <span className="text-orange mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* faq */}
        <div className="mb-20">
          <h2 className="font-playfair text-2xl md:text-3xl text-orange mb-10 text-center">
            Common questions
          </h2>
          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-b border-border pb-6">
                <h3 className="text-[0.95rem] text-parch mb-2 font-bold">
                  {faq.q}
                </h3>
                <p className="text-[0.85rem] text-parch/60 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* closing CTA */}
        <div className="text-center bg-surface border border-border py-12 px-6">
          <h2 className="font-playfair text-2xl md:text-3xl text-orange mb-4">
            Ready to be part of it?
          </h2>
          <p className="text-parch/60 text-[0.9rem] mb-8 max-w-md mx-auto">
            Report a problem in your community, or start solving the ones
            already waiting.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-orange text-parch text-[0.75rem] uppercase tracking-widest px-8 py-3.5 hover:bg-ember transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
