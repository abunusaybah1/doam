import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReportForm from "@/components/dashboard/ReportForm";

export default async function ReportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("username, phone, state, lga")
    .eq("id", user.id)
    .single();

  // profile completion gate
  const isComplete =
    profile?.username && profile?.phone && profile?.state && profile?.lga;

  if (!isComplete) {
    redirect(
      "/dashboard/profile?message=complete_profile&redirectTo=/dashboard/report",
    );
  }

  return (
    <main className="min-h-screen bg-bark">
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-10">
        <div className="mb-10 border-b border-border pb-8">
          <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
            New report
          </p>
          <h1 className=" text-3xl md:text-4xl text-parch">
            Report a problem
          </h1>
        </div>

        <ReportForm
          userId={user.id}
          //  profile={profile}
        />
      </div>
    </main>
  );
}
