import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import {Features} from "@/components/Features";
import { Templates } from "@/components/Templates";
import { Pricing } from "@/components/Pricing";
export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <Features />
      <Templates />
      <Pricing />
    </>
  );
}