import Image from "next/image";
import Link from "next/link";

type Problem = {
  id: string;
  heading: string;
  category: string;
  status: string;
  condition: string;
  state: string;
  lga: string;
  image_url: string;
  follower_count: number;
  people_affected: number | null;
  created_at: string;
  user_profiles: { full_name: string } | null;
};

const conditionStyles: Record<string, string> = {
  emergency: "text-red-500 border-red-500",
  critical: "text-orange border-orange",
  concern: "text-umber border-umber",
};

export default function AllProblems({
  problems,
  followedIds,
}: {
  problems: Problem[];
  followedIds: string[];
}) {
  if (problems.length === 0) {
    return (
      <div className="border border-border px-6 py-10 text-center">
        <p className="text-umber text-sm">
          No problems have been reported yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {problems.map((p) => (
        <Link
          key={p.id}
          href={`/problems/${p.id}`}
          className="border border-border hover:border-orange/50 bg-surface flex flex-col transition-colors group"
        >
          {/* image */}
          <div className="h-40 bg-border overflow-hidden">
            {p.image_url ? (
              <Image
                src={p.image_url}
                alt={p.heading}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-umber text-[0.7rem] uppercase tracking-widest">
                No image
              </div>
            )}
          </div>

          {/* content */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between">
              <span
                className={`text-[0.62rem] uppercase tracking-widest border px-2 py-0.5 ${
                  conditionStyles[p.condition] ?? "text-umber border-umber"
                }`}
              >
                {p.condition}
              </span>
              {followedIds.includes(p.id) && (
                <span className="text-[0.62rem] uppercase tracking-widest text-umber">
                  Following
                </span>
              )}
            </div>

            <p className="text-parch text-sm font-medium leading-snug flex-1">
              {p.heading}
            </p>

            <p className="text-[0.68rem] uppercase tracking-widest text-umber">
              {p.category} · {p.lga}, {p.state}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-[0.65rem] text-umber">
                {p.follower_count} following
              </span>
              <span className="text-[0.65rem] text-orange uppercase tracking-widest">
                View
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
