
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Templates } from "../components/Templates";
import { Pricing } from "../components/Pricing";
import { CTABanner } from "../components/CTABanner";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
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