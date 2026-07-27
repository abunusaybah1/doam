"use client";

import { useState } from "react";
import { approveSolver, rejectSolver } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

type Applicant = {
  id: string;
  full_name: string | null;
  username: string | null;
  solver_bio: string | null;
  solver_skills: string[] | null;
  solver_applied_at: string;
};

export default function SolverApplicationRow({
  applicant,
}: {
  applicant: Applicant;
}) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleApprove() {
    setLoading("approve");
    setError("");
    const result = await approveSolver(applicant.id);
    setLoading(null);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  async function handleReject() {
    setLoading("reject");
    setError("");
    const result = await rejectSolver(applicant.id);
    setLoading(null);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 bg-surface border border-border px-5 py-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-parch text-[0.95rem]">
          {applicant.full_name ?? applicant.username ?? "Unknown"}
        </p>
        <p className="text-[0.68rem] uppercase tracking-widest text-umber">
          Applied {new Date(applicant.solver_applied_at).toLocaleDateString()}
        </p>
      </div>

      <p className="text-[0.85rem] text-parch/80 leading-relaxed">
        {applicant.solver_bio}
      </p>

      <div className="flex flex-wrap gap-2">
        {applicant.solver_skills?.map((skill) => (
          <span
            key={skill}
            className="text-[0.68rem] uppercase tracking-wide px-2.5 py-1 bg-bark border border-border text-parch/60"
          >
            {skill}
          </span>
        ))}
      </div>

      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-border">
        <button
          onClick={handleApprove}
          disabled={loading !== null}
          className="text-[0.72rem] uppercase tracking-wide font-bold bg-green-600 text-parch px-4 py-2 hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading === "approve" ? "Approving..." : "Approve"}
        </button>
        <button
          onClick={handleReject}
          disabled={loading !== null}
          className="text-[0.72rem] uppercase tracking-wide font-bold bg-red-500 text-parch px-4 py-2 hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {loading === "reject" ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
