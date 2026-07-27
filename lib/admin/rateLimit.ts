type SupabaseServerClient = Awaited<
  ReturnType<typeof import("@/lib/supabase/server").createClient>
>;

type RateLimitOptions = {
  maxActions: number;
  windowMinutes: number;
  actionsFilter?: string[]; // if provided, only count these specific action types
};

export async function checkAdminRateLimit(
  supabase: SupabaseServerClient,
  adminId: string,
  options: RateLimitOptions,
): Promise<string | null> {
  const since = new Date(
    Date.now() - options.windowMinutes * 60 * 1000,
  ).toISOString();

  let query = supabase
    .from("audit_logs")
    .select("id", { count: "exact", head: true })
    .eq("admin_id", adminId)
    .gte("created_at", since);

  if (options.actionsFilter?.length) {
    query = query.in("action", options.actionsFilter);
  }

  const { count, error } = await query;

  if (error) {
    // fail open rather than blocking all admin work if the rate-limit
    // check itself breaks — but log it, since this shouldn't happen
    console.error("Rate limit check failed:", error.message);
    return null;
  }

  if ((count ?? 0) >= options.maxActions) {
    return `Rate limit reached: too many actions in the last ${options.windowMinutes} minute(s). Slow down and try again shortly.`;
  }

  return null;
}

// general limit — catches runaway/scripted abuse across any admin action
export function generalLimit() {
  return { maxActions: 40, windowMinutes: 5 };
}

// tighter limit — for actions that are destructive or hard to reverse
export function destructiveLimit() {
  return {
    maxActions: 2,
    windowMinutes: 1,
    actionsFilter: [
      "force_delete_problem",
      "ban_user",
      "promote_user",
      "demote_user",
    ],
  };
}
