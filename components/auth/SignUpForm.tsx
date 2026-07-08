"use client";

import React, { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RESEND_COOLDOWN_SECONDS = 60;

const SignUpForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [fName, setFName] = React.useState("");
  const [lName, setLName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [resending, setResending] = React.useState(false);
  const [resendMessage, setResendMessage] = React.useState("");
  const [resendError, setResendError] = React.useState("");
  const [cooldown, setCooldown] = React.useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const router = useRouter();

  const verifyPassword = () => {
    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  function startCooldown(seconds: number) {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${fName.trim()} ${lName.trim()}`,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      setTimeout(() => setError(""), 5000);
      return;
    }

    // if email confirmation is off, Supabase returns an active session immediately —
    // the account is already logged in, so skip the "check your email" screen entirely
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setSuccess(true);
    setLoading(false);
    // Note: signUp() looks identical whether this genuinely sent a fresh email
    // or silently no-op'd because this email already has a pending unconfirmed
    // signup. We can't tell which happened from this response alone — the
    // "Resend" button below uses a dedicated endpoint that CAN report that.
    startCooldown(RESEND_COOLDOWN_SECONDS);
  };

  async function handleResend() {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setResendError("");
    setResendMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setResending(false);

    if (error) {
      if (
        error.status === 429 ||
        error.message.toLowerCase().includes("rate limit")
      ) {
        setResendError(
          "You're requesting links too quickly. Please wait a bit before trying again.",
        );
      } else {
        setResendError(
          "Something went wrong resending your confirmation email. Please try again.",
        );
      }
      setTimeout(() => setResendError(""), 6000);
      return;
    }

    setResendMessage("A new confirmation link is on its way.");
    startCooldown(RESEND_COOLDOWN_SECONDS);
    setTimeout(() => setResendMessage(""), 6000);
  }

  // Email Confirmation logic
  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <div className="border-l-2 border-orange pl-4 py-1">
          <p className="font-bold text-[.78rem] tracking-[.12em] uppercase text-orange mb-1">
            Check your email
          </p>
          <p className="text-[.92rem] text-parch/70 leading-relaxed">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="text-[.75rem] tracking-wide uppercase font-bold text-orange hover:text-ember transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            {resending
              ? "Sending..."
              : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : "Resend confirmation email"}
          </button>

          {resendMessage && (
            <p className="text-[.75rem] text-orange">{resendMessage}</p>
          )}
          {resendError && (
            <p className="text-[.75rem] text-red-500 border-l-2 border-red-500 pl-3">
              {resendError}
            </p>
          )}
        </div>

        <p className="text-[.75rem] tracking-wide text-parch/70">
          Wrong email?{" "}
          <button
            onClick={() => {
              setSuccess(false);
              setEmail("");
              setResendMessage("");
              setResendError("");
              setCooldown(0);
              if (cooldownRef.current) clearInterval(cooldownRef.current);
            }}
            className="underline hover:text-orange transition-colors"
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
            First name <span className="text-orange">*</span>
          </label>
          <input
            name="firstName"
            type="text"
            required
            placeholder="Abdulmatiin"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
            Last name <span className="text-orange">*</span>
          </label>
          <input
            name="lastName"
            type="text"
            required
            placeholder="Ismail"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
      </div>

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
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Confirm password <span className="text-orange">*</span>
        </label>
        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder="Retype your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyUp={verifyPassword}
          className="bg-parch border-2 border-parch outline-none px-4 py-3.5 text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          id="showHide"
          className="mt-2 self-start accent-orange size-4"
        />
        <label htmlFor="showHide" className="mt-1 select-none">
          Show password
        </label>
      </div>

      {error && (
        <p className="text-[.78rem] tracking-wide text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !!error}
        className="font-bold text-[.9rem] tracking-[.08em] uppercase bg-orange text-white py-4 border-2 border-orange hover:bg-ember hover:border-ember transition-all disabled:opacity-60 mt-2"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-[.75rem] tracking-wide text-umber text-center">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="underline hover:text-orange transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
