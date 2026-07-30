"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { submitSolutionReport } from "@/app/problems/[id]/solution-actions";

const MAX_RAW_SIZE_MB = 10; // reject anything absurdly large before even trying to compress

type SolutionReport = {
  id: string;
  status: string;
  summary: string;
  rejection_reason: string | null;
  created_at: string;
} | null;

export default function SolutionReportSection({
  claimId,
  problemId,
  latestReport,
}: {
  claimId: string;
  problemId: string;
  latestReport: SolutionReport;
}) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const router = useRouter();

  async function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setError("");

    if (files.length === 0) return;

    // reject absurdly large files before even attempting compression
    const tooLarge = files.find((f) => f.size > MAX_RAW_SIZE_MB * 1024 * 1024);
    if (tooLarge) {
      setError(
        `"${tooLarge.name}" is too large (max ${MAX_RAW_SIZE_MB}MB before compression). Please choose a smaller file.`,
      );
      e.target.value = "";
      return;
    }

    setCompressing(true);

    try {
      const compressedFiles = await Promise.all(
        files.map((file) =>
          imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
          }),
        ),
      );

      setImageFiles(compressedFiles);
      setImagePreviews(compressedFiles.map((f) => URL.createObjectURL(f)));
    } catch {
      setError("Could not process one of the images. Try a different photo.");
    } finally {
      setCompressing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (imageFiles.length === 0) {
      setError("At least one evidence photo is required");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // remove whatever the native file input put in, replace with compressed files
    formData.delete("evidence");
    imageFiles.forEach((file) => formData.append("evidence", file));

    const result = await submitSolutionReport(formData);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  if (latestReport?.status === "pending_review") {
    return (
      <div className="flex flex-col gap-1 bg-surface border border-amber-500/30 px-5 py-4">
        <p className="text-[0.68rem] uppercase tracking-widest text-amber-500 font-bold">
          Proof submitted — under review
        </p>
        <p className="text-[0.8rem] text-parch/70">
          An admin will verify your submission before this problem is marked
          complete.
        </p>
      </div>
    );
  }

  const wasRejected = latestReport?.status === "rejected";

  if (!showForm) {
    return (
      <div className="flex flex-col gap-3 border-border border-t pt-5">
        {wasRejected && (
          <div className="bg-surface border border-red-500/30 px-5 py-4 flex flex-col gap-1">
            <p className="text-[0.68rem] uppercase tracking-widest text-red-500 font-bold">
              Submission rejected
            </p>
            <p className="text-[0.8rem] text-parch/70">
              {latestReport?.rejection_reason || "No reason given."} You can
              submit again below.
            </p>
          </div>
        )}
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-ember transition-colors w-fit"
        >
          {wasRejected
            ? "Resubmit proof of completion"
            : "Submit proof of completion"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-surface border-border border p-5"
    >
      <input type="hidden" name="claim_id" value={claimId} />
      <input type="hidden" name="problem_id" value={problemId} />

      <h2 className="text-xl font-bold text-orange">
        Submit proof of completion
      </h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          What did you do? <span className="text-orange">*</span>
        </label>
        <textarea
          name="summary"
          required
          rows={4}
          placeholder="Describe what was done to resolve this problem"
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Evidence photos <span className="text-orange">*</span> (up to 3)
        </label>
        <label className="cursor-pointer transition-colors px-4 py-8 flex flex-col items-center gap-2 bg-parch">
          <span className="text-[0.7rem] uppercase tracking-widest text-bark">
            {compressing
              ? "Processing photos..."
              : imagePreviews.length
                ? "Change photos"
                : "Click to upload photos"}
          </span>
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-2">
              {imagePreviews.map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={i}
                  src={src}
                  alt={`Evidence preview ${i + 1}`}
                  className="h-24 w-24 object-cover"
                />
              ))}
            </div>
          )}
          <input
            name="evidence"
            type="file"
            accept="image/*"
            multiple
            disabled={compressing}
            className="hidden"
            onChange={handleImagesChange}
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Video link (optional)
        </label>
        <input
          name="video_url"
          type="url"
          placeholder="https://youtube.com/..."
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            Cost incurred (optional)
          </label>
          <input
            name="cost"
            type="number"
            step="0.01"
            min="0"
            placeholder="₦"
            className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            People helped (optional)
          </label>
          <input
            name="people_helped"
            type="number"
            min="1"
            placeholder="Estimated number"
            className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
      </div>

      {error && (
        <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || compressing}
          className="bg-orange text-parch text-[0.75rem] uppercase tracking-wide font-bold px-5 py-2.5 hover:bg-ember transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit"}
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
