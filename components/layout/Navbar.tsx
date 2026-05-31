"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-chalk border-b-2 border-ink" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink flex items-center justify-center">
            <span className="font-mono font-bold text-[11px] text-brand">
              DA
            </span>
          </div>
          <span className="font-syne font-bold text-lg text-ink leading-none">
            DoAm.ng
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "How it works", href: "#how" },
            { label: "Problems", href: "#problems" },
            { label: "Who it's for", href: "#who" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[12px] text-muted hover:text-ink px-4 py-2 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="#join"
            className="ml-4 bg-brand text-white font-mono font-bold text-[12px] px-5 py-2.5 border-2 border-ink hover:bg-ink transition-colors"
          >
            Get started →
          </Link>
        </div>
      </div>
    </nav>
  );
}
