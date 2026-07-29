import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SolverDashboard from "@/components/solver/SolverDashboard";
import BecomeSolverForm from "@/components/solver/BecomeSolverForm";

export default async function SolverPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/dashboard/solver");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      "username, phone, state, lga, is_solver, solver_bio, solver_skills, solver_applied_at, full_name",
    )
    .eq("id", user.id)
    .single();

  const { redirectTo } = await searchParams;

  const isComplete =
    profile?.username && profile?.phone && profile?.state && profile?.lga;

  if (!isComplete) {
    redirect(
      `/dashboard/profile?message=complete_profile&redirectTo=/dashboard/solver`,
    );
  }

  // solver-specific completeness — only relevant once they've actually applied
  const solverProfileIncomplete =
    profile?.is_solver &&
    (!profile?.solver_bio || !profile?.solver_skills?.length);

  if (solverProfileIncomplete) {
    redirect(
      `/dashboard/profile?message=complete_solver_profile&redirectTo=/dashboard/solver`,
    );
  }
  const isPendingReview = !profile?.is_solver && !!profile?.solver_applied_at;

  if (profile?.is_solver) {
    const { data: rawClaims } = await supabase
      .from("claims")
      .select(
        `
        id, plan, timeline, status, claimed_at, completed_at, abandoned_at, abandon_reason, last_activity_at,
        problems ( id, heading, status )
      `,
      )
      .eq("solver_id", user.id)
      .order("claimed_at", { ascending: false });

    // Supabase infers this join as an array even though each claim
    // points to exactly one problem — normalize to a single object
    const claims = (rawClaims ?? []).map((c) => ({
      ...c,
      problems: Array.isArray(c.problems)
        ? (c.problems[0] ?? null)
        : c.problems,
    }));

    return (
      <main className="min-h-screen bg-bark">
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-10 flex flex-col gap-6">
          <SolverDashboard profile={profile} claims={claims} />
          <Link
            href="/problems"
            className="text-[0.7rem] uppercase tracking-widest bg-orange text-parch px-5 py-2.5 hover:bg-ember transition-colors w-fit"
          >
            Browse available problems →
          </Link>
        </div>
      </main>
    );
  }

  if (isPendingReview) {
    return (
      <main className="min-h-screen bg-bark">
        <div className="max-w-2xl mx-auto px-5 md:px-10 py-10">
          <div className="mb-10 border-b border-border pb-8">
            <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
              Application status
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl text-parch">
              Awaiting approval
            </h1>
          </div>
          <div className="bg-surface border border-orange/30 px-5 py-5 flex flex-col gap-2">
            <p className="text-[0.7rem] uppercase tracking-widest text-orange font-bold">
              Under review
            </p>
            <p className="text-[0.85rem] text-parch/80 leading-relaxed">
              Your solver application is being reviewed. This usually
              doesn&apos;t take long — you&apos;ll be able to claim problems as
              soon as it&apos;s approved.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bark">
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
            One more step
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl text-parch">
            Become a solver
          </h1>
        </div>

        <p className="text-[0.85rem] text-parch leading-relaxed mb-8">
          Solvers are the backbone of Do.Am — the people who actually show up
          and fix things. Registering means you&apos;re willing to claim
          problems, commit to a timeline, and submit proof once it&apos;s done.
        </p>

        <BecomeSolverForm redirectTo={redirectTo ?? null} />
      </div>
    </main>
  );
}
