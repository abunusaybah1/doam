"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { claimProblem } from "@/app/problems/[id]/claim-actions";

type Claim = {
  id: string;
  solver_id: string;
  plan: string;
  timeline: string;
  claimed_at: string;
} | null;

export default function ClaimSection({
  problemId,
  problemStatus,
  isLoggedIn,
  isSolver,
  activeClaim,
  currentUserId,
}: {
  problemId: string;
  problemStatus: string;
  isLoggedIn: boolean;
  isSolver: boolean;
  activeClaim: Claim;
  currentUserId: string | null;
}) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (problemStatus === "completed") {
    return (
      <div className="flex flex-col gap-2 border-border border-t pt-5">
        <p className="text-[0.85rem] text-parch/70">
          This problem has already been resolved.
        </p>
      </div>
    );
  }

  if (activeClaim && activeClaim.solver_id !== currentUserId) {
    return (
      <div className="flex flex-col gap-2 border-border border-t pt-5">
        <p className="text-[0.7rem] uppercase tracking-widest text-amber-500">
          In progress
        </p>
        <p className="text-[0.85rem] text-parch/70">
          A solver is already working on this problem.
        </p>
      </div>
    );
  }

  if (activeClaim && activeClaim.solver_id === currentUserId) {
    return (
      <div className="flex flex-col gap-2 border-border border-t pt-5">
        <p className="text-[0.7rem] uppercase tracking-widest text-orange">
          You&apos;re solving this
        </p>
        <p className="text-[0.85rem] text-parch/80">
          <span className="text-umber">Your plan:</span> {activeClaim.plan}
        </p>
        <p className="text-[0.85rem] text-parch/80">
          <span className="text-umber">Timeline:</span> {activeClaim.timeline}
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-2 border-border border-t pt-5">
        <h2 className="text-2xl text-orange font-bold">
          Do you want to solve this?
        </h2>
        <p className="text-[0.85rem] text-parch leading-relaxed">
          Solving a problem means taking real responsibility for fixing it,
          whether that&apos;s through money, materials, skilled labour,
          advocacy, or connecting the right people to get it done. It&apos;s for
          anyone who has the means, the network, or the expertise to actually
          move this from &quot;reported&quot; to &quot;resolved.&quot;
        </p>
        <p className="text-[0.85rem] text-parch leading-relaxed">
          Once you claim this problem, it means you&apos;re publicly committing
          to fix it within the timeline you set. Other solvers won&apos;t be
          able to claim it while you&apos;re working on it, and you&apos;ll be
          expected to submit proof (photos, receipts, or a summary) of what was
          done once it&apos;s resolved.
        </p>
        <button
          onClick={() =>
            router.push(`/auth/login?redirectTo=/problems/${problemId}`)
          }
          className="mt-2 bg-orange px-5 py-3 cursor-pointer text-parch text-[0.75rem] uppercase tracking-wide font-bold hover:bg-ember transition-colors w-fit"
        >
          Log in to solve this problem
        </button>
      </div>
    );
  }

  if (!isSolver) {
    return (
      <div className="flex flex-col gap-2 border-border border-t pt-5">
        <h2 className="text-2xl text-orange font-bold">
          Do you want to solve this?
        </h2>
        <p className="text-[0.85rem] text-parch leading-relaxed">
          Solving a problem means taking real responsibility for fixing it,
          whether that&apos;s through money, materials, skilled labour,
          advocacy, or connecting the right people to get it done. It&apos;s for
          anyone who has the means, the network, or the expertise to actually
          move this from &quot;reported&quot; to &quot;resolved.&quot;
        </p>
        <p className="text-[0.85rem] text-parch leading-relaxed">
          Once you claim this problem, it means you&apos;re publicly committing
          to fix it within the timeline you set. Other solvers won&apos;t be
          able to claim it while you&apos;re working on it, and you&apos;ll be
          expected to submit proof (photos, receipts, or a summary) of what was
          done once it&apos;s resolved.
        </p>
        <button
          onClick={() =>
            router.push(
              `/dashboard/become-a-solver?redirectTo=/problems/${problemId}`,
            )
          }
          className="bg-orange hover mt-2 flex items-center gap-1 cursor-pointer px-5 py-3 text-[0.8rem] uppercase tracking-wide font-bold transition-colors disabled:opacity-60 w-fit"
          // className="mt-2 bg-orange text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-ember transition-colors w-fit"
        >
          Become a solver
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await claimProblem(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  if (!showForm) {
    return (
      <div className="flex flex-col gap-2 border-border border-t pt-5">
        <h2 className="text-2xl text-orange font-bold">
          Do you want to solve this?
        </h2>
        <p className="text-[0.85rem] text-parch leading-relaxed">
          Claiming a problem means taking real responsibility for fixing it,
          whether that&apos;s through money, materials, skilled labour,
          advocacy, or connecting the right people to get it done. It&apos;s for
          anyone who has the means, the network, or the expertise to actually
          move this from &quot;reported&quot; to &quot;resolved.&quot;
        </p>
        <p className="text-[0.85rem] text-parch leading-relaxed">
          Once you claim this problem, it means you&apos;re publicly committing
          to fix it within the timeline you set. Other solvers won&apos;t be
          able to claim it while you&apos;re working on it, and you&apos;ll be
          expected to submit proof (photos, receipts, or a summary) of what was
          done once it&apos;s resolved.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-1 bg-orange text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-ember transition-colors w-fit"
        >
          Claim this problem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-surface border-border border p-5"
    >
      <input type="hidden" name="problem_id" value={problemId} />

      <h2 className="text-2xl font-bold text-orange">
        Claim this problem
      </h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Your plan <span className="text-orange">*</span>
        </label>
        <textarea
          name="plan"
          required
          rows={3}
          placeholder="How do you intend to solve this problem?"
          className="bg-parch border-2 border-parch outline-none px-4 py-3   text-[.9rem] text-bark placeholder:text-warm transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Timeline <span className="text-orange">*</span>
        </label>
        <input
          name="timeline"
          type="text"
          required
          placeholder="e.g. 2 weeks, by end of month"
          className="bg-parch border-2 border-parch outline-none px-4 py-3   text-[.9rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      {error && (
        <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <div className="flex gap-0 justify-between">
        <button
          type="submit"
          disabled={loading}
          className="bg-orange text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-ember transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit claim"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-bark text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-surface border border-border transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
