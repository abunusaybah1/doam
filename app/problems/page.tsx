import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { GrLocation } from "react-icons/gr";
import { BiSolidUpvote } from "react-icons/bi";
import { FaExternalLinkAlt } from "react-icons/fa";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const supabase = await createClient();
  const { filter } = await searchParams;
  const activeFilter =
    filter === "in_progress" || filter === "completed" ? filter : "all";

  const statusQuery =
    activeFilter === "in_progress"
      ? ["in_progress"]
      : activeFilter === "completed"
        ? ["completed"]
        : ["active", "in_progress"];

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
            <p className="  font-bold text-[.7rem] tracking-[.2em] uppercase text-ember mb-2">
              Real problems, Real Impact...
            </p>
            <h1
              className=" font-black leading-[.92] text-cream sm:w-full md:w-[80%] lg:w-[60%]"
              style={{ fontSize: "clamp(2.4rem,4.5vw,4rem)" }}
            >
              Problems waiting for who will Do.Am
            </h1>
          </div>

          {/* <Link
            href="/problems/completed"
            className="text-[0.75rem] uppercase tracking-wide font-bold text-orange hover:text-ember transition-colors"
          >
            See solved problems
          </Link> */}
        </div>

        {!problems?.length && (
          <p className="text-parch/50 text-sm">No problems reported yet.</p>
        )}

        <div className="flex flex-wrap gap-6">
          {problems?.map((problem) => (
            <div
              key={problem.id}
              className="flex flex-col bg-surface rounded-lg overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(255,140,0,0.15)] hover:-translate-y-1 w-full md:w-[47%] lg:w-[31%]"
            >
              {/* image with condition + status badges */}
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

              {/* content block below image */}
              <div className="flex flex-col gap-3 p-5 flex-1 border-t border-t-border">
                <div className="flex items-center justify-between">
                  {/* <p className="text-[0.65rem] uppercase tracking-widest text-umber">
                    {problem.category}
                  </p> */}
                  <p className="flex items-center gap-1 text-[0.7rem] text-umber">
                    <GrLocation />
                    {problem.lga}, {problem.state}
                  </p>
                </div>

                <h3 className=" text-xl text-parch leading-snug">
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
