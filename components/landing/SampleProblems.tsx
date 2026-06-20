"use client";

import Image from "next/image";

const sampleProblems = [
  {
    id: "01",
    category: "Infrastructure",
    location: "Anambra State",
    title: "Roads that swallow people whole",
    desc: "Potholes the size of craters. Cars disappearing into mud. People dying on routes that should have been fixed years ago. This is not an accident — it is abandonment.",
    img: "https://guardian.ng/wp-content/uploads/2019/08/Road.jpg",
    followers: 312,
    tag: "CRITICAL",
    tagColor: "text-orange border-orange",
  },
  {
    id: "02",
    category: "Education",
    location: "Abuja, FCT",
    title: "Children learning on bare concrete floors",
    desc: "No desks. No chairs. 60 pupils in a room built for 20. Teachers doing their best in conditions that say clearly — nobody is paying attention.",
    img: "https://guardian.ng/wp-content/uploads/2022/06/School-kids-on-floor.jpg",
    followers: 198,
    tag: "URGENT",
    tagColor: "text-[#2B5FA8] border-[#2B5FA8]",
  },
  {
    id: "03",
    category: "Water & Sanitation",
    location: "Kano State",
    title: "4km for a bucket of water, every single day",
    desc: "Women and children walk hours before sunrise just to get water that is barely clean. There is no excuse for this in 2026. None.",
    img: "https://borgenproject.org/wp-content/uploads/Nigeria-Water.jpg",
    followers: 445,
    tag: "CRITICAL",
    tagColor: "text-orange border-orange",
  },
  {
    id: "04",
    category: "Power & Energy",
    location: "Lagos State",
    title: "Darkness as a way of life",
    desc: "Generators running 20 hours a day. Businesses folding. Students reading by candlelight. NEPA has been a punchline for 40 years. It shouldn't still be funny.",
    img: "https://dailytrust.com/wp-content/uploads/2023/01/blackout.jpg",
    followers: 527,
    tag: "ONGOING",
    tagColor: "text-[#2D7A5F] border-[#2D7A5F]",
  },
];

export default function SampleProblems() {
  return (
    <section className="bg-bark border-b-[3px] border-soil">
      <div className="px-10 py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10">
        <div>
          <p className="font-barlow font-bold text-[.7rem] tracking-[.2em] uppercase text-ember mb-3">
            — Real problems. Real people.
          </p>
          <h2
            className="font-playfair font-black leading-[.92] text-cream"
            style={{ fontSize: "clamp(2.8rem,5.5vw,5rem)" }}
          >
            This is what
            <br />
            we&apos;re fixing.
          </h2>
        </div>
        <p className="font-lora italic text-[.95rem] text-warm leading-relaxed max-w-xs">
          These aren&apos;t statistics. These are people&apos;s daily realities
          — and they&apos;re waiting for someone to DoAm.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10">
       
        <div className="lg:w-[55%] group relative overflow-hidden cursor-pointer">
          {sampleProblems.map((problem, index) => (
            <div>
            <div key={problem.id} className={index === 0 ? "" : "hidden"}>
              <Image
                src={problem.img}
                alt={problem.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/800x400/231409/F0E9DC?text=Infrastructure";
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-bark via-bark/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`font-barlow font-bold text-[.65rem] tracking-[.14em] uppercase px-2.5 py-1 border-[1.5px] ${problem.tagColor}`}
                >
                  {problem.tag}
                </span>
                <span className="font-barlow font-semibold text-[.68rem] tracking-widest uppercase text-white/50">
                  {problem.category} · {problem.location}
                </span>
              </div>
              <h3 className="font-playfair font-black text-[1.5rem] text-white leading-tight mb-2">
                {problem.title}
              </h3>
              <p className="font-lora italic text-[.85rem] text-white/70 leading-relaxed mb-4 max-w-md">
                {problem.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-barlow text-[.68rem] tracking-wide uppercase text-white/40">
                  {problem.followers} following
                </span>
                <button className="font-barlow font-bold text-[.72rem] tracking-widest uppercase bg-orange text-white px-5 py-2 hover:bg-ember transition-colors">
                  DoAm →
                </button>
              </div>
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
      </div>
    </section>
  );
}
