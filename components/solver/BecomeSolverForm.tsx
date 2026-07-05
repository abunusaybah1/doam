"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { becomeSolver } from "@/app/dashboard/solver/actions";

const SKILL_OPTIONS = [
  "Construction & Engineering",
  "Healthcare & Medicine",
  "Education & Training",
  "Legal & Advocacy",
  "Agriculture & Food",
  "Water & Sanitation",
  "Energy & Power",
  "Transportation & Logistics",
  "Technology & Digital",
  "Finance & Fundraising",
  "Community Organizing",
  "Environment & Climate",
  "Security & Safety",
  "Other",
];

export default function BecomeSolverForm({
  redirectTo,
}: {
  redirectTo: string | null;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  function toggleSkill(skill: string) {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.delete("solver_skills");
    selected.forEach((s) => formData.append("solver_skills", s));

    const result = await becomeSolver(formData);

    if (result?.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    router.push(result.redirectTo ?? "/dashboard/solver");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />

      <div className="flex flex-col gap-2">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          What can you help with? <span className="text-orange">*</span>
        </label>
        <p className="text-[0.75rem] text-umber">
          Select all that apply — be honest, this helps match you to the right
          problems.
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {SKILL_OPTIONS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`text-[0.7rem] uppercase tracking-wide px-3 py-2 border transition-colors ${
                selected.includes(skill)
                  ? "bg-orange text-parch border-orange"
                  : "bg-surface text-parch/60 border-border hover:border-orange/50"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Tell us about yourself as a solver{" "}
          <span className="text-orange">*</span>
        </label>
        <p className="text-[0.75rem] text-umber">
          What experience, resources, or connections do you have that make you
          able to fix problems in your community?
        </p>
        <textarea
          name="solver_bio"
          required
          rows={5}
          placeholder="e.g. I'm a civil engineer with 8 years of experience..."
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors resize-none mt-1"
        />
      </div>

      {error && (
        <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || selected.length === 0}
        className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest py-4 hover:bg-ember transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? "Submitting..." : "Submit application →"}
      </button>

      <p className="text-[0.75rem] text-umber leading-relaxed">
        Your application will be reviewed before you can start claiming
        problems. We&apos;ll notify you once it&apos;s approved.
      </p>
    </form>
  );
}
