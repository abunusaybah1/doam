"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function deleteProblem(formData: FormData) {
  const problemId = formData.get("problem_id") as string;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { data: problem } = await supabase
    .from("problems")
    .select("id, reporter_id, status")
    .eq("id", problemId)
    .single();

  if (!problem) return { error: "Problem not found." };
  if (problem.reporter_id !== user.id)
    return { error: "You can only delete your own reports." };
  if (problem.status !== "pending") {
    return { error: "Only pending reports can be deleted directly." };
  }

  await supabase.from("problem_images").delete().eq("problem_id", problemId);
  await supabase
    .from("problem_endorsements")
    .delete()
    .eq("problem_id", problemId);
  await supabase.from("solution_reports").delete().eq("problem_id", problemId);
  await supabase.from("claims").delete().eq("problem_id", problemId);

  const { error } = await supabase
    .from("problems")
    .delete()
    .eq("id", problemId);
  if (error) return { error: "Could not delete this problem. Try again." };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function requestDeleteProblem(formData: FormData) {
  const problemId = formData.get("problem_id") as string;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const { data: problem } = await supabase
    .from("problems")
    .select("id, reporter_id, status")
    .eq("id", problemId)
    .single();

  if (!problem) return { error: "Problem not found." };
  if (problem.reporter_id !== user.id)
    return { error: "You can only request deletion of your own reports." };
  if (!["active", "completed"].includes(problem.status)) {
    return {
      error: "This report can't be deleted this way. Contact an admin.",
    };
  }

  const { data: activeClaim } = await supabase
    .from("claims")
    .select("id, solver_id")
    .eq("problem_id", problemId)
    .eq("status", "active")
    .maybeSingle();

  if (activeClaim) {
    if (activeClaim.solver_id === user.id) {
      // reporter also claimed their own problem as a solver — they can self-resolve this
      return { error: "self_claimed" };
    }
    return { error: "contact_admin" };
  }

  const { error } = await supabase
    .from("problems")
    .update({ status: "pending_delete", updated_at: new Date().toISOString() })
    .eq("id", problemId);

  if (error) return { error: "Could not submit deletion request." };

  revalidatePath(`/problems/${problemId}`);
  revalidatePath("/dashboard");
  return { success: true };
}
