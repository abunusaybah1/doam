"use client";

import Image from "next/image";
import { sampleProblems } from "@/lib/data";
import { GrLocation } from "react-icons/gr";
import { BiSolidUpvote } from "react-icons/bi";

export default function SampleProblems() {
  return (
    <section className="bg-bark border-b-[3px] border-soil">
      <div className="px-10 py-14 border-b border-white/10">
        <div className=" flex flex-col gap-6">
          <p className="font-barlow font-bold text-[.7rem] tracking-[.2em] uppercase text-ember -mb-5">
            Real problems, Real people...
          </p>
          <h2
            className="font-playfair font-black leading-[.92] text-cream"
            style={{ fontSize: "clamp(2.8rem,5.5vw,5rem)" }}
          >
            This is what we&apos;re fixing.
          </h2>
          <p className="font-lora italic text-[.95rem] leading-relaxed max-w-[80vw]">
            These aren&apos;t statistics. These are people&apos;s daily
            realities... and they&apos;re waiting for someone to DoAm.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap">
        {sampleProblems.slice(0, 4).map((problem) => (
          <div
            key={problem.id}
            className="p-4 lg:w-[48%] md:w-[50%] sm:w-[90%] relative"
          >
            <Image
              src={problem.img}
              alt={problem.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className=" ">
              <span
                className={` text-[10px] absolute top-8 right-6 float-end ${problem.status === "CRITICAL" ? "bg-red-500 text-white" : problem.status === "URGENT" ? "bg-orange-500 text-white" : "bg-green-500 text-white"} px-2 py-1 rounded-full uppercase font-bold tracking-wide`}
              >
                {problem.status}
              </span>
              <p className="text-[10px] absolute top-8 left-6 flex gap-1 items-center bg-[#cc4e00]/80 text-white px-2 py-1 rounded-full uppercase font-medium">
                <span>
                  <GrLocation />
                </span>
                {problem.location}
              </p>
              <div className="absolute max-w-[80%] bottom-8 left-6 flex flex-col justify-end lg:h-full gap-2 md:h-fit sm:h-full">
                <h3 className=" text-[1.25em]">{problem.title}</h3>
                <p className="top-28 left-6 text-[.9em] ">{problem.desc}</p>
                <p className=" text-[11px] w-fit flex gap-1 items-center bg-[#cc4e00]/80 text-white px-2 py-1 rounded-full uppercase font-medium">
                  <span>
                    <BiSolidUpvote />{" "}
                  </span>
                  {problem.endorsement} endorsement
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        <div className="lg:w-[55%] flex overflow-hidden cursor-pointer">
          {sampleProblems.slice(0, 4).map((problem) => (
            <div key={problem.id} className="group">
              {/* <Image
                src={problem.img}
                alt={problem.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              /> */}
              {/* <div className="absolute inset-0 bg-linear-to-t from-bark via-bark/40 to-transparent" /> */}

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`font-barlow font-bold text-[.65rem] tracking-[.14em] uppercase px-2.5 py-1 border-[1.5px] ${problem.tagColor}`}
                  >
                    {/* {problem.tag} */}
                  </span>
                  <span className="font-barlow font-semibold text-[.68rem] tracking-widest uppercase text-white/50">
                    {/* {problem.category} · {problem.location} */}
                  </span>
                </div>
                <h3 className="font-playfair font-black text-[1.5rem] text-white leading-tight mb-2">
                  {/* {problem.title} */}
                </h3>
                <p className="font-lora italic text-[.85rem] text-white/70 leading-relaxed mb-4 max-w-md">
                  {/* {problem.desc} */}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-barlow text-[.68rem] tracking-wide uppercase text-white/40">
                    {/* {problem.followers} following */}
                  </span>
                  <button className="font-barlow font-bold text-[.72rem] tracking-widest uppercase bg-orange text-white px-5 py-2 hover:bg-ember transition-colors">
                    {/* DoAm → */}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-[25%] bg-orange flex flex-col justify-between p-8">
        <div>
          <p className="font-barlow font-bold text-[.65rem] tracking-[.2em] uppercase text-white/60 mb-4">
            The reality
          </p>
          <p className="font-playfair font-black text-[2rem] text-white leading-tight">
            133M Nigerians live in multidimensional poverty.
          </p>
        </div>
        <div>
          <div className="w-8 h-0.5 bg-white/40 mb-4" />
          <p className="font-lora italic text-[.88rem] text-white/70 leading-relaxed mb-6">
            Every problem on this platform is a real person&apos;s daily
            reality. Not a statistic. A life.
          </p>
          <a
            href="#join"
            className="font-barlow font-bold text-[.8rem] tracking-widest uppercase bg-bark text-cream px-6 py-3 hover:bg-soil transition-colors inline-block"
          >
            Start solving →
          </a>
        </div>
      </div>
    </section>
  );
}
