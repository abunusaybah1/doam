import { roles } from "@/lib/data";

export default function Roles() {
  return (
    <section className="px-5 pb-12 md:px-10 md:pb-16">
      <div className="flex items-center font-bold gap-4 text-ember text-[0.65rem] uppercase tracking-[0.2em] mb-8">
        Who it&apos;s for
        <span className="flex-1 h-px bg-border" />
      </div>
      <div className="flex flex-col md:flex-row gap-px bg-border">
        {roles.map((r) => (
          <div key={r.tag} className="bg-surface flex-1 p-8 md:p-10">
            <span className="inline-block border border-orange text-orange text-[0.6rem] uppercase tracking-[0.18em] px-2 py-1 mb-5">
              {r.tag}
            </span>
            <h3 className=" text-[1.7rem] sm:text-[2rem] font-bold leading-[1.2] mb-4">
              {r.title}
            </h3>
            <p className="font-serif-body font-light text-[0.8rem] leading-[1.9] text-[#f5f5dc]/55">
              {r.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
