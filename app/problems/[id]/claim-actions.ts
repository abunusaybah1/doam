"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function claimProblem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const problem_id = formData.get("problem_id") as string;
  const plan = formData.get("plan") as string;
  const timeline = formData.get("timeline") as string;

  if (!plan || !timeline) {
    return { error: "Plan and timeline are required" };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("username, phone, state, lga, is_solver")
    .eq("id", user.id)
    .single();

  const isComplete =
    profile?.username && profile?.phone && profile?.state && profile?.lga;

  if (!isComplete) {
    redirect(
      `/dashboard/profile?message=complete_profile&redirectTo=/problems/${problem_id}`,
    );
  }

  if (!profile?.is_solver) {
    return {
      error: "You need to register as a solver before claiming a problem",
    };
  }

  const { data: existingClaim } = await supabase
    .from("claims")
    .select("id")
    .eq("problem_id", problem_id)
    .eq("status", "active")
    .maybeSingle();

  if (existingClaim) {
    return { error: "This problem already has an active solver" };
  }

  const { error: insertError } = await supabase.from("claims").insert({
    problem_id,
    solver_id: user.id,
    plan,
    timeline,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: "This problem already has an active solver" };
    }
    return { error: insertError.message };
  }

  revalidatePath(`/problems/${problem_id}`);
  return { success: true };
}
