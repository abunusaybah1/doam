"use server";

import { createClient } from "@/lib/supabase/server";
import { checkNotBanned } from "@/lib/auth/checkBanned";
import { revalidatePath } from "next/cache";

export async function submitSolutionReport(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const banCheck = await checkNotBanned(supabase, user.id);
  if (banCheck.error) return { error: banCheck.error };

  const claim_id = formData.get("claim_id") as string;
  const problem_id = formData.get("problem_id") as string;
  const summary = formData.get("summary") as string;
  const video_url = (formData.get("video_url") as string) || null;
  const costRaw = formData.get("cost") as string;
  const cost = costRaw ? parseFloat(costRaw) : null;
  const peopleHelpedRaw = formData.get("people_helped") as string;
  const people_helped = peopleHelpedRaw ? parseInt(peopleHelpedRaw) : null;
  const evidenceFiles = formData.getAll("evidence") as File[];

  if (!summary || summary.trim().length < 10) {
    return { error: "Please describe what was done in a bit more detail." };
  }
  if (!evidenceFiles || evidenceFiles.length === 0) {
    return { error: "At least one piece of evidence (a photo) is required." };
  }
  if (evidenceFiles.length > 3) {
    return { error: "You can upload at most 3 evidence photos." };
  }

  const { data: claim } = await supabase
    .from("claims")
    .select("id, solver_id, status, problem_id")
    .eq("id", claim_id)
    .single();

  if (!claim) return { error: "Claim not found" };
  if (claim.solver_id !== user.id) return { error: "This isn't your claim" };
  if (claim.status !== "active") {
    return {
      error: "You can only submit proof for an approved, active claim.",
    };
  }

  const evidenceUrls: string[] = [];

  for (const file of evidenceFiles) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${claim_id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("solution-evidence")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      return { error: "Evidence upload failed: " + uploadError.message };
    }

    const { data: publicUrl } = supabase.storage
      .from("solution-evidence")
      .getPublicUrl(path);

    evidenceUrls.push(publicUrl.publicUrl);
  }

  const { error: insertError } = await supabase
    .from("solution_reports")
    .insert({
      claim_id,
      problem_id,
      solver_id: user.id,
      summary,
      evidence_urls: evidenceUrls,
      video_url,
      cost,
      people_helped,
      status: "pending_review",
    });

  if (insertError) return { error: insertError.message };

  revalidatePath(`/problems/${problem_id}`);
  return { success: true };
}
