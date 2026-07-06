"use client";

import { useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { updateProblem } from "@/app/problems/[id]/edit/actions";
import { NigeriaStatesAndLGAs } from "@/hooks/NigeriaStatesAndLGAs";
import { CATEGORIES } from "@/lib/data";

const MAX_RAW_SIZE_MB = 10;
const MAX_IMAGES = 3;

type ExistingImage = { id: string; image_url: string; position: number };

type Problem = {
  id: string;
  heading: string;
  description: string;
  category: string;
  condition: string;
  state: string;
  lga: string;
  address: string | null;
  duration: string;
  people_affected: number | null;
  video_link: string | null;
};

export default function EditProblemForm({
  problem,
  existingImages,
}: {
  problem: Problem;
  existingImages: ExistingImage[];
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const [keptImages, setKeptImages] = useState<ExistingImage[]>(existingImages);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const totalImageCount = keptImages.length + newFiles.length;

  function removeExisting(id: string) {
    setKeptImages((prev) => prev.filter((img) => img.id !== id));
  }

  function removeNew(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const remainingSlots = MAX_IMAGES - keptImages.length - newFiles.length;
    const files = Array.from(e.target.files ?? []).slice(
      0,
      Math.max(0, remainingSlots),
    );
    setError("");
    if (files.length === 0) {
      e.target.value = "";
      return;
    }

    const tooLarge = files.find((f) => f.size > MAX_RAW_SIZE_MB * 1024 * 1024);
    if (tooLarge) {
      setError(
        `"${tooLarge.name}" is too large (max ${MAX_RAW_SIZE_MB}MB before compression).`,
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
      setNewFiles((prev) => [...prev, ...compressedFiles]);
      setNewPreviews((prev) => [
        ...prev,
        ...compressedFiles.map((f) => URL.createObjectURL(f)),
      ]);
    } catch {
      setError("Could not process one of the images. Try a different photo.");
    } finally {
      setCompressing(false);
      e.target.value = "";
    }
  }

  const [selectedState, setSelectedState] = useState(problem.state);
  const { data: locationData, loading: locationLoading } =
    NigeriaStatesAndLGAs();
  const lgas = locationData.find((s) => s.state === selectedState)?.lgas ?? [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (totalImageCount === 0) {
      setError("At least one photo is required");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("problem_id", problem.id);
    keptImages.forEach((img) => formData.append("kept_image_ids", img.id));
    formData.delete("images");
    newFiles.forEach((file) => formData.append("images", file));

    const result = await updateProblem(formData);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Heading <span className="text-orange">*</span>
        </label>
        <input
          name="heading"
          type="text"
          required
          defaultValue={problem.heading}
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Description <span className="text-orange">*</span>
        </label>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={problem.description}
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            Category <span className="text-orange">*</span>
          </label>
          <select
            name="category"
            required
            defaultValue={problem.category}
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark transition-colors"
          >
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
            defaultValue={problem.condition}
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark transition-colors"
          >
            <option value="emergency">Emergency — life threatening</option>
            <option value="critical">Critical — urgent but not deadly</option>
            <option value="concern">Concern — serious but stable</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            State of Occurence <span className="text-orange">*</span>
          </label>
          <select
            name="state"
            required
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark transition-colors"
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
            defaultValue={problem.lga}
            disabled={!selectedState}
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark transition-colors"
          >
            <option value="" disabled>
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

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Street address (optional)
        </label>
        <input
          name="address"
          type="text"
          defaultValue={problem.address ?? ""}
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            How long has this been going on?{" "}
            <span className="text-orange">*</span>
          </label>
          <input
            name="duration"
            type="text"
            required
            defaultValue={problem.duration}
            placeholder="e.g. 3 months, 2 years"
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
            defaultValue={problem.people_affected ?? ""}
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Photos <span className="text-orange">*</span> (up to {MAX_IMAGES},
          first is the main photo)
        </label>

        {(keptImages.length > 0 || newPreviews.length > 0) && (
          <div className="flex gap-2 flex-wrap">
            {keptImages.map((img) => (
              <div key={img.id} className="relative w-24 h-24">
                <Image
                  src={img.image_url}
                  alt=""
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExisting(img.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-parch w-5 h-5 rounded-full text-[0.65rem] flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={i} className="relative w-24 h-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-parch w-5 h-5 rounded-full text-[0.65rem] flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {totalImageCount < MAX_IMAGES && (
          <label className="cursor-pointer transition-colors px-4 py-8 flex flex-col items-center gap-2 bg-parch">
            <span className="text-[0.7rem] uppercase tracking-widest text-bark">
              {compressing ? "Processing photos..." : "Add photos"}
            </span>
            <input
              name="images"
              required
              type="file"
              accept="image/*"
              multiple
              disabled={compressing}
              className="hidden"
              onChange={handleImagesChange}
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Video link (optional — paste a YouTube link)
        </label>
        <input
          name="video_link"
          type="url"
          defaultValue={problem.video_link ?? ""}
          placeholder="https://youtube.com/..."
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
