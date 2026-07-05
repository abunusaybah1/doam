import { steps } from "@/lib/data";
import Link from "next/dist/client/link";

export default function HowItWorks() {
  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="flex items-center gap-4 text-ember font-bold text-[0.65rem] uppercase tracking-[0.2em] mb-8">
        How it works
        <span className="flex-1 h-px bg-border" />
      </div>
      <div className="flex flex-col md:flex-row gap-px bg-border">
        {steps.map((s) => (
          <div key={s.num} className="bg-bark flex-1 p-7 md:p-8">
            <p className=" text-[2.5rem] font-black text-border mb-3 leading-none">
              {s.num}
            </p>
            <h3 className="text-[0.85rem] font-medium tracking-[0.04em] text-parch mb-3">
              {s.title}
            </h3>
            <p className="text-[0.76rem] leading-[1.85] text-parch/70">
              {s.desc}
            </p>
          </div>
        ))}
      </div>{" "}
      <div className="mt-10 text-center">
        <Link
          href="/how-it-works"
          className="text-[0.72rem] uppercase tracking-widest font-bold bg-surface p-3 border border-border hover:bg-bark hover:border-orange text-orange hover:text-ember transition-colors"
        >
          Read more...
        </Link>
      </div>
    </section>
  );
}
