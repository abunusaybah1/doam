"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const FILTERS = [
  { label: "All problems", value: "all", href: "/problems" },
  {
    label: "In progress",
    value: "in_progress",
    href: "/problems?filter=in_progress",
  },
  {
    label: "Completed",
    value: "completed",
    href: "/problems?filter=completed",
  },
];

export default function ProblemsFilterDropdown({ active }: { active: string }) {
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

  const current = FILTERS.find((f) => f.value === active) ?? FILTERS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[0.7rem] uppercase tracking-widest text-parch/70 hover:text-parch transition-colors"
      >
        {current.label}
        <FiChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-44 bg-surface border border-border flex flex-col z-50">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.href}
              onClick={() => setOpen(false)}
              className={`text-[0.7rem] uppercase tracking-widest px-4 py-3 border-b border-border last:border-b-0 transition-colors ${
                f.value === active
                  ? "text-orange"
                  : "text-parch/70 hover:text-parch hover:bg-border"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
