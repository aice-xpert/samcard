import HeroSection from "@/components/features/HeroSection";
import CoreFeatures from "@/components/features/CoreFeatures";
import AdditionalFeatures from "@/components/features/AdditionalFeatures";
import IntegrationSection from "@/components/features/IntegrationSection";
import StatsSection from "@/components/features/StatsSection";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <CoreFeatures />
      <AdditionalFeatures />
      <IntegrationSection />
      <StatsSection />
    </div>
  );
}