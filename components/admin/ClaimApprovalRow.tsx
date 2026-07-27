"use client";

import { useState } from "react";
import Link from "next/link";
import { approveClaim, rejectClaim } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

type Claim = {
  id: string;
  plan: string;
  timeline: string;
  claimed_at: string;
  problems: { id: string; heading: string } | null;
  user_profiles: { full_name: string | null; username: string | null } | null;
};

export default function ClaimApprovalRow({ claim }: { claim: Claim }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleApprove() {
    setLoading("approve");
    setError("");
    const result = await approveClaim(claim.id);
    setLoading(null);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  async function handleReject() {
    setLoading("reject");
    setError("");
    const result = await rejectClaim(claim.id, reason);
    setLoading(null);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 bg-surface border border-border px-5 py-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href={`/problems/${claim.problems?.id ?? ""}`}
          className="text-parch text-[0.95rem] hover:text-orange"
        >
          {claim.problems?.heading ?? "Untitled problem"}
        </Link>
        <p className="text-[0.68rem] uppercase tracking-widest text-umber">
          Requested {new Date(claim.claimed_at).toLocaleDateString()}
        </p>
      </div>

      <p className="text-[0.8rem] text-umber">
        Solver:{" "}
        {claim.user_profiles?.full_name ??
          claim.user_profiles?.username ??
          "Unknown"}
      </p>

      <p className="text-[0.85rem] text-parch/80 leading-relaxed">
        <span className="text-umber">Plan:</span> {claim.plan}
      </p>
      <p className="text-[0.85rem] text-parch/80">
        <span className="text-umber">Target:</span> {claim.timeline}
      </p>

      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}

      <div className="flex flex-col gap-2 pt-2 border-t border-border">
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            className="text-[0.72rem] uppercase tracking-wide font-bold bg-green-600 text-parch px-4 py-2 hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {loading === "approve" ? "Approving..." : "Approve"}
          </button>
          <button
            onClick={() => setShowReject(!showReject)}
            disabled={loading !== null}
            className="text-[0.72rem] uppercase tracking-wide font-bold bg-red-500 text-parch px-4 py-2 hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            Reject
          </button>
        </div>
        {showReject && (
          <div className="flex flex-col gap-2 mt-1">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Reason (optional)"
              className="bg-parch border-2 border-parch outline-none px-3 py-2 text-[0.85rem] text-bark resize-none"
            />
            <button
              onClick={handleReject}
              disabled={loading !== null}
              className="text-[0.7rem] uppercase tracking-wide font-bold bg-red-500 text-parch px-4 py-2 hover:bg-red-600 transition-colors disabled:opacity-60 w-fit"
            >
              {loading === "reject" ? "Rejecting..." : "Confirm reject"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
