"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { forgotPassword } from "./actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await forgotPassword(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-bark flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="border border-border p-8">
            <p className="text-[0.7rem] uppercase tracking-widest text-orange mb-2">
              Check your email
            </p>
            <p className="text-parch/70 text-sm leading-relaxed">
              If that email exists in our system, we sent a password reset link.
              Check your inbox and follow the link to reset your password.
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-6 text-[0.7rem] uppercase tracking-widest text-orange hover:text-ember transition-colors bg-bark border border-orange hover:border-ember px-4 py-2"
            >
              Back to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bark flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="font-playfair text-3xl md:text-4xl text-parch mb-2">
          Reset your password
        </h1>
        <p className="text-parch/50 text-sm mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {/* invalid link error — shown when redirected from reset page */}
        {urlError === "invalid_link" && (
          <div className="mb-6 border border-red-500/40 bg-orange px-5 py-4">
            <p className="text-[0.7rem] uppercase tracking-widest text-parch mb-1">
              Link invalid or expired
            </p>
            <p className="text-parch text-sm">
              Your reset link has expired. Request a new one below.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] uppercase tracking-widest text-umber">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="bg-parch border-2 border-parch outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-[0.78rem] text-umber mt-6 text-center">
          Remembered it?{" "}
          <Link href="/auth/login" className="text-orange hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
