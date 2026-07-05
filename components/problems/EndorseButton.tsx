"use client";

import { useState } from "react";
import { BiSolidUpvote } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { toggleEndorsement } from "@/app/problems/[id]/endorse-actions";
import { error } from "console";

export default function EndorseButton({
  problemId,
  initialCount,
  initialEndorsed,
  isLoggedIn,
}: {
  problemId: string;
  initialCount: number;
  initialEndorsed: boolean;
  isLoggedIn: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [endorsed, setEndorsed] = useState(initialEndorsed);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    const willEndorse = !endorsed;
    setEndorsed(willEndorse);
    setCount((c) => (willEndorse ? c + 1 : Math.max(0, c - 1)));

    const result = await toggleEndorsement(problemId);

    setLoading(false);

    if (result?.error) {
      setEndorsed(endorsed);
      setCount(initialCount);
    }
  }

  return (
    <div className="flex flex-col gap-2 border-border border-t pt-5">
      <h2 className="text-2xl text-orange font-bold">Relatable?</h2>
      <p className="text-[0.85rem] text-parch leading-relaxed">
        Endorsing is how the community confirms a problem is real and matters.
        If you live nearby, have seen this issue yourself, or know it&apos;s
        genuinely affecting people, your endorsement helps move it up the
        priority list and shows solvers it&apos;s worth their time. It is not a
        vote of agreement with how it was described, but just a confirmation
        that the problem itself is real.
      </p>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`mt-2 flex items-center gap-1 cursor-pointer px-5 py-3 text-[0.8rem] uppercase tracking-wide font-bold transition-colors disabled:opacity-60 w-fit ${
          endorsed
            ? "bg-orange text-parch hover:bg-ember"
            : "bg-bark text-parch/70 hover:bg-surface border border-border"
        }`}
      >
        <BiSolidUpvote className="-mt-1" />
        {endorsed ? "Remove endorsement" : "Endorse this problem"} ({count})
      </button>
      {endorsed && (
        <span className="text-[0.8rem] text-umber">
          You&apos;ve already endorsed this. click the button again to remove
          it.
        </span>
      )}
      {!isLoggedIn && (
        <span className="text-[0.8rem] text-umber">
          You need to be logged in to make an endorsement
        </span>
      )}
    </div>
  );
}
