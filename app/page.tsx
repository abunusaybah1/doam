import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Roles from "@/components/landing/Roles";
import CtaBand from "@/components/landing/CTA";
import SampleProblems from "@/components/landing/SampleProblems";

export default function Home() {
  return (
    <main className="bg-[#0e0e0e] min-h-screen text-[#f5f5dc]">
      <Hero />
      <hr className="border-t border-[#2a2a2a] mx-5 md:mx-10" />
      <SampleProblems />
      <HowItWorks />
      <Roles />
      <CtaBand />
    </main>
  );
}
