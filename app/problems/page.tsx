import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { GrLocation } from "react-icons/gr";
import { BiSolidUpvote } from "react-icons/bi";
import { FaExternalLinkAlt } from "react-icons/fa";

const FILTER_TABS = [
  { label: "All", value: null, emptyMessage: "No problems reported yet." },
  {
    label: "Available",
    value: "active",
    emptyMessage: "No available problems right now.",
  },
  {
    label: "In progress",
    value: "in_progress",
    emptyMessage: "No problems in progress right now.",
  },
  {
    label: "Completed",
    value: "completed",
    emptyMessage: "No completed problems yet.",
  },
];

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const supabase = await createClient();
  const { filter } = await searchParams;

  const activeTab =
    FILTER_TABS.find((t) => t.value === filter) ?? FILTER_TABS[0];

  const statusQuery = activeTab.value
    ? [activeTab.value]
    : ["active", "in_progress", "completed"];

  const { data: problems } = await supabase
    .from("problems")
    .select(
      "id, heading, description, category, condition, state, lga, endorsement_count, thumbnail_url, status",
    )
    .in("status", statusQuery)
    .order("created_at", { ascending: false });

  const statusLabel: Record<string, string> = {
    active: "Available",
    in_progress: "In progress",
    completed: "Solved",
  };

  const statusColor: Record<string, string> = {
    active: "bg-blue-600",
    in_progress: "bg-amber-500",
    completed: "bg-green-600",
  };

  return (
    <main className="min-h-screen bg-bark">
      <div className="px-6 md:px-10 py-10">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-[.7rem] tracking-[.2em] uppercase text-ember mb-2">
              Real problems, Real Impact...
            </p>
            <h1
              className="font-black leading-[.92] text-cream sm:w-full md:w-[80%] lg:w-[60%]"
              style={{ fontSize: "clamp(2.4rem,4.5vw,4rem)" }}
            >
              Problems waiting for who will Do.Am
            </h1>
          </div>
        </div>
        <div className="border-t border-border pb-6 w-screen relative -left-10"></div>
        <p className="mb-4">Filter problems by Status</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTER_TABS.map((tab) => {
            const href = tab.value
              ? `/problems?filter=${tab.value}`
              : "/problems";
            const isActive = activeTab.value === tab.value;
            return (
              <Link
                key={tab.label}
                href={href}
                className={`text-[0.7rem] uppercase tracking-widest px-4 py-2 border transition-colors ${
                  isActive
                    ? "bg-orange text-parch border-orange"
                    : "border-border text-parch/60 hover:border-orange/50"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {!problems?.length && (
          <p className="text-parch/50 text-sm">{activeTab.emptyMessage}</p>
        )}

        <div className="flex flex-wrap gap-6">
          {problems?.map((problem) => (
            <div
              key={problem.id}
              className="flex flex-col bg-surface rounded-lg overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(255,140,0,0.15)] hover:-translate-y-1 w-full md:w-[47%] lg:w-[31%]"
            >
              <div className="relative h-48 w-full">
                {problem.thumbnail_url ? (
                  <Image
                    src={problem.thumbnail_url}
                    alt={problem.heading}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-bark" />
                )}

                <span
                  className={`absolute top-3 right-3 text-[10px] text-parch ${
                    problem.condition === "emergency"
                      ? "bg-red-500"
                      : problem.condition === "critical"
                        ? "bg-orange-500"
                        : "bg-green-600"
                  } px-2.5 py-1 rounded-full uppercase font-bold tracking-wide`}
                >
                  {problem.condition}
                </span>

                <span
                  className={`absolute top-0 left-0 text-[10px] text-parch ${
                    statusColor[problem.status] ?? "bg-umber"
                  } px-2.5 py-1 rounded- uppercase font-bold tracking-wide`}
                >
                  {statusLabel[problem.status] ?? problem.status}
                </span>
              </div>

              <div className="flex flex-col gap-3 p-5 flex-1 border-t border-t-border">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1 text-[0.7rem] text-umber">
                    <GrLocation />
                    {problem.lga}, {problem.state}
                  </p>
                </div>

                <h3 className="text-xl text-parch leading-snug">
                  {problem.heading}
                </h3>

                <p className="text-[0.85rem] text-parch/60 leading-relaxed line-clamp-2 flex-1">
                  {problem.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border mt-2">
                  <p className="flex items-center gap-1.5 text-[0.75rem] text-parch/70">
                    <BiSolidUpvote className="text-orange -mt-0.5" />
                    {problem.endorsement_count} endorsement
                    {problem.endorsement_count !== 1 ? "s" : ""}
                  </p>

                  <Link
                    href={`/problems/${problem.id}`}
                    className="flex items-center gap-1.5 text-[0.75rem] uppercase tracking-wide font-bold text-orange hover:text-ember transition-colors"
                  >
                    View details
                    <FaExternalLinkAlt className="scale-90" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
