import Link from "next/link";
import { stats } from "@/lib/data";
import { latestReports } from "@/lib/data";
import { GoLocation } from "react-icons/go";
import { MdOutlineAccessTime } from "react-icons/md";

export default function Hero() {
  return (
    <section
      className="
     px-5 pt-10 pb-8 md:px-10 md:pt-20 md:pb-14 lg:flex lg:gap-16 lg:items-center"
    >
      <div className="lg:w-fit max-w-220">
        <h1 className="font-playfair text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] font-black leading-[1.05] mb-5">
          Your community&apos;s problems,{" "}
          <em className="italic text-[#cc4e00]">documented.</em>
        </h1>
        <p className="font-serif-body font-light text-base sm:text-lg leading-[1.85] text-[#f5f5dc]/65 mb-8 lg:max-w-fit">
          Do&minus;am is adocumentary of the real problems facing local
          communities... reported by the people who experience them first hand
          them... solved by the people who care.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <Link
            href="/login"
            className="bg-[#cc4e00] text-[#f5f5dc] text-[0.75rem] uppercase tracking-widest px-6 py-4 text-center hover:bg-[#b34400] transition-colors"
          >
            Get Started!
          </Link>
          {/* <Link
            href="/problems"
            className="text-[#f5f5dc]/55 hover:text-[#f5f5dc] text-[0.75rem] uppercase tracking-widest text-center sm:text-left py-2 transition-opacity"
          >
            Browse problems →
          </Link> */}
        </div>
      </div>

      <div className="mt-10 lg:mt-0 lg:w-fit">
        <div className="border border-[#2a2a2a] bg-[#141414] p-5">
          <div className="flex items-center gap-2 text-[#cc4e00] font-bold text-[0.65rem] uppercase tracking-[0.18em] mb-4">
            {/* <span className="w-1.5 h-1.5 rounded-full bg-[#cc4e00] animate-pulse-dot shrink-0" /> */}
            Most recent reports
          </div>
          <hr className="mb-4 -mt-3 w-[30%] text-[#cc4e00] border" />
          <div className="divide-y divide-[#2a2a2a]">
            {latestReports.map((r, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0">
                
                <p className="text-[0.78rem] leading-[1.65]">{r.text}</p>
                <div className="text-[#f5f5dc]/50 flex justify-between pr-5 md:pr-0 md:justify-start items-center mt-2 md:gap-2">
                  <p className="text-[0.6rem] mt-1 flex items-center gap-1 text-[#f5f5dc]/50">
                    <span>
                      <GoLocation className="text-[12px]" />
                    </span>
                    {r.loc}
                  </p>
                  <span className="hidden md:block">•</span>
                  <p className="text-[0.6rem] mt-1  flex gap-1 ">
                    <span>
                      <MdOutlineAccessTime className="text-[12px]" />
                    </span>
                    {r.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-px bg-[#2a2a2a] mt-px">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex-1 min-w-[calc(33.333%-1px)] bg-[#141414] py-4 px-2 text-center"
            >
              <p className="font-playfair text-[1.5rem] sm:text-[1.8rem] font-black text-[#cc4e00]">
                {s.num}
              </p>
              <p className="text-[0.58rem] uppercase tracking-[0.08em] text-[#f5f5dc]/45 mt-1 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
