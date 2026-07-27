"use client";

import { useState } from "react";
import { approveDeletion, rejectDeletion } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

type Problem = {
  id: string;
  heading: string;
  pre_delete_status: string | null;
  updated_at: string;
};

export default function DeletionRequestRow({ problem }: { problem: Problem }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleApprove() {
    if (!confirm("Permanently delete this problem? This can't be undone."))
      return;
    setLoading("approve");
    setError("");
    const result = await approveDeletion(problem.id);
    setLoading(null);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  async function handleReject() {
    setLoading("reject");
    setError("");
    const result = await rejectDeletion(problem.id);
    setLoading(null);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 bg-surface border border-border px-5 py-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-parch text-[0.95rem]">{problem.heading}</p>
        <p className="text-[0.68rem] uppercase tracking-widest text-umber">
          Requested {new Date(problem.updated_at).toLocaleDateString()}
        </p>
      </div>
      <p className="text-[0.8rem] text-umber">
        Was: {problem.pre_delete_status ?? "unknown"}
      </p>

      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-border">
        <button
          onClick={handleApprove}
          disabled={loading !== null}
          className="text-[0.72rem] uppercase tracking-wide font-bold bg-red-500 text-parch px-4 py-2 hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {loading === "approve" ? "Deleting..." : "Confirm delete"}
        </button>
        <button
          onClick={handleReject}
          disabled={loading !== null}
          className="text-[0.72rem] uppercase tracking-wide font-bold bg-bark text-parch px-4 py-2 border border-border hover:bg-surface transition-colors disabled:opacity-60"
        >
          {loading === "reject" ? "Restoring..." : "Deny — restore report"}
        </button>
      </div>
    </div>
  );
}
