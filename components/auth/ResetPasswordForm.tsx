"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const verifyPassword = () => {
    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          New password
        </label>
        <input
          type="password"
          required
          minLength={8}
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Confirm password
        </label>
        <input
          type="password"
          required
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyUp={verifyPassword}
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
        disabled={loading}
        className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest py-4 hover:bg-ember transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
