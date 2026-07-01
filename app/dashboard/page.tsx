import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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

  // get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // get their reported problems
  const { data: myProblems } = await supabase
    .from("problems")
    .select("*")
    .eq("reporter_id", user.id)
    .order("created_at", { ascending: false });

  // get all public problems
  const { data: allProblems } = await supabase
    .from("problems")
    .select("*, user_profiles(full_name)")
    .in("status", ["active", "in_progress", "completed"])
    .order("created_at", { ascending: false })
    .limit(12);

  // get followed problem ids
  const { data: followed } = await supabase
    .from("problem_followers")
    .select("problem_id")
    .eq("user_id", user.id);

  const followedIds = followed?.map((f) => f.problem_id) ?? [];

  return (
    <main className="min-h-screen bg-bark">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">

        {/* greeting */}
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
            Welcome back
          </p>
          <h1 className=" text-3xl md:text-4xl text-parch">
            {profile?.full_name ?? user.email}
          </h1>
          {/* <p>{profile?.id}</p> */}
        </div>

        {/* stats */}
        <StatsStrip
          reported={profile?.problems_reported ?? 0}
          solved={profile?.problems_solved ?? 0}
          followed={followedIds.length}
        />

        {/* become a solver banner */}
        {!profile?.is_solver && <SolverBanner />}

        {/* my reported problems */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className=" text-xl text-parch">
              My reported problems
            </h2>
            <a
              href="/dashboard/report"
              className="text-[0.7rem] uppercase tracking-widest text-orange hover:bg-orange  hover:text-parch border border-orange hover:border-ember px-4 py-2 transition-colors"
            >
              Report a problem
            </a>
          </div>
          <MyProblems problems={myProblems ?? []} />
        </section>

        {/* all problems */}
        <section className="mt-12">
          <h2 className=" text-xl text-parch mb-6">
            All reported problems
          </h2>
          <AllProblems problems={allProblems ?? []} followedIds={followedIds} />
        </section>

      </div>
    </main>
  );
}