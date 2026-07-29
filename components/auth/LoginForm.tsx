"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function getLinkErrorMessage(errorCode: string | null): string | null {
  if (!errorCode) return null;

  if (errorCode === "otp_expired" || errorCode === "link_expired") {
    return "That link has expired. Please sign up or request a new one.";
  }
  if (errorCode === "access_denied") {
    return "That link is no longer valid. Please request a new one.";
  }
  return "Something went wrong with that link. Please try again.";
}

function readHashErrorCode(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash) return null;

  const hashParams = new URLSearchParams(hash.slice(1));
  return hashParams.get("error_code") || hashParams.get("error");
}

const LoginForm = ({
  redirectTo,
  initialError,
}: {
  redirectTo: string | null;
  initialError?: string | null;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = React.useState("");

  // Computed once, during the initial render itself — not in an effect —
  // so there's no extra render pass just to set this value after mount.
  const [linkError] = useState<string | null>(() => {
    const hashCode = readHashErrorCode();
    return getLinkErrorMessage(hashCode ?? initialError ?? null);
  });

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [eyeOpen, setEyeOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Pure side effect on the external system (the URL) — no setState here,
    // just cleaning up so a refresh doesn't keep re-showing the same error.
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace(redirectTo ?? "/dashboard");
        return;
      }
      setCheckingSession(false);
    });
  }, [router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      setTimeout(() => setError(""), 5000);
      return;
    }

    router.push(redirectTo ?? "/dashboard");
    router.refresh();
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col gap-4 items-center py-8">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {linkError && (
        <div className="border-l-2 border-orange pl-4 py-1">
          <p className="text-[.85rem] text-parch/80 leading-relaxed">
            {linkError}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Email address <span className="text-orange">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Password <span className="text-orange">*</span>
        </label>
        <div className="flex">
          <input
            name="password"
            type={eyeOpen ? "password" : "text"}
            required
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-6/7 bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
          <button
            type="button"
            onClick={() => setEyeOpen(!eyeOpen)}
            className="flex-1/7 w-fit bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark flex items-center justify-center"
          >
            {eyeOpen ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-[.78rem] tracking-wide text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="font-bold text-[.9rem] tracking-[.08em] uppercase bg-orange text-white py-4 border-2 border-orange hover:bg-ember hover:border-ember transition-all disabled:opacity-60 mt-2"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-[.75rem] tracking-wide text-umber text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="underline hover:text-orange transition-colors"
        >
          Create one
        </Link>
      </p>
      <Link
        href="/forgot-password"
        className="text-orange hover:underline text-center text-[.75rem] tracking-wide mt-2"
      >
        Forgot password?
      </Link>
    </form>
  );
};

export default LoginForm;
