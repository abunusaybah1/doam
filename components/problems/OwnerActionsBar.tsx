"use client";

import { useState } from "react";
import Link from "next/link";
import {
  deleteProblem,
  requestDeleteProblem,
} from "@/app/problems/[id]/problem-actions";

export default function OwnerActionsBar({
  problemId,
  status,
  hasActiveClaim,
}: {
  problemId: string;
  status: string;
  hasActiveClaim: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  async function handleHardDelete() {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("problem_id", problemId);
    const result = await deleteProblem(formData);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  async function handleRequestDelete() {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("problem_id", problemId);
    const result = await requestDeleteProblem(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setRequested(true);
  }

  function renderError() {
    if (!error) return null;

    if (error === "self_claimed") {
      return (
        <p className="text-[0.8rem] text-amber-500 border-l-2 border-amber-500 pl-3">
          You&apos;re also the solver on this problem. Unclaim it first before
          requesting deletion.
        </p>
      );
    }

    if (error === "contact_admin") {
      return (
        <p className="text-[0.8rem] text-red-500 border-l-2 border-red-500 pl-3">
          A solver is actively working on this.{" "}
          <Link href="/contact-us" className="underline hover:text-red-400">
            Contact an admin
          </Link>{" "}
          to remove it.
        </p>
      );
    }

    return (
      <p className="text-[0.75rem] text-red-500 border-l-2 border-red-500 pl-3">
        {error}
      </p>
    );
  }

  if (status === "pending_delete") {
    return (
      <div className="flex flex-col gap-1 bg-surface border border-amber-500/40 px-5 py-4">
        <p className="text-[0.65rem] uppercase tracking-widest text-amber-500 font-bold">
          Deletion pending
        </p>
        <p className="text-[0.8rem] text-parch/80">
          You&apos;ve requested this report be removed. It&apos;s hidden from
          the public and awaiting admin action.
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex flex-col gap-2 bg-surface border border-orange/30 px-5 py-4">
        <p className="text-[0.65rem] uppercase tracking-widest text-umber">
          This is your report
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/problems/${problemId}/edit`}
            className="text-[0.72rem] uppercase tracking-wide font-bold text-orange hover:text-ember transition-colors border border-orange px-4 py-2"
          >
            Edit report
          </Link>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="text-[0.72rem] uppercase tracking-wide font-bold text-red-500 hover:text-red-400 transition-colors border border-red-500/40 px-4 py-2"
            >
              Delete report
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.75rem] text-parch/80">
                Delete permanently?
              </span>
              <button
                onClick={handleHardDelete}
                disabled={loading}
                className="text-[0.7rem] uppercase tracking-wide font-bold bg-red-500 text-parch px-3 py-1.5 hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-[0.7rem] uppercase tracking-wide font-bold bg-bark text-parch px-3 py-1.5 border border-border hover:bg-surface transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {renderError()}
      </div>
    );
  }

  if (hasActiveClaim) {
    return (
      <div className="flex flex-col gap-1 bg-surface border border-border px-5 py-4">
        <p className="text-[0.65rem] uppercase tracking-widest text-umber">
          This is your report
        </p>
        <p className="text-[0.8rem] text-parch/70">
          A solver is actively working on this.{" "}
          <Link
            href="/contact-us"
            className="text-orange hover:text-ember underline"
          >
            Contact an admin
          </Link>{" "}
          if you need to edit or remove it.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 bg-surface border border-border px-5 py-4">
      <p className="text-[0.65rem] uppercase tracking-widest text-umber">
        This is your report
      </p>
      <p className="text-[0.8rem] text-parch/70">
        This report is live.{" "}
        <Link
          href="/contact-us"
          className="text-orange hover:text-ember underline"
        >
          Contact an admin
        </Link>{" "}
        if it needs to be edited.
      </p>
      {requested ? (
        <p className="text-[0.8rem] text-amber-500">
          Deletion requested — awaiting admin review.
        </p>
      ) : !confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="text-[0.72rem] uppercase tracking-wide font-bold text-red-500 hover:text-red-400 transition-colors border border-red-500/40 px-4 py-2 w-fit"
        >
          Request deletion
        </button>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.75rem] text-parch/80">
            Submit deletion request?
          </span>
          <button
            onClick={handleRequestDelete}
            disabled={loading}
            className="text-[0.7rem] uppercase tracking-wide font-bold bg-red-500 text-parch px-3 py-1.5 hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Yes, request"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-[0.7rem] uppercase tracking-wide font-bold bg-bark text-parch px-3 py-1.5 border border-border hover:bg-surface transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
      {renderError()}
    </div>
  );
}
