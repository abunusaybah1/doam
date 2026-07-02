import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
  if (!user) redirect("/auth/login?redirectTo=/solver");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_solver, solver_bio, solver_skills, solver_available, full_name")
    .eq("id", user.id)
    .single();

  const { redirectTo } = await searchParams;

  if (profile?.is_solver) {
    const { data: claims } = await supabase
      .from("claims")
      .select(
        `
        id,
        plan,
        timeline,
        status,
        claimed_at,
        completed_at,
        abandoned_at,
        last_activity_at,
        problems (
          id,
          heading,
          status
        )
      `,
      )
      .eq("solver_id", user.id)
      .order("claimed_at", { ascending: false });

    return (
      <main className="min-h-screen bg-bark">
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-10">
          <SolverDashboard profile={profile} claims={claims ?? []} />
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
          and fix things. Registering as a solver means you&apos;re willing to
          claim problems, commit to a timeline, and submit proof of your work
          once it&apos;s done. Tell us a bit about what you bring to the table.
        </p>

        <BecomeSolverForm redirectTo={redirectTo ?? null} />
      </div>
    </main>
  );
}
