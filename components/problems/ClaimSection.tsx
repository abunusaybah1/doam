"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  claimProblem,
  unclaimProblem,
} from "@/app/problems/[id]/claim-actions";
import { MONTHS } from "@/lib/data";
import { FiClock, FiAlertCircle, FiShield } from "react-icons/fi";
import Link from "next/link";

type Claim = {
  id: string;
  solver_id: string;
  plan: string;
  timeline: string;
  claimed_at: string;
  status: string;
} | null;

export default function ClaimSection({
  problemId,
  problemStatus,
  isLoggedIn,
  isSolver,
  claim,
  currentUserId,
}: {
  problemId: string;
  problemStatus: string;
  isLoggedIn: boolean;
  isSolver: boolean;
  claim: Claim;
  currentUserId: string | null;
}) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUnclaimForm, setShowUnclaimForm] = useState(false);
  const [unclaimError, setUnclaimError] = useState<string | null>(null);
  const [unclaimLoading, setUnclaimLoading] = useState(false);
  const [targetMonth, setTargetMonth] = useState("");
  const [targetYear, setTargetYear] = useState("");
  const [agreedResponsibility, setAgreedResponsibility] = useState(false);
  const [agreedProof, setAgreedProof] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const timelineLabel =
    targetMonth && targetYear
      ? `${MONTHS[parseInt(targetMonth) - 1]} ${targetYear}`
      : "";

  const CONFIRM_PHRASE = "I WILL SOLVE THIS";
  const canSubmitClaim =
    agreedResponsibility &&
    agreedProof &&
    timelineLabel &&
    confirmText.trim().toUpperCase() === CONFIRM_PHRASE;

  if (problemStatus === "completed") {
    return (
      <div className="flex flex-col gap-2 border-border border-t pt-5">
        <p className="text-[0.85rem] text-parch/70">
          This problem has already been resolved.
        </p>
      </div>
    );
  }

  const isMyClaim = claim && claim.solver_id === currentUserId;

  if (claim && !isMyClaim) {
    const isPending = claim.status === "pending_approval";
    return (
      <div className="flex flex-col gap-3 bg-surface border border-amber-500/30 px-5 py-5">
        <div className="flex items-center gap-2">
          <FiClock className="text-amber-500 shrink-0" size={18} />
          <p className="text-[0.7rem] uppercase tracking-widest text-amber-500 font-bold">
            {isPending ? "Claim awaiting approval" : "Already being worked on"}
          </p>
        </div>
        <p className="text-[0.85rem] text-parch/80 leading-relaxed">
          {isPending
            ? "A solver has requested to take on this problem, and the claim is awaiting admin approval. New claims aren't accepted while a request is pending."
            : `A solver has claimed this problem and committed to a timeline of ${claim.timeline}. To avoid duplicated effort, new claims aren't accepted while someone is actively working on it.`}
        </p>
      </div>
    );
  }

  if (isMyClaim && claim.status === "active") {
    return (
      <div className="flex flex-col gap-4 bg-surface border-2 border-orange/40 px-5 py-5">
        <div className="flex items-center gap-2">
          <FiShield className="text-orange shrink-0" size={18} />
          <p className="text-[0.7rem] uppercase tracking-widest text-orange font-bold">
            Your public commitment
          </p>
        </div>
        <div className="flex flex-col gap-2 border-l-2 border-orange/40 pl-4">
          <p className="text-[0.85rem] text-parch/80">
            <span className="text-umber">Your plan:</span> {claim.plan}
          </p>
          <p className="text-[0.85rem] text-parch/80">
            <span className="text-umber">Target completion:</span>{" "}
            {claim.timeline}
          </p>
        </div>
        <div className="flex items-start gap-2 border-t border-border pt-4 mt-1">
          <FiAlertCircle className="text-parch/50 shrink-0 mt-0.5" size={16} />
          <p className="text-[0.8rem] text-parch/60 leading-relaxed">
            This claim has been reviewed and approved — it&apos;s now a standing
            commitment tied to your name. If you need to step away from it,{" "}
            <Link
              href="/contact-us"
              className="text-orange hover:text-ember underline"
            >
              contact an admin
            </Link>{" "}
            to have it formally reversed.
          </p>
        </div>
      </div>
    );
  }

  if (isMyClaim && claim.status === "pending_approval") {
    async function handleUnclaim(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setUnclaimLoading(true);
      setUnclaimError(null);

      const formData = new FormData(e.currentTarget);
      const result = await unclaimProblem(formData);

      setUnclaimLoading(false);

      if (result?.error) {
        setUnclaimError(result.error);
        return;
      }

      router.refresh();
    }

    return (
      <div className="flex flex-col gap-4 bg-surface border-2 border-amber-500/40 px-5 py-5">
        <div className="flex items-center gap-2">
          <FiClock className="text-amber-500 shrink-0" size={18} />
          <p className="text-[0.7rem] uppercase tracking-widest text-amber-500 font-bold">
            Claim submitted — awaiting approval
          </p>
        </div>
        <div className="flex flex-col gap-2 border-l-2 border-amber-500/40 pl-4">
          <p className="text-[0.85rem] text-parch/80">
            <span className="text-umber">Your plan:</span> {claim.plan}
          </p>
          <p className="text-[0.85rem] text-parch/80">
            <span className="text-umber">Target completion:</span>{" "}
            {claim.timeline}
          </p>
        </div>

        {!showUnclaimForm ? (
          <div className="flex items-start gap-2 border-t border-border pt-4 mt-1">
            <FiAlertCircle
              className="text-parch/50 shrink-0 mt-0.5"
              size={16}
            />
            <div className="flex flex-col gap-2">
              <p className="text-[0.8rem] text-parch/60 leading-relaxed">
                Withdrawing a claim you&apos;ve made is a real decision — this
                problem is still waiting for someone to actually show up for it.
                Only cancel if you genuinely can&apos;t follow through.
              </p>
              <button
                onClick={() => setShowUnclaimForm(true)}
                className="text-[0.75rem] uppercase tracking-wide font-bold text-red-500 hover:text-red-400 transition-colors w-fit"
              >
                Cancel this claim
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleUnclaim}
            className="flex flex-col gap-3 border-t border-red-500/30 pt-4 mt-1 bg-bark/40 -mx-5 -mb-5 px-5 pb-5"
          >
            <input type="hidden" name="claim_id" value={claim.id} />
            <p className="text-[0.72rem] uppercase tracking-widest text-red-500 font-bold">
              Confirm cancellation
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] uppercase tracking-widest text-umber">
                Why are you cancelling this?{" "}
                <span className="text-orange">*</span>
              </label>
              <textarea
                name="reason"
                required
                rows={2}
                placeholder="e.g. I no longer have the resources to complete this"
                className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors resize-none"
              />
            </div>

            {unclaimError && unclaimError !== "contact_admin" && (
              <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
                {unclaimError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={unclaimLoading}
                className="bg-red-500 text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {unclaimLoading ? "Submitting..." : "Confirm cancellation"}
              </button>
              <button
                type="button"
                onClick={() => setShowUnclaimForm(false)}
                className="bg-bark text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-surface border border-border transition-colors"
              >
                Go back
              </button>
            </div>
          </form>
        )}
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
          advocacy, or connecting the right people to get it done.
        </p>
        <button
          onClick={() =>
            router.push(`/login?redirectTo=/problems/${problemId}`)
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
          Solving a problem means taking real responsibility for fixing it —
          money, materials, skilled labour, advocacy, or connections.
        </p>
        <button
          onClick={() =>
            router.push(`/dashboard/solver?redirectTo=/problems/${problemId}`)
          }
          className="mt-2 bg-orange text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-3 hover:bg-ember transition-colors w-fit"
        >
          Become a solver
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmitClaim) return;
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
          Claiming this problem submits a request to fix it by the timeline you
          set. An admin reviews the request before it goes live, to keep out
          bad-faith claims.
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
      className="flex flex-col gap-5 bg-surface border-2 border-orange/40 p-5"
    >
      <input type="hidden" name="problem_id" value={problemId} />
      <input type="hidden" name="timeline" value={timelineLabel} />

      <div className="flex items-center gap-2 border-b border-border pb-4">
        <FiShield className="text-orange shrink-0" size={20} />
        <h2 className="text-xl font-bold text-orange">
          Solver commitment agreement
        </h2>
      </div>

      <p className="text-[0.8rem] text-parch/70 leading-relaxed">
        This isn&apos;t a casual sign-up. Claiming a problem publicly ties your
        name to it. The reporter, the community, and anyone browsing this page
        will see that you took this on — and whether you followed through.
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Your plan <span className="text-orange">*</span>
        </label>
        <textarea
          name="plan"
          required
          rows={3}
          placeholder="How do you intend to solve this problem, specifically?"
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Target completion <span className="text-orange">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={targetMonth}
            onChange={(e) => setTargetMonth(e.target.value)}
            required
            className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark transition-colors"
          >
            <option value="" disabled>
              Month
            </option>
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1).padStart(2, "0")}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={targetYear}
            onChange={(e) => setTargetYear(e.target.value)}
            required
            className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark transition-colors"
          >
            <option value="" disabled>
              Year
            </option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-bark/50 border border-border px-4 py-4">
        <p className="text-[0.68rem] uppercase tracking-widest text-umber">
          Before you submit, confirm you understand <span className="text-orange">*</span>
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedResponsibility}
            onChange={(e) => setAgreedResponsibility(e.target.checked)}
            className="mt-1 accent-orange w-4 h-4 shrink-0"
          />
          <span className="text-[0.82rem] text-parch/80 leading-relaxed">
            I am taking real responsibility for fixing this problem by my stated
            target date — not just expressing interest.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedProof}
            onChange={(e) => setAgreedProof(e.target.checked)}
            className="mt-1 accent-orange w-4 h-4 shrink-0"
          />
          <span className="text-[0.82rem] text-parch/80 leading-relaxed">
            I understand I must submit photo evidence of the completed work, and
            that abandoning this claim without good reason is visible on my
            solver record.
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Type{" "}
          <span className="text-orange font-bold">
            &quot;{CONFIRM_PHRASE}&quot;
          </span>{" "}
          to confirm <span className="text-orange">*</span>
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={CONFIRM_PHRASE}
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm/50 transition-colors uppercase tracking-wide"
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
          disabled={loading || !canSubmitClaim}
          className="bg-orange text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-ember transition-colors disabled:opacity-40"
        >
          {loading ? "Submitting..." : "Submit my commitment"}
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
