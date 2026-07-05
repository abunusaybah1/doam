import Link from "next/link";

type Counts = {
  total: number;
  pending: number;
  active: number;
  in_progress: number;
  completed: number;
};

export default function StatsStrip({
  counts,
  endorsed,
}: {
  counts: Counts | null;
  endorsed: number;
}) {
  const stats = [
    {
      label: "Total reported",
      value: counts?.total,
      href: "/dashboard/problems",
    },
    {
      label: "Pending review",
      value: counts?.pending,
      href: "/dashboard/problems?status=pending",
    },
    {
      label: "In progress",
      value: counts?.in_progress,
      href: "/dashboard/problems?status=in_progress",
    },
    {
      label: "Completed",
      value: counts?.completed,
      href: "/dashboard/problems?status=completed",
    },
    { label: "Endorsed by you", value: endorsed, href: null },
  ];

  return (
    <div className="flex flex-wrap border border-border">
      {stats.map((s, i) => {
        const content = (
          <>
            <div className="font-playfair text-4xl text-orange mb-1">
              {s.value}
            </div>
            <div className="text-[0.68rem] uppercase tracking-widest text-umber">
              {s.label}
            </div>
          </>
        );
        const cls = `flex-1 min-w-[45%] md:min-w-0 px-6 py-6 ${
          i !== stats.length - 1 ? "border-r border-border" : ""
        }`;
        return s.href ? (
          <Link
            key={s.label}
            href={s.href}
            className={`${cls} hover:bg-surface transition-colors`}
          >
            {content}
          </Link>
        ) : (
          <div key={s.label} className={cls}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
