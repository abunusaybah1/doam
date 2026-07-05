"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleEndorsement(problemId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be logged in to endorse" };

  const { data: problem } = await supabase
    .from("problems")
    .select("reporter_id")
    .eq("id", problemId)
    .single();

  if (problem?.reporter_id === user.id) {
    return { error: "You can't endorse your own report." };
  }
  const { data: existing } = await supabase
    .from("problem_endorsements")
    .select("id")
    .eq("problem_id", problemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("problem_endorsements")
      .delete()
      .eq("id", existing.id);

    if (error) return { error: error.message };

    revalidatePath(`/problems/${problemId}`);
    revalidatePath("/problems");
    return { endorsed: false };
  }

  const { error } = await supabase
    .from("problem_endorsements")
    .insert({ problem_id: problemId, user_id: user.id });

  if (error) return { error: error.message };

  revalidatePath(`/problems/${problemId}`);
  revalidatePath("/problems");
  return { endorsed: true };
}
