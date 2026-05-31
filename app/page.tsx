import Hero from "@/components/landing/Hero";
import Ticker from "@/components/landing/Ticker";
import HowItWorks from "@/components/landing/HowItWorks";
import Categories from "@/components/landing/Categories";
import Stats from "@/components/landing/Stats";
import FeaturedProblems from "@/components/landing/FeaturedProblems";
import WhoItsFor from "@/components/landing/WhoItsFor";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="bg-chalk">
      <Hero />
      <Ticker />
      <HowItWorks />
      <Categories />
      <Stats />
      <FeaturedProblems />
      <WhoItsFor />
      <CTA />
    </main>
  );
}
