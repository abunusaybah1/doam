"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { promoteByEmail } from "@/app/admin/actions";

export default function PromoteUserForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const result = await promoteByEmail(email, role);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setEmail("");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-surface border border-orange/30 px-5 py-4"
    >
      <p className="text-[0.68rem] uppercase tracking-widest text-orange">
        Promote a user
      </p>
      <div className="flex gap-2 flex-wrap">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@email.com"
          className="bg-parch border-2 border-parch outline-none px-4 py-2.5 text-[0.9rem] text-bark flex-1 min-w-[200px]"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "super_admin")}
          className="bg-parch border-2 border-parch outline-none px-4 py-2.5 text-[0.9rem] text-bark"
        >
          <option value="admin">Admin</option>
          <option value="super_admin">Super admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest px-5 py-2.5 hover:bg-ember transition-colors disabled:opacity-60"
        >
          {loading ? "..." : "Promote"}
        </button>
      </div>
      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}
      {success && (
        <p className="text-[0.75rem] text-green-500">User promoted.</p>
      )}
    </form>
  );
}
