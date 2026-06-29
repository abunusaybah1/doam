"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const LoginForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const [eyeOpen, setEyeOpen] = useState(true);

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
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="font-barlow font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Email address
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-barlow font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Password
        </label>
        <div className="flex ">
          <input
            name="password"
            type={eyeOpen ? "password" : "text"}
            required
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-6/7 bg-parch border-2 border-parch  outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
          />
          <button
            type="button"
            onClick={() => setEyeOpen(!eyeOpen)}
            className="flex-1/7 w-fit bg-parch border-2 border-parch outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors flex items-center justify-center"
          >
            {eyeOpen ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>
      </div>

      {error && (
        <p className="font-barlow text-[.78rem] tracking-wide text-red-500 border-l-2 border-red-500 pl-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="font-barlow font-bold text-[.9rem] tracking-[.08em] uppercase bg-orange text-white py-4 border-2 border-orange hover:bg-ember hover:border-ember transition-all disabled:opacity-60 mt-2"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="font-barlow text-[.75rem] tracking-wide text-umber text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="underline hover:text-orange transition-colors"
        >
          Create one
        </Link>
      </p>
      <Link
        href="/auth/forgot-password"
        className="text-orange hover:underline text-center text-[.75rem] tracking-wide mt-2"
      >
        Forgot password?
      </Link>
    </form>
  );
};

export default LoginForm;
