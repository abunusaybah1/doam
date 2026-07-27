import { createClient } from "@/lib/supabase/server";
import UserRow from "@/components/admin/UserRow";
import PromoteUserForm from "@/components/admin/PromoteUserForm";
import UserSearchBar from "@/components/admin/UserSearchBar";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const { q } = await searchParams;

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data: currentProfile } = await supabase
    .from("user_profiles")
    .select("is_super_admin")
    .eq("id", currentUser?.id ?? "")
    .single();

  let query = supabase
    .from("user_profiles")
    .select(
      "id, full_name, username, email, is_admin, is_super_admin, is_banned, is_solver, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (q && q.trim()) {
    const term = q.trim();
    query = query.or(
      `email.ilike.%${term}%,username.ilike.%${term}%,full_name.ilike.%${term}%`,
    );
  }

  const { data: users, error } = await query;

  if (error) {
    console.error("Admin users query failed:", error.message);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-playfair text-3xl text-parch">Users</h1>

      <UserSearchBar />

      {error && (
        <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
          Search failed: {error.message}
        </p>
      )}

      {currentProfile?.is_super_admin && <PromoteUserForm />}

      <div className="flex flex-col gap-3">
        {(users ?? []).map((u) => (
          <UserRow
            key={u.id}
            user={u}
            canManageRoles={!!currentProfile?.is_super_admin}
            currentUserId={currentUser?.id ?? ""}
          />
        ))}
        {!users?.length && (
          <p className="text-[0.85rem] text-parch/60">No users found.</p>
        )}
      </div>
    </div>
  );
}
