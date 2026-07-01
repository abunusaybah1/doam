"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { reportProblem } from "@/app/dashboard/report/actions";
import { NigeriaStatesAndLGAs } from "@/hooks/NigeriaStatesAndLGAs";
import { CATEGORIES, MONTHS } from "@/lib/data";

const MAX_RAW_SIZE_MB = 10; // reject anything absurdly large before even trying to compress

export default function ReportForm({
  // userId,
  // profile,
}: {
  userId: string;
  // profile: Profile | null;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  async function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setError("");

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
        files.map(
          (file) =>
            imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1600,
              useWebWorker: true,
            }),
          console.log(
            "old size:",
            files.map((f) => f.size/1024/1024),
          ),
        ),
      );

      setImageFiles(compressedFiles);
      console.log(
        "new size:",
        compressedFiles.map((f) => f.size/1024/1024),
      );

      setImagePreviews(compressedFiles.map((f) => URL.createObjectURL(f)));
    } catch {
      setError("Could not process one of the images. Try a different photo.");
    } finally {
      setCompressing(false);
    }
  }

  const [selectedState, setSelectedState] = useState("");
  const { data: locationData, loading: locationLoading } =
    NigeriaStatesAndLGAs();
  const lgas = locationData.find((s) => s.state === selectedState)?.lgas ?? [];
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (imageFiles.length === 0) {
      setError("At least one photo is required");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // remove whatever the native file input put in, replace with compressed files
    formData.delete("images");
    imageFiles.forEach((file) => formData.append("images", file));

    const result = await reportProblem(formData);

    setLoading(false);
    if (result?.error) setError(result.error);
  }

  function getDuration(year: string, month: string): string {
    if (!year || !month) return "";

    const start = new Date(parseInt(year), parseInt(month) - 1);
    const now = new Date();

    const totalMonths =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());

    if (totalMonths < 1) return "Less than a month";
    if (totalMonths < 12)
      return `${totalMonths} month${totalMonths > 1 ? "s" : ""}`;

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years} year${years > 1 ? "s" : ""}, ${months} month${months > 1 ? "s" : ""}`;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* heading */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Heading <span className="text-orange">*</span>
        </label>
        <input
          name="heading"
          type="text"
          required
          placeholder="Short title describing the problem"
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      {/* description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Description <span className="text-orange">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={5}
          placeholder="Describe the problem in detail — what is happening, how long has it been going on, what has been tried..."
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors resize-none"
        />
      </div>

      {/* category + condition */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            Category <span className="text-orange">*</span>
          </label>
          <select
            name="category"
            required
            defaultValue="select"
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
          >
            <option value="select" disabled>
              Select category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c.toLowerCase()}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            Condition <span className="text-orange">*</span>
          </label>
          <select
            name="condition"
            required
            defaultValue="select"
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
          >
            <option value="select" disabled>
              How severe?
            </option>
            <option value="emergency">Emergency — life threatening</option>
            <option value="critical">Critical — urgent but not deadly</option>
            <option value="concern">Concern — serious but stable</option>
          </select>
        </div>
      </div>

      {/* state + lga */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            State of Occurence <span className="text-orange">*</span>
          </label>
          <select
            name="state"
            required
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
            }}
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
          >
            <option value="" disabled>
              {locationLoading ? "Loading states..." : "Select state"}
            </option>
            {locationData.map((s, i) => (
              <option key={i} value={s.state}>
                {s.state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            Local Government Area <span className="text-orange">*</span>
          </label>
          <select
            name="lga"
            required
            defaultValue="select"
            disabled={!selectedState}
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
          >
            <option value="select" disabled>
              {!selectedState ? "Select state first" : "Select LGA"}
            </option>
            {lgas.map((l) => (
              <option key={l.name} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Street address (optional)
        </label>
        <input
          name="address"
          type="text"
          placeholder="Specific street or landmark"
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      {/* duration + people affected */}
      <div className="grid grid-cols-2 gap-4">
        {/* month + year picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            When did it start? <span className="text-orange">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
              className="bg-parch border-2 border-parch outline-none px-4 py-3.5   text-[.95rem] text-bark transition-colors"
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
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="bg-parch border-2 border-parch outline-none px-4 py-3.5   text-[.95rem] text-bark transition-colors"
            >
              <option value="" disabled>
                Year
              </option>
              {Array.from({ length: 30 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {startMonth && startYear && (
            <p className="text-[0.68rem] uppercase tracking-widest text-umber mt-1">
              Duration: {getDuration(startYear, startMonth)}
            </p>
          )}
          <input
            type="hidden"
            name="duration"
            value={
              startMonth && startYear ? getDuration(startYear, startMonth) : ""
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            People affected (optional)
          </label>
          <input
            name="people_affected"
            type="number"
            min={1}
            placeholder="Estimated number"
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
      </div>

      {/* image upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Photos <span className="text-orange">*</span> (up to 3, first is the
          main photo)
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
                  alt={`Preview ${i + 1}`}
                  className="h-24 w-24 object-cover"
                />
              ))}
            </div>
          )}
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            disabled={compressing}
            className="hidden"
            onChange={handleImagesChange}
          />
        </label>
      </div>

      {/* video link */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Video link (optional — paste a YouTube link)
        </label>
        <input
          name="video_link"
          type="url"
          placeholder="https://youtube.com/..."
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      {error && (
        <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || compressing}
        className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest py-4 hover:bg-ember transition-colors disabled:opacity-60 mt-2 cursor-pointer"
      >
        {loading ? "Submitting..." : "Submit report"}
      </button>
    </form>
  );
}
