"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSolverProfile } from "@/app/dashboard/solver/actions";

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

type Props = {
  solverBio: string | null;
  solverSkills: string[] | null;
  redirectTo: string | null;
};

export default function SolverProfileSection({
  solverBio,
  solverSkills,
  redirectTo,
}: Props) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>(solverSkills ?? []);
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
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.delete("solver_skills");
    selected.forEach((s) => formData.append("solver_skills", s));

    const result = await updateSolverProfile(formData);

    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="flex flex-col gap-6 border-t border-border pt-8 mt-4">
      <div>
        <p className="text-[0.7rem] uppercase tracking-widest text-umber mb-1">
          Solver profile
        </p>
        <h2 className="text-2xl text-parch">Solving problems</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            What can you help with? <span className="text-orange">*</span>
          </label>
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
            Solver bio <span className="text-orange">*</span>
          </label>
          <textarea
            name="solver_bio"
            required
            rows={5}
            defaultValue={solverBio ?? ""}
            placeholder="What experience, resources, or connections do you have?"
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
            {error}
          </p>
        )}
        {success && (
          <p className="text-[0.78rem] text-green-500 border-l-2 border-green-500 pl-3">
            Solver profile updated.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || selected.length === 0}
          className="bg-orange cursor-pointer text-parch text-[0.7rem] uppercase tracking-widest py-4 hover:bg-ember transition-colors disabled:opacity-60 w-fit px-8"
        >
          {loading ? "Saving..." : "Save solver profile"}
        </button>
      </form>
    </div>
  );
}
