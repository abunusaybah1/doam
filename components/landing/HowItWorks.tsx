import { steps } from "@/lib/data";

export default function HowItWorks() {
  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="flex items-center gap-4 text-[#cc4e00] text-[0.65rem] uppercase tracking-[0.2em] mb-8">
        How it works
        <span className="flex-1 h-px bg-[#2a2a2a]" />
      </div>
      <div className="flex flex-col md:flex-row gap-px bg-[#2a2a2a]">
        {steps.map((s) => (
          <div key={s.num} className="bg-[#0e0e0e] flex-1 p-7 md:p-8">
            <p className="font-playfair text-[2.5rem] font-black text-[#2a2a2a] mb-3 leading-none">
              {s.num}
            </p>
            <h3 className="text-[0.85rem] font-medium tracking-[0.04em] text-[#f5f5dc] mb-3">
              {s.title}
            </h3>
            <p className="text-[0.76rem] leading-[1.85] text-[#f5f5dc]/50">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
