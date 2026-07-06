"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const verifyPassword = () => {
    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

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
  };

  // Email Confirmation logic
  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <div className="border-l-2 border-orange pl-4 py-1">
          <p className="  font-bold text-[.78rem] tracking-[.12em] uppercase text-orange mb-1">
            Check your email
          </p>
          <p className="  text-[.92rem] text-parch/70 leading-relaxed">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account.
          </p>
        </div>
        <p className="  text-[.75rem] tracking-wide text-parch/70">
          Wrong email?{" "}
          <button
            onClick={() => {
              setSuccess(false);
              setEmail("");
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
          <label className="  font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
            First name <span className="text-orange">*</span>
          </label>
          <input
            name="firstName"
            type="text"
            required
            placeholder="Abdulmatiin"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="  font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
            Last name <span className="text-orange">*</span>
          </label>
          <input
            name="lastName"
            type="text"
            required
            placeholder="Ismail"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="  font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Email address <span className="text-orange">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="  font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
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
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="  font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
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
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5   text-[.95rem] text-bark placeholder:text-warm transition-colors"
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
        <p className="  text-[.78rem] tracking-wide text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !!error}
        className="  font-bold text-[.9rem] tracking-[.08em] uppercase bg-orange text-white py-4 border-2 border-orange hover:bg-ember hover:border-ember transition-all disabled:opacity-60 mt-2"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="  text-[.75rem] tracking-wide text-umber text-center">
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
