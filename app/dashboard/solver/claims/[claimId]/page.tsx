import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";

const STATUS_COPY: Record<string, { label: string; color: string }> = {
  pending_approval: {
    label: "Awaiting admin approval",
    color: "text-amber-500 border-amber-500/40",
  },
  active: {
    label: "Approved — in progress",
    color: "text-orange border-orange/40",
  },
  completed: {
    label: "Completed",
    color: "text-green-500 border-green-500/40",
  },
  abandoned: {
    label: "Abandoned — missed deadline",
    color: "text-red-500 border-red-500/40",
  },
  rejected: {
    label: "Rejected by admin",
    color: "text-parch/50 border-border",
  },
  withdrawn: { label: "Withdrawn", color: "text-parch/50 border-border" },
};

type ProblemShape = {
  id: string;
  heading: string;
  description: string;
  category: string;
  condition: string;
  state: string;
  lga: string;
  address: string | null;
  status: string;
  endorsement_count: number;
  thumbnail_url: string | null;
  people_affected: number | null;
  duration: string;
};

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawClaim, error: claimError } = await supabase
    .from("claims")
    .select(
      `
      id, solver_id, plan, timeline, status, claimed_at, completed_at, abandoned_at, abandon_reason,
      problems ( id, heading, description, category, condition, state, lga, address,
        status, endorsement_count, thumbnail_url, people_affected, duration )
    `,
    )
    .eq("id", claimId)
    .single();

  console.log(
    "=== CLAIM DEBUG ===",
    JSON.stringify({ claimId, rawClaim, claimError }, null, 2),
  );

  if (!rawClaim) notFound();
  if (rawClaim.solver_id !== user.id) notFound();

  const claim = rawClaim as typeof rawClaim & { problems: ProblemShape | null };
  const problem = claim.problems;
  const statusInfo = STATUS_COPY[claim.status] ?? {
    label: claim.status,
    color: "text-umber border-border",
  };

  return (
    <main className="min-h-screen bg-bark">
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-10 flex flex-col gap-6">
        <Link
          href="/dashboard/solver"
          className="text-[0.7rem] uppercase tracking-widest text-orange hover:text-ember transition-colors w-fit"
        >
          ← Back to solver dashboard
        </Link>

        <div
          className={`flex flex-col gap-1 border px-5 py-4 bg-surface ${statusInfo.color}`}
        >
          <p className="text-[0.68rem] uppercase tracking-widest font-bold">
            {statusInfo.label}
          </p>
          {claim.status === "abandoned" && claim.abandon_reason && (
            <p className="text-[0.85rem] text-parch/70 mt-1">
              <span className="text-umber">Reason given:</span>{" "}
              {claim.abandon_reason}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <h1 className="font-playfair text-2xl md:text-3xl text-parch">
            {problem?.heading ?? "Problem no longer available"}
          </h1>

          {problem && (
            <>
              <p className="flex items-center gap-1 text-[0.75rem] text-umber">
                <GrLocation />
                {problem.address && `${problem.address}, `}
                {problem.lga}, {problem.state} · {problem.category}
              </p>
              <p className="text-[0.9rem] text-parch/80 leading-relaxed whitespace-pre-line">
                {problem.description}
              </p>
              <Link
                href={`/problems/${problem.id}`}
                className="text-[0.72rem] uppercase tracking-wide font-bold text-orange hover:text-ember transition-colors w-fit"
              >
                View full problem page →
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <h2 className="text-[0.7rem] uppercase tracking-widest text-umber">
            Your claim details
          </h2>
          <div className="flex flex-col gap-2 bg-surface border border-border px-5 py-4">
            <p className="text-[0.85rem] text-parch/80">
              <span className="text-umber">Your plan:</span> {claim.plan}
            </p>
            <p className="text-[0.85rem] text-parch/80">
              <span className="text-umber">Target completion:</span>{" "}
              {claim.timeline}
            </p>
            <p className="text-[0.7rem] uppercase tracking-widest text-umber pt-2 border-t border-border mt-1">
              Requested {new Date(claim.claimed_at).toLocaleDateString()}
              {claim.completed_at &&
                ` · Completed ${new Date(claim.completed_at).toLocaleDateString()}`}
              {claim.abandoned_at &&
                ` · Abandoned ${new Date(claim.abandoned_at).toLocaleDateString()}`}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
