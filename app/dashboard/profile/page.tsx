import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/dashboard/ProfileForm";
import SolverProfileSection from "@/components/dashboard/SolverProfileSection";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; redirectTo?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { message, redirectTo } = await searchParams;
  const showDashboardGateMessage = message === "complete_profile";
  const showSolverGateMessage = message === "complete_solver_profile";

  return (
    <main className="min-h-screen bg-bark">
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
            Account
          </p>
          <h1 className=" text-3xl md:text-4xl text-parch">Your profile</h1>
        </div>

        {showDashboardGateMessage && (
          <div className="mb-8 bg-orange px-5 py-4">
            <p className="text-[0.7rem] uppercase font-bold tracking-widest text-parch mb-1">
              One step first
            </p>
            <p className="text-parch text-sm">
              Complete your profile before you can access your dashboard.
            </p>
          </div>
        )}

        {showSolverGateMessage && (
          <div className="mb-8 bg-orange px-5 py-4">
            <p className="text-[0.7rem] uppercase font-bold tracking-widest text-parch mb-1">
              One step first
            </p>
            <p className="text-parch text-sm">
              Complete your solver profile below before you can view your solver
              dashboard.
            </p>
          </div>
        )}

        <ProfileForm
          profile={profile}
          userId={user.id}
          redirectTo={redirectTo ?? null}
        />

        {profile?.is_solver && (
          <SolverProfileSection
            solverBio={profile?.solver_bio ?? null}
            solverSkills={profile?.solver_skills ?? null}
            redirectTo={redirectTo ?? null}
          />
        )}
      </div>
    </main>
  );
}
