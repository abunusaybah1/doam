"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkNotBanned } from "@/lib/auth/checkBanned";

export async function updateProblem(formData: FormData) {
  const problemId = formData.get("problem_id") as string;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const banCheck = await checkNotBanned(supabase, user.id);
if (banCheck.error) return { error: banCheck.error };

  const { data: problem } = await supabase
    .from("problems")
    .select("id, reporter_id, status")
    .eq("id", problemId)
    .single();

  if (!problem) return { error: "Problem not found." };
  if (problem.reporter_id !== user.id) {
    return { error: "You can only edit your own reports." };
  }
  if (problem.status !== "pending") {
    return {
      error: "This report can no longer be edited directly. Contact an admin.",
    };
  }

  const heading = formData.get("heading") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const condition = formData.get("condition") as string;
  const state = formData.get("state") as string;
  const lga = formData.get("lga") as string;
  const address = (formData.get("address") as string) || null;
  const duration = formData.get("duration") as string;
  const peopleAffectedRaw = formData.get("people_affected") as string;
  const people_affected =
    peopleAffectedRaw && !isNaN(parseInt(peopleAffectedRaw))
      ? parseInt(peopleAffectedRaw)
      : null;
  const video_link = (formData.get("video_link") as string) || null;

  const keptImageIds = formData.getAll("kept_image_ids") as string[];
  const newImages = formData.getAll("images") as File[];

  if (
    !heading ||
    !description ||
    !category ||
    !condition ||
    !state ||
    !lga ||
    !duration
  ) {
    return { error: "Please fill in all required fields." };
  }

  const { data: currentImages } = await supabase
    .from("problem_images")
    .select("id, image_url")
    .eq("problem_id", problemId);

  const toDelete = (currentImages ?? []).filter(
    (img) => !keptImageIds.includes(img.id),
  );

  for (const img of toDelete) {
    const path = img.image_url.split("/problem-images/")[1];
    if (path) await supabase.storage.from("problem-images").remove([path]);
    await supabase.from("problem_images").delete().eq("id", img.id);
  }

  const uploadedUrls: string[] = [];
  for (let i = 0; i < newImages.length; i++) {
    const file = newImages[i];
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${problemId}/${Date.now()}-${i}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("problem-images")
      .upload(path, file, { upsert: false });
    if (uploadError) {
      return { error: "Image upload failed: " + uploadError.message };
    }

    const { data: publicUrl } = supabase.storage
      .from("problem-images")
      .getPublicUrl(path);
    uploadedUrls.push(publicUrl.publicUrl);
  }

  if (uploadedUrls.length > 0) {
    const { data: lastPos } = await supabase
      .from("problem_images")
      .select("position")
      .eq("problem_id", problemId)
      .order("position", { ascending: false })
      .limit(1);

    let nextPosition = (lastPos?.[0]?.position ?? -1) + 1;
    const rows = uploadedUrls.map((url) => ({
      problem_id: problemId,
      image_url: url,
      position: nextPosition++,
      is_main: false,
    }));
    const { error: imgInsertError } = await supabase
      .from("problem_images")
      .insert(rows);
    if (imgInsertError)
      return { error: "Could not save new photos: " + imgInsertError.message };
  }

  const { data: finalImages } = await supabase
    .from("problem_images")
    .select("image_url")
    .eq("problem_id", problemId)
    .order("position", { ascending: true })
    .limit(1);

  const thumbnail_url = finalImages?.[0]?.image_url ?? null;

  const { error } = await supabase
    .from("problems")
    .update({
      heading,
      description,
      category,
      condition,
      state,
      lga,
      address,
      duration,
      people_affected,
      video_link,
      thumbnail_url,
      status: "pending", // back for re-review after any edit
      updated_at: new Date().toISOString(),
    })
    .eq("id", problemId);

  if (error) return { error: "Could not save changes: " + error.message };

  revalidatePath(`/problems/${problemId}`);
  revalidatePath("/dashboard");
  redirect(`/problems/${problemId}`);
}
