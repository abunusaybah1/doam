import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function requireAdmin(): Promise<
  | {
      supabase: SupabaseServerClient;
      adminId: string;
      adminEmail: string | null;
      isSuperAdmin: boolean;
      error: null;
    }
  | {
      supabase: null;
      adminId: null;
      adminEmail: null;
      isSuperAdmin: false;
      error: string;
    }
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase: null,
      adminId: null,
      adminEmail: null,
      isSuperAdmin: false,
      error: "Not authenticated",
    };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin, is_super_admin, is_banned")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin || profile.is_banned) {
    return {
      supabase: null,
      adminId: null,
      adminEmail: null,
      isSuperAdmin: false,
      error: "Not authorized",
    };
  }

  return {
    supabase,
    adminId: user.id,
    adminEmail: user.email ?? null,
    isSuperAdmin: profile.is_super_admin,
    error: null,
  };
}

export async function requireSuperAdmin() {
  const result = await requireAdmin();
  if (!result.supabase) return result;
  if (!result.isSuperAdmin) {
    return {
      supabase: null,
      adminId: null,
      adminEmail: null,
      isSuperAdmin: false,
      error: "Super admin required",
    };
  }
  return result;
}

export async function logAdminAction(
  supabase: SupabaseServerClient,
  adminId: string,
  adminEmail: string | null,
  action: string,
  targetType: string,
  targetId: string | null,
  details?: Record<string, unknown>,
) {
  const { error } = await supabase.from("audit_logs").insert({
    admin_id: adminId,
    admin_email: adminEmail,
    action,
    target_type: targetType,
    target_id: targetId,
    details: details ?? null,
  });
  if (error) console.error("Audit log write failed:", error.message);
}
