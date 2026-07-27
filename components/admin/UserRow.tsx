"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { banUser, unbanUser, demoteToUser } from "@/app/admin/actions";

type User = {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
  is_banned: boolean;
  is_solver: boolean;
  created_at: string;
};

export default function UserRow({
  user,
  canManageRoles,
  currentUserId,
}: {
  user: User;
  canManageRoles: boolean;
  currentUserId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isSelf = user.id === currentUserId;

  async function handleBanToggle() {
    setLoading(true);
    setError("");
    const result = user.is_banned
      ? await unbanUser(user.id)
      : await banUser(user.id);
    setLoading(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  async function handleDemote() {
    if (!confirm(`Remove admin access from ${user.email ?? user.username}?`))
      return;
    setLoading(true);
    setError("");
    const result = await demoteToUser(user.id);
    setLoading(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 bg-surface border border-border px-5 py-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-col">
          <p className="text-parch text-[0.9rem]">
            {user.full_name ?? user.username ?? "Unnamed"}
          </p>
          <p className="text-[0.72rem] text-umber">
            {user.email ?? "No email on file"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {user.is_super_admin && (
            <span className="text-[0.62rem] uppercase tracking-widest text-orange border border-orange/40 px-2 py-0.5">
              Super admin
            </span>
          )}
          {user.is_admin && !user.is_super_admin && (
            <span className="text-[0.62rem] uppercase tracking-widest text-amber-500 border border-amber-500/40 px-2 py-0.5">
              Admin
            </span>
          )}
          {user.is_solver && (
            <span className="text-[0.62rem] uppercase tracking-widest text-parch/60 border border-border px-2 py-0.5">
              Solver
            </span>
          )}
          {user.is_banned && (
            <span className="text-[0.62rem] uppercase tracking-widest text-red-500 border border-red-500/40 px-2 py-0.5">
              Banned
            </span>
          )}
        </div>
      </div>

      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}

      {!isSelf && (
        <div className="flex gap-3 pt-2 border-t border-border">
          <button
            onClick={handleBanToggle}
            disabled={loading}
            className={`text-[0.7rem] uppercase tracking-wide font-bold px-4 py-2 transition-colors disabled:opacity-60 ${
              user.is_banned
                ? "bg-green-600 text-parch hover:bg-green-700"
                : "bg-red-500 text-parch hover:bg-red-600"
            }`}
          >
            {loading ? "..." : user.is_banned ? "Unban" : "Ban"}
          </button>
          {canManageRoles && user.is_admin && (
            <button
              onClick={handleDemote}
              disabled={loading}
              className="text-[0.7rem] uppercase tracking-wide font-bold bg-bark text-parch px-4 py-2 border border-border hover:bg-surface transition-colors disabled:opacity-60"
            >
              Remove admin access
            </button>
          )}
        </div>
      )}
    </div>
  );
}
