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
        <h1 className=" text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] font-black leading-[1.05] mb-5 text-parch">
          Your community&apos;s problems,{" "}
          <em className="italic text-orange">documented.</em>
        </h1>
        <p className="font-serif-body font-light text-base sm:text-lg leading-[1.85] text-parch/90 mb-8 lg:max-w-fit">
          Do&minus;am is a documentary of the real problems facing local
          communities... reported by the people who experience them first hand
          them... solved by the people who care.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <Link
            href="/auth/signup"
            className="bg-orange text-parch text-[0.75rem] uppercase tracking-widest px-6 py-4 text-center hover:bg-ember transition-colors"
          >
            Get Started
          </Link>
          {/* <Link
            href="/problems"
            className="text-[#f5f5dc]/55 hover:text-[#f5f5dc] text-[0.75rem] uppercase tracking-widest text-center sm:text-left py-2 transition-opacity"
          >
            Browse problems
          </Link> */}
        </div>
      </div>

      <div className="mt-10 lg:mt-0 lg:w-fit">
        <div className="border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-orange font-bold text-[0.65rem] uppercase tracking-[0.18em] mb-4">
            Most recent reports
          </div>
          <hr className="mb-4 -mt-3 w-[30%] text-orange border" />
          <div className="divide-y divide-border">
            {latestReports.map((r, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0">
                <p className="text-[0.78rem] leading-[1.65]">{r.text}</p>
                <div className="text-umber flex justify-between pr-5 md:pr-0 md:justify-start items-center mt-2 md:gap-2">
                  <p className="text-[0.6rem] mt-1 flex items-center gap-1">
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

        <div className="flex flex-wrap gap-px bg-border border border-border border-t-0 mt-px">
          {stats.map((s) => (
            <div
              key={s.label}
              className=" flex-1 min-w-[calc(33.333%-1px)] bg-surface py-4 px-2 text-center"
            >
              <p className=" text-[1.5rem] sm:text-[1.8rem] font-black text-orange">
                {s.num}
              </p>
              <p className="text-[0.58rem] uppercase tracking-[0.08em] text-umber mt-1 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
