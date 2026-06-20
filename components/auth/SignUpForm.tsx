"use client";

import React from "react";

const SignUpForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [fName, setFName] = React.useState("");
  const [lName, setLName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = () => {
    console.log("submitted");
  };

  const verifyPassword = () => {
    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="font-barlow font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          First name
        </label>
        <input
          name="fullName"
          type="text"
          required
          placeholder="Abdulmatiin"
          value={fName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFName(e.target.value)
          }
          className="bg-transparent border-2 border-parch focus:border-orange outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-barlow font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Last name
        </label>
        <input
          name="lastName"
          type="text"
          required
          placeholder="Ismail"
          value={lName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLName(e.target.value)
          }
          className="bg-transparent border-2 border-parch focus:border-orange outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          className="bg-transparent border-2 border-parch focus:border-orange outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-barlow font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="bg-transparent border-2 border-parch focus:border-orange outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-barlow font-bold text-[.68rem] tracking-[.16em] uppercase text-umber">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          placeholder="Retype your password"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
          className="bg-transparent border-2 border-parch focus:border-orange outline-none px-4 py-3.5 font-lora text-[.95rem] text-bark placeholder:text-warm transition-colors"
          onKeyUp={verifyPassword}
        />
      </div>

      {error &&
        (setTimeout(() => {
          setError("");
        }, 3000),
        (
          <p className="font-barlow text-[.78rem] tracking-wide text-red-500 border-l-2 border-red-500 pl-3">
            {error}
          </p>
        ))}

      <button
        type="submit"
        disabled={loading}
        className="font-barlow font-bold text-[.9rem] tracking-[.08em] uppercase bg-orange text-white py-4 border-2 border-orange hover:bg-ember hover:border-ember transition-all disabled:opacity-60 mt-2"
      >
        {!error && !loading ? "Create account →" : "Creating account..."}
      </button>
    </form>
  );
};

export default SignUpForm;
