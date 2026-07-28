"use client";

import { useState } from "react";
import { sendContactMessage } from "@/app/contact-us/actions";
import { BiCheckCircle } from "react-icons/bi";

export default function ContactForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await sendContactMessage(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    form.reset();
  }

  if (success) {
    return (
      <div className="bg-surface px-6 py-8 flex flex-col gap-4 text-center items-center justify-center">
        <BiCheckCircle className="text-parch scale-150" />
        <p className="flex justify-center items-center gap-2 text-[0.7rem] uppercase tracking-widest text-orange-500 font-bold">
          Message sent
        </p>
        <p className="text-[0.85rem] text-parch/70">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      {/* honeypot — hidden from real users via CSS, not display:none which some bots skip */}
      <div className="absolute -left-2499.75" aria-hidden="true">
        <label>
          Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Your name <span className="text-orange">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="Full name"
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Your email <span className="text-orange">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Your Whatsapp Number <span className="text-orange">*</span>
        </label>
        <input
          name="whatsapp"
          type="tel"
          required
          placeholder="Your WhatsApp number"
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Subject <span className="text-orange">*</span>
        </label>
        <input
          name="subject"
          type="text"
          required
          placeholder="What's this about?"
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.68rem] uppercase tracking-widest text-umber">
          Message <span className="text-orange">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us what's going on"
          className="bg-parch border-2 border-parch outline-none px-4 py-3 text-[.9rem] text-bark placeholder:text-warm transition-colors resize-none"
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
        className="bg-orange text-parch text-[0.7rem] uppercase tracking-widest py-4 hover:bg-ember transition-colors disabled:opacity-60 mt-1"
      >
        {loading ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
