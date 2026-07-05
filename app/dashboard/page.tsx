import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatsStrip from "@/components/dashboard/StatsStrip";
import MyProblems from "@/components/dashboard/MyProblems";
import AllProblems from "@/components/dashboard/AllProblems";
import SolverBanner from "@/components/dashboard/SolverBanner";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: myProblems } = await supabase
    .from("problems")
    .select(
      "id, heading, category, status, condition, state, lga, created_at, thumbnail_url, endorsement_count",
    )
    .eq("reporter_id", user.id)
    .order("created_at", { ascending: false });

  const statusCounts = (myProblems ?? []).reduce(
    (acc, p) => {
      acc.total++;
      if (p.status === "pending") acc.pending++;
      else if (p.status === "in_progress") acc.in_progress++;
      else if (p.status === "completed") acc.completed++;
      else if (p.status === "active") acc.active++;
      return acc;
    },
    { total: 0, pending: 0, active: 0, in_progress: 0, completed: 0 },
  );

  // pass statusCounts to StatsStrip instead of just `reported`

  const { data: allProblems } = await supabase
    .from("problems")
    .select(
      "id, heading, description, category, status, condition, state, lga, thumbnail_url, endorsement_count, created_at",
    )
    .in("status", ["active", "in_progress"])
    .order("created_at", { ascending: false })
    .limit(6);

  // get problems the user has endorsed
  const { data: endorsed } = await supabase
    .from("problem_endorsements")
    .select("problem_id")
    .eq("user_id", user.id);

  const endorsedCount = endorsed?.length ?? 0;

  return (
    <main className="min-h-screen bg-bark">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        {/* greeting */}
        <div className="mb-10 border-b border-border pb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
              Welcome back
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl text-parch">
              {profile?.full_name ?? user.email}
            </h1>
          </div>

          {profile?.is_solver && (
            <Link
              href="/dashboard/solver"
              className="text-[0.7rem] uppercase tracking-widest bg-orange text-parch px-5 py-2.5 hover:bg-ember transition-colors"
            >
              Solver dashboard
            </Link>
          )}
        </div>

        {/* stats — reporter focused */}
        <StatsStrip
          reported={profile?.problems_reported ?? 0}
          endorsed={endorsedCount}
          statusCounts={statusCounts}
        />

        {/* become a solver banner */}
        {!profile?.is_solver && <SolverBanner />}

        {/* my reported problems */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-xl text-parch">
              My reported problems
            </h2>
            <Link
              href="/dashboard/report"
              className="text-[0.7rem] uppercase tracking-widest text-orange hover:bg-orange hover:text-parch border border-orange px-4 py-2 transition-colors"
            >
              + Report a problem
            </Link>
          </div>
          <MyProblems problems={myProblems ?? []} />
        </section>

        {/* all open problems */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-xl text-parch">Open problems</h2>
            <Link
              href="/problems"
              className="text-[0.7rem] uppercase tracking-widest text-orange hover:text-ember transition-colors"
            >
              See all →
            </Link>
          </div>
          <AllProblems problems={allProblems ?? []} />
        </section>
      </div>
    </main>
  );
}
