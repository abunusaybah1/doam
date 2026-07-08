import Link from "next/link";
import Image from "next/image";
import { GrLocation } from "react-icons/gr";

type Problem = {
  id: string;
  heading: string;
  category: string;
  status: string;
  condition: string;
  state: string;
  lga: string;
  created_at: string;
  thumbnail_url: string | null;
  endorsement_count: number;
};

const statusStyles: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Pending approval",
    color: "text-yellow-500 border-yellow-500",
  },
  active: { label: "Open", color: "text-blue-400 border-blue-400" },
  in_progress: {
    label: "In progress",
    color: "text-amber-500 border-amber-500",
  },
  completed: { label: "Resolved", color: "text-green-500 border-green-500" },
};

const conditionColor: Record<string, string> = {
  emergency: "bg-red-500",
  critical: "bg-orange-500",
  concern: "bg-green-600",
};

export default function MyProblems({ problems }: { problems: Problem[] }) {
  if (problems.length === 0) {
    return (
      <div className="border border-border px-6 py-12 text-center">
        <p className="text-umber text-sm mb-3">
          You haven&apos;t reported any problems yet.
        </p>
        <Link
          href="/dashboard/report"
          className="text-[0.7rem] uppercase tracking-widest text-orange hover:text-ember transition-colors"
        >
          Report your first problem
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {problems.map((p) => {
        const s = statusStyles[p.status];
        return (
          <div
            key={p.id}
            className="flex gap-4 bg-surface border border-border hover:border-orange/40 transition-colors p-4"
          >
            {/* thumbnail */}
            <div className="relative w-24 h-24 shrink-0 bg-bark overflow-hidden">
              {p.thumbnail_url ? (
                <Image
                  src={p.thumbnail_url}
                  alt={p.heading}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-border" />
              )}
              {/* condition dot */}
              <span
                className={`absolute top-1.5 left-1.5 w-2 h-2 rounded-full ${conditionColor[p.condition] ?? "bg-umber"}`}
              />
            </div>

            {/* content */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <p className="text-parch text-sm font-medium leading-snug line-clamp-2">
                {p.heading}
              </p>
              <p className="flex items-center gap-1 text-[0.68rem] uppercase tracking-widest text-umber">
                <GrLocation className="shrink-0" />
                {p.lga}, {p.state} · {p.category}
              </p>
              <div className="flex items-center gap-3 mt-auto pt-1 flex-wrap">
                <span
                  className={`text-[0.62rem] uppercase tracking-widest border px-2 py-0.5 ${s?.color ?? "text-umber border-umber"}`}
                >
                  {s?.label ?? p.status}
                </span>
                <Link
                  href={`/problems/${p.id}`}
                  className="text-[0.65rem] uppercase tracking-widest text-orange hover:text-ember transition-colors ml-auto"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
