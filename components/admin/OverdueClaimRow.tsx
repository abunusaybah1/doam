"use client";

import { useState } from "react";
import Link from "next/link";
import { markClaimAbandoned } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

type Claim = {
  id: string;
  plan: string;
  timeline: string;
  claimed_at: string;
  problems: { id: string; heading: string } | null;
  user_profiles: { full_name: string | null; username: string | null } | null;
};

export default function OverdueClaimRow({ claim }: { claim: Claim }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleConfirm() {
    if (
      !confirm(
        "Mark this claim as abandoned? The problem reopens for other solvers.",
      )
    )
      return;
    setLoading(true);
    setError("");
    const result = await markClaimAbandoned(claim.id);
    setLoading(false);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 bg-surface border border-red-500/30 px-5 py-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href={`/problems/${claim.problems?.id ?? ""}`}
          className="text-parch text-[0.95rem] hover:text-orange"
        >
          {claim.problems?.heading ?? "Untitled problem"}
        </Link>
        <p className="text-[0.68rem] uppercase tracking-widest text-red-500 font-bold">
          Target was: {claim.timeline}
        </p>
      </div>

      <p className="text-[0.8rem] text-umber">
        Solver:{" "}
        {claim.user_profiles?.full_name ??
          claim.user_profiles?.username ??
          "Unknown"}
      </p>
      <p className="text-[0.85rem] text-parch/80">
        <span className="text-umber">Plan:</span> {claim.plan}
      </p>

      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="text-[0.72rem] uppercase tracking-wide font-bold bg-red-500 text-parch px-4 py-2 hover:bg-red-600 transition-colors disabled:opacity-60 w-fit"
      >
        {loading ? "Confirming..." : "Confirm as abandoned"}
      </button>
    </div>
  );
}
