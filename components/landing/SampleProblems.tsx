"use client";

import Image from "next/image";
import { sampleProblems } from "@/lib/data";
import { GrLocation } from "react-icons/gr";
import { BiSolidUpvote } from "react-icons/bi";

export default function SampleProblems() {
  return (
    <section className="py-6">
      <div className="px-10">
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

      <div className="flex justify-center items-center flex-wrap pt-5">
        {sampleProblems.slice(0, 4).map((problem) => (
          <div
            key={problem.id}
            className=" h-87.5 w-full p-4 lg:w-[48%] md:w-[50%] sm:w-[90%] relative"
          >
            <Image
              src={problem.img}
              alt={problem.title}
              className="w-full h-full object-cover opacity-40 border border-[#2a2a2a] rounded-lg shadow-lg shadow-[#ffffff]/10"
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
                <h3 className=" text-[1.25em] font-bold">{problem.title}</h3>
                <p className="top-28 left-6 text-[.9em] font-semibold">
                  {problem.desc}
                </p>
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
    </section>
  );
}
