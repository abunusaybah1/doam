"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const FILTERS = [
  { label: "All problems", href: "/problems" },
  { label: "In progress", href: "/problems?filter=in_progress" },
  { label: "Completed", href: "/problems?filter=completed" },
];

export default function ProblemsNavDropdown({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-parch/60 hover:text-parch text-[0.7rem] uppercase tracking-widest transition-colors"
      >
        Problems
        <FiChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={12}
        />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-44 bg-surface border border-border flex flex-col z-50">
          {FILTERS.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="text-parch/70 hover:text-parch hover:bg-border text-[0.7rem] uppercase tracking-widest px-4 py-3 border-b border-border last:border-b-0 transition-colors"
            >
              {f.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
