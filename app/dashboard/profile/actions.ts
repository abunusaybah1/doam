"use server";

import { checkNotBanned } from "@/lib/auth/checkBanned";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const banCheck = await checkNotBanned(supabase, user.id);
  if (banCheck.error) return { error: banCheck.error };

  const full_name = formData.get("full_name") as string;
  const username = formData.get("username") as string;
  const phone = formData.get("phone") as string;
  const state = formData.get("state") as string;
  const lga = formData.get("lga") as string;
  const bio = formData.get("bio") as string;
  const redirectTo = formData.get("redirectTo") as string | null;
  const avatarFile = formData.get("avatar") as File | null;

  // check username is not taken by someone else
  if (username) {
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .single();

    if (existing) return { error: "That username is already taken" };
  }

  // upload avatar if provided
  let avatar_url: string | undefined = undefined;

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true });

    if (uploadError)
      return { error: "Avatar upload failed: " + uploadError.message };

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    avatar_url = `${urlData.publicUrl}?t=${Date.now()}`;
  }

  const updates: Record<string, unknown> = {
    full_name,
    username,
    phone,
    state,
    lga,
    bio,
    updated_at: new Date().toISOString(),
  };

  if (avatar_url) updates.avatar_url = avatar_url;

  const { error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/profile");

  if (redirectTo) redirect(redirectTo);

  return { success: true, avatar_url: avatar_url ?? null };
}
