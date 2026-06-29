"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function reportProblem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const heading = formData.get("heading") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const condition = formData.get("condition") as string;
  const state = formData.get("state") as string;
  const lga = formData.get("lga") as string;
  const address = formData.get("address") as string;
  const duration = formData.get("duration") as string;
  const people_affected = formData.get("people_affected") as string;
  const imageFile = formData.get("image") as File;
  const videoFile = formData.get("video") as File | null;

  // upload image (required)
  if (!imageFile || imageFile.size === 0) {
    return { error: "An image is required" };
  }

  const imageExt = imageFile.name.split(".").pop();
  const imagePath = `${user.id}/${Date.now()}.${imageExt}`;

  const { error: imageError } = await supabase.storage
    .from("problem-images")
    .upload(imagePath, imageFile, { upsert: false });

  if (imageError)
    return { error: "Image upload failed: " + imageError.message };

  const { data: imageData } = supabase.storage
    .from("problem-images")
    .getPublicUrl(imagePath);

  // upload video (optional)
  let video_url = null;
  if (videoFile && videoFile.size > 0) {
    const videoExt = videoFile.name.split(".").pop();
    const videoPath = `${user.id}/${Date.now()}.${videoExt}`;

    const { error: videoError } = await supabase.storage
      .from("problem-videos")
      .upload(videoPath, videoFile, { upsert: false });

    if (videoError)
      return { error: "Video upload failed: " + videoError.message };

    const { data: videoData } = supabase.storage
      .from("problem-videos")
      .getPublicUrl(videoPath);

    video_url = videoData.publicUrl;
  }

  // insert problem
  const { error: insertError } = await supabase.from("problems").insert({
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
    image_url: imageData.publicUrl,
    video_url,
    status: "pending",
  });

  if (insertError) return { error: insertError.message };

  redirect("/dashboard?reported=true");
}
