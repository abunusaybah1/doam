import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Call at the top of any server action a logged-in user can trigger
 * (reporting, endorsing, claiming, editing, etc). Returns an error if the
 * user is banned; otherwise returns their id for the caller to use.
 */
export async function checkNotBanned(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<{ error: string } | { error: null }> {
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_banned")
    .eq("id", userId)
    .single();

  if (profile?.is_banned) {
    return {
      error:
        "Your account has been suspended. Contact an admin if you believe this is a mistake.",
    };
  }

  return { error: null };
}
