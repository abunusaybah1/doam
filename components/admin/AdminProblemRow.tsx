"use client";

import { useState } from "react";
import Link from "next/link";
import { forceDeleteProblem, adminUpdateProblemStatus } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

type Problem = {
  id: string;
  heading: string;
  status: string;
  category: string;
  condition: string;
  state: string;
  lga: string;
  created_at: string;
};

const STATUSES = ["pending", "active", "in_progress", "completed", "pending_delete"];

export default function AdminProblemRow({ problem }: { problem: Problem }) {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleStatusChange(newStatus: string) {
    setLoading(true);
    setError("");
    const result = await adminUpdateProblemStatus(problem.id, newStatus);
    setLoading(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  async function handleForceDelete() {
    setLoading(true);
    setError("");
    const result = await forceDeleteProblem(problem.id);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="flex flex-col gap-2 bg-surface border border-border px-5 py-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link href={`/problems/${problem.id}`} className="text-parch text-[0.9rem] hover:text-orange">
          {problem.heading}
        </Link>
        <p className="text-[0.68rem] uppercase tracking-widest text-umber">
          {problem.lga}, {problem.state} · {problem.category}
        </p>
      </div>

      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}

      <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-border">
        <select
          value={problem.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className="bg-parch border-2 border-parch outline-none px-3 py-1.5 text-[0.75rem] text-bark"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-[0.68rem] uppercase tracking-wide font-bold text-red-500 hover:text-red-400 transition-colors"
          >
            Force delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[0.72rem] text-parch/70">Permanently delete?</span>
            <button
              onClick={handleForceDelete}
              disabled={loading}
              className="text-[0.68rem] uppercase tracking-wide font-bold bg-red-500 text-parch px-3 py-1.5 hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {loading ? "..." : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-[0.68rem] uppercase tracking-wide font-bold bg-bark text-parch px-3 py-1.5 border border-border hover:bg-surface transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}