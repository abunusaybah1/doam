import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; redirectTo?: string }>;
}) {
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

  const { message, redirectTo } = await searchParams;
  const showGateMessage = message === "complete_profile";

  return (
    <main className="min-h-screen bg-bark">
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
            Account
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl text-parch">
            Your profile
          </h1>
        </div>

        {showGateMessage && (
          <div className="mb-8 bg-orange px-5 py-4">
            <p className="text-[0.7rem] uppercase font-bold tracking-widest text-parch mb-1">
              One step first
            </p>
            <p className="text-parch text-sm">
              Complete your profile before you can report a problem.
            </p>
          </div>
        )}

        <ProfileForm
          profile={profile}
          userId={user.id}
          redirectTo={redirectTo ?? null}
        />
      </div>
    </main>
  );
}
