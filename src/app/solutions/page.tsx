import {CTABanner} from "@/components/CTABanner";
import {Hero} from "@/components/solutions/Hero-Solutions";
import { HighlightSection } from "@/components/solutions/HighlightSection";
import SolutionsGrid from "@/components/solutions/SolutionGrid";
export default function SolutionsPage() {
  return (
    <>
      
      <Hero />
      <SolutionsGrid/>
      <HighlightSection />
      <CTABanner />
      
    </>
  );
}