import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Templates } from "../components/Templates";
import { Pricing } from "../components/Pricing";
import Footer from "../components/Footer";
import { CTABanner } from "../components/CTABanner";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";
export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <Features />
      <Templates />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </>
  );
}