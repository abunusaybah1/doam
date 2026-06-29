"use client";

import { useState } from "react";
import { reportProblem } from "@/app/dashboard/report/actions";
import Image from "next/image";
import { NigeriaStatesAndLGAs } from "@/hooks/NigeriaStatesAndLGAs";
import { Profile } from "@/types";
import { CATEGORIES } from "@/lib/data";

export default function ReportForm({
  userId,
  //   profile,
}: {
  userId: string;
  profile: Profile | null;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState("");
  const { data: locationData, loading: locationLoading } =
    NigeriaStatesAndLGAs();
  const lgas = locationData.find((s) => s.state === selectedState)?.lgas ?? [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await reportProblem(formData);

    setLoading(false);
    if (result?.error) setError(result.error);
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
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors resize-none"
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
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
          Street address <span className="text-umber/50">(optional)</span>
        </label>
        <input
          name="address"
          type="text"
          placeholder="Specific street or landmark"
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      {/* duration + people affected */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            How long? <span className="text-orange">*</span>
          </label>
          <input
            name="duration"
            type="text"
            required
            placeholder="e.g. 3 months, since 2021"
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            People affected <span className="text-umber/50">(optional)</span>
          </label>
          <input
            name="people_affected"
            type="number"
            min={1}
            placeholder="Estimated number"
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
      </div>

      {/* image upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Photo <span className="text-orange">*</span>
        </label>
        <label className="cursor-pointer transition-colors px-4 py-8 flex flex-col items-center gap-2 bg-parch">
          <span className="text-[0.7rem] uppercase tracking-widest text-bark">
            {imagePreview ? "Change photo" : "Click to upload photo"}
          </span>
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              className="mt-2 max-h-40 object-contain"
            />
          )}
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImagePreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      {/* video upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Video <span className="text-umber/50">(optional)</span>
        </label>
        <label className="cursor-pointer transition-colors px-4 py-6 flex flex-col items-center gap-2 bg-parch">
          <span className="text-[0.7rem] uppercase tracking-widest text-bark">
            {videoName ? videoName : "Click to upload video"}
          </span>
          <input
            name="video"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setVideoName(file.name);
            }}
          />
        </label>
      </div>

      {error && (
        <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest py-4 hover:bg-ember transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? "Submitting..." : "Submit report"}
      </button>
    </form>
  );
}
