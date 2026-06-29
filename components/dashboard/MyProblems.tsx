type Problem = {
  id: string;
  heading: string;
  category: string;
  status: string;
  condition: string;
  state: string;
  lga: string;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  draft: "text-umber border-umber",
  pending: "text-yellow-500 border-yellow-500",
  active: "text-green-500 border-green-500",
  in_progress: "text-blue-400 border-blue-400",
  completed: "text-parch border-parch",
};

const conditionStyles: Record<string, string> = {
  emergency: "text-red-500",
  critical: "text-orange",
  concern: "text-umber",
};

export default function MyProblems({ problems }: { problems: Problem[] }) {
  if (problems.length === 0) {
    return (
      <div className="border border-border px-6 py-10 text-center">
        <p className="text-umber text-sm">
          You haven&apos;t reported any problems yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-border">
      {problems.map((p, i) => (
        <div
          key={p.id}
          className={`px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-surface transition-colors ${
            i !== problems.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <div className="flex flex-col gap-1">
            <p className="text-parch text-sm font-medium">{p.heading}</p>
            <p className="text-[0.68rem] uppercase tracking-widest text-umber">
              {p.category} · {p.lga}, {p.state}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* condition */}
            <span
              className={`text-[0.65rem] uppercase tracking-widest ${
                conditionStyles[p.condition] ?? "text-umber"
              }`}
            >
              {p.condition}
            </span>

            {/* status badge */}
            <span
              className={`text-[0.65rem] uppercase tracking-widest border px-2 py-0.5 ${
                statusStyles[p.status] ?? "text-umber border-umber"
              }`}
            >
              {p.status.replace("_", " ")}
            </span>

            <a
              href={`/dashboard/problems/${p.id}`}
              className="text-[0.65rem] uppercase tracking-widest text-orange hover:text-ember transition-colors"
            >
              View 
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
