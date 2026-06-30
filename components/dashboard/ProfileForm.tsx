"use client";

import { useState } from "react";
import { updateProfile } from "@/app/dashboard/profile/actions";
import Image from "next/image";
import { NigeriaStatesAndLGAs } from "@/hooks/NigeriaStatesAndLGAs";
import { Profile } from "@/types";



export default function ProfileForm({
  profile,
  // userId,
  redirectTo,
}: {
  profile: Profile | null;
  userId: string;
  redirectTo: string | null;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.avatar_url ?? null,
  );
  const [selectedState, setSelectedState] = useState(profile?.state ?? "");
  const { data: locationData, loading: locationLoading } =
    NigeriaStatesAndLGAs();
  const lgas = locationData.find((s) => s.state === selectedState)?.lgas ?? [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    if (result.avatar_url) {
      setAvatarPreview(result.avatar_url);
    }

    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
      {/* avatar */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-surface border border-border overflow-hidden shrink-0">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-umber text-[1rem] uppercase tracking-widest">
              {profile?.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "No photo"}
            </div>
          )}
        </div>
        <label className="cursor-pointer border border-umber hover:bg-umber/30 hover:border-none group px-4 py-3 transition-colors">
          <span className="text-[0.68rem] uppercase tracking-widest text-umber group-hover:text-parch transition-colors ">
            Upload photo
          </span>
          <input
            name="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAvatarPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      {/* full name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Full name <span className="text-orange">*</span>
        </label>
        <input
          name="full_name"
          type="text"
          required
          placeholder="Full name"
          defaultValue={profile?.full_name ?? ""}
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      {/* username */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Username <span className="text-orange">*</span>
        </label>
        <input
          name="username"
          type="text"
          required
          defaultValue={profile?.username ?? ""}
          placeholder="e.g. amina_bello"
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      {/* phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Phone number <span className="text-orange">*</span>
        </label>
        <input
          name="phone"
          type="tel"
          required
          defaultValue={profile?.phone ?? ""}
          placeholder="080xxxxxxxx"
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      {/* state + lga */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] uppercase tracking-widest text-umber">
            State of residence <span className="text-orange">*</span>
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
            {locationData.map((s,i) => (
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
            defaultValue={profile?.lga ?? ""}
            disabled={!selectedState}
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
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

      {/* bio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Bio (optional)
        </label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={profile?.bio ?? ""}
          placeholder="A short description about yourself"
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="text-[0.78rem] text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      {success && (
        <p className="text-[0.78rem] text-green-500 border-l-2 border-green-500 pl-3">
          Profile updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-orange cursor-pointer text-parch text-[0.7rem] uppercase tracking-widest py-4 hover:bg-ember transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
