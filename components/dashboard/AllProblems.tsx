import Link from "next/link";
import Image from "next/image";
import { GrLocation } from "react-icons/gr";
import { BiSolidUpvote } from "react-icons/bi";
import { FaExternalLinkAlt } from "react-icons/fa";

type Problem = {
  id: string;
  heading: string;
  description: string;
  category: string;
  status: string;
  condition: string;
  state: string;
  lga: string;
  thumbnail_url: string | null;
  endorsement_count: number;
};

const statusLabel: Record<string, string> = {
  active: "Available",
  in_progress: "In progress",
};

const statusColor: Record<string, string> = {
  active: "bg-blue-600",
  in_progress: "bg-amber-500",
};

export default function AllProblems({ problems }: { problems: Problem[] }) {
  if (problems.length === 0) {
    return (
      <div className="border border-border px-6 py-12 text-center">
        <p className="text-umber text-sm">No open problems yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6">
      {problems.slice(0, 4).map((problem) => (
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
              } px-2.5 py-1 uppercase font-bold tracking-wide`}
            >
              {statusLabel[problem.status] ?? problem.status}
            </span>
          </div>

          <div className="flex flex-col gap-3 p-5 flex-1 border-t border-t-border">
            <p className="flex items-center gap-1 text-[0.7rem] text-umber">
              <GrLocation />
              {problem.lga}, {problem.state}
            </p>

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
  );
}
