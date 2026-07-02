"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function becomeSolver(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const solver_bio = formData.get("solver_bio") as string;
  const solver_skills = formData.getAll("solver_skills") as string[];
  const redirectTo = formData.get("redirectTo") as string | null;

  if (!solver_bio || solver_bio.trim().length < 10) {
    return { error: "Please write a short bio about yourself as a solver" };
  }

  if (!solver_skills.length) {
    return { error: "Please select at least one skill area" };
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({
      is_solver: true,
      solver_bio,
      solver_skills,
      solver_available: true,
      solver_applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  redirect(redirectTo ?? "/problems");
}
