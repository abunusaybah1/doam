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

export async function unclaimProblem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const claim_id = formData.get("claim_id") as string;
  const reason = formData.get("reason") as string;

  if (!reason || reason.trim().length < 5) {
    return { error: "Please give a short reason for unclaiming" };
  }

  const { data: claim } = await supabase
    .from("claims")
    .select("id, solver_id, problem_id, status")
    .eq("id", claim_id)
    .single();

  if (!claim) return { error: "Claim not found" };
  if (claim.solver_id !== user.id) return { error: "This isn't your claim" };
  if (claim.status !== "active")
    return { error: "This claim is no longer active" };

  const { error } = await supabase
    .from("claims")
    .update({
      status: "abandoned",
      abandoned_at: new Date().toISOString(),
      abandon_reason: reason,
    })
    .eq("id", claim_id);

  if (error) return { error: error.message };

  revalidatePath(`/problems/${claim.problem_id}`);
  revalidatePath("/problems");
  return { success: true };
}
