"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  approveSolutionReport,
  rejectSolutionReport,
} from "@/app/admin/actions";
import { useRouter } from "next/navigation";

type Report = {
  id: string;
  summary: string;
  evidence_url: string;
  video_url: string | null;
  cost: number | null;
  people_helped: number | null;
  created_at: string;
  problems: { id: string; heading: string } | null;
  user_profiles: { full_name: string | null; username: string | null } | null;
};

export default function SolutionReviewRow({ report }: { report: Report }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleApprove() {
    setLoading("approve");
    setError("");
    const result = await approveSolutionReport(report.id);
    setLoading(null);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  async function handleReject() {
    setLoading("reject");
    setError("");
    const result = await rejectSolutionReport(report.id, reason);
    setLoading(null);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 bg-surface border border-border px-5 py-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href={`/problems/${report.problems?.id ?? ""}`}
          className="text-parch text-[0.95rem] hover:text-orange"
        >
          {report.problems?.heading ?? "Untitled problem"}
        </Link>
        <p className="text-[0.68rem] uppercase tracking-widest text-umber">
          Submitted {new Date(report.created_at).toLocaleDateString()}
        </p>
      </div>

      <p className="text-[0.8rem] text-umber">
        Solver:{" "}
        {report.user_profiles?.full_name ??
          report.user_profiles?.username ??
          "Unknown"}
      </p>

      <p className="text-[0.85rem] text-parch/80 leading-relaxed">
        {report.summary}
      </p>

      <div className="relative w-32 h-32 bg-bark">
        <Image
          src={report.evidence_url}
          alt="Evidence"
          fill
          className="object-cover"
        />
      </div>

      {report.video_url && (
        <a
          href={report.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.75rem] text-orange underline w-fit"
        >
          View video evidence
        </a>
      )}

      <div className="flex gap-4 text-[0.75rem] text-parch/60">
        {report.cost !== null && <span>Cost: ₦{report.cost}</span>}
        {report.people_helped !== null && (
          <span>People helped: {report.people_helped}</span>
        )}
      </div>

      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}

      <div className="flex flex-col gap-2 pt-2 border-t border-border">
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            className="text-[0.72rem] uppercase tracking-wide font-bold bg-green-600 text-parch px-4 py-2 hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {loading === "approve" ? "Approving..." : "Approve — mark resolved"}
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
              placeholder="Why is this being rejected?"
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
