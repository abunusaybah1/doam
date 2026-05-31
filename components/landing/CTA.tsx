"use client";

import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    // Supabase insert comes here later
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section id="join" className="bg-ink border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <p className="font-mono text-[11px] text-brand uppercase tracking-widest mb-6">
              — Join the movement
            </p>
            <h2 className="font-syne font-extrabold text-[clamp(3rem,7vw,5.5rem)] text-white leading-[0.92] tracking-tight uppercase">
              Nigeria
              <br />
              won&apos;t fix
              <br />
              <span className="text-brand">itself.</span>
            </h2>
          </div>

          <div>
            <p className="font-dm text-white/60 text-base leading-relaxed mb-8">
              Be the first to know when DoAm launches in your state. No spam —
              just updates that matter.
            </p>

            {submitted ? (
              <div className="border-2 border-brand p-5">
                <p className="font-mono text-[13px] text-brand">
                  ✓ You&apos;re on the list. We&apos;ll reach out soon.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-0 border-2 border-white/20 focus-within:border-brand transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent text-white font-mono text-[13px] px-5 py-4 outline-none placeholder:text-white/30"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-brand text-white font-mono font-bold text-[12px] px-8 py-4 hover:bg-white hover:text-ink transition-colors whitespace-nowrap"
                >
                  Join waitlist →
                </button>
              </div>
            )}

            <p className="font-mono text-[11px] text-white/25 mt-4">
              Free. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
