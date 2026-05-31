"use client";

const items = [
  "Infrastructure",
  "Health",
  "Education",
  "Water & Sanitation",
  "Security",
  "Environment",
  "Power & Energy",
  "Employment",
  "Infrastructure",
  "Health",
  "Education",
  "Water & Sanitation",
];

export default function Ticker() {
  return (
    <div className="bg-brand border-y-2 border-ink overflow-hidden py-3">
      <div className="flex gap-0 animate-[ticker_18s_linear_infinite] whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span
            key={i}
            className="font-mono font-bold text-[12px] text-white uppercase tracking-widest px-8 flex items-center gap-8"
          >
            {item}
            <span className="text-white/40">✦</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
