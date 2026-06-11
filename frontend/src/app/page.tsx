
import dynamic from "next/dynamic";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Pricing } from "../components/Pricing";
import { CTABanner } from "../components/CTABanner";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";

const Templates = dynamic(
  () => import("../components/Templates").then((m) => m.Templates),
  {
    loading: () => (
      <section id="templates" className="py-24 bg-gradient-to-b from-[#031203] to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-56 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </section>
    ),
  },
);

export default function Home() {
  return (
    <>
      
      <Hero />
      <Features />
      <Templates />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTABanner />
      
    </>
  );
}