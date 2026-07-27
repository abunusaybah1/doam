"use server";

import { checkNotBanned } from "@/lib/auth/checkBanned";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function reportProblem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const banCheck = await checkNotBanned(supabase, user.id);
  if (banCheck.error) return { error: banCheck.error };

  const heading = formData.get("heading") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const condition = formData.get("condition") as string;
  const state = formData.get("state") as string;
  const lga = formData.get("lga") as string;
  const address = formData.get("address") as string;
  const duration = formData.get("duration") as string;
  const people_affected = formData.get("people_affected") as string;
  const video_link = formData.get("video_link") as string;

  const imageFiles = formData.getAll("images") as File[];
  const validImages = imageFiles.filter((f) => f.size > 0);

  if (!validImages.length) {
    return { error: "At least one image is required" };
  }

  if (validImages.length > 3) {
    return { error: "Maximum 3 images allowed" };
  }

  if (video_link && !/^https?:\/\/.+/.test(video_link)) {
    return { error: "Video link must be a valid URL" };
  }

  // insert problem first to get its id
  const { data: problem, error: insertError } = await supabase
    .from("problems")
    .insert({
      reporter_id: user.id,
      heading,
      description,
      category,
      condition,
      state,
      lga,
      address: address || null,
      duration,
      people_affected: people_affected ? parseInt(people_affected) : null,
      video_link: video_link || null,
      status: "pending",
    })
    .select()
    .single();

  if (insertError || !problem) {
    return { error: insertError?.message ?? "Failed to create problem" };
  }

  // upload each image and create problem_images rows
  for (let i = 0; i < validImages.length; i++) {
    const file = validImages[i];
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${problem.id}/${Date.now()}-${i}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("problem-images")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      await supabase.from("problems").delete().eq("id", problem.id);
      return { error: "Image upload failed: " + uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from("problem-images")
      .getPublicUrl(path);

    const { error: imageInsertError } = await supabase
      .from("problem_images")
      .insert({
        problem_id: problem.id,
        image_url: urlData.publicUrl,
        is_main: i === 0,
        position: i,
      });

    if (imageInsertError) {
      return { error: imageInsertError.message };
    }

    // set the main image as the problem's thumbnail
    if (i === 0) {
      await supabase
        .from("problems")
        .update({ thumbnail_url: urlData.publicUrl })
        .eq("id", problem.id);
    }
  }

  redirect("/dashboard?reported=true");
}
