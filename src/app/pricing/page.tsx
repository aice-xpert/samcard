import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingCards } from "@/components/pricing/PricingCards";
import { PricingComparison } from "@/components/pricing/PricingComparison";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { CTABanner } from "@/components/CTABanner";
import { MoneyBack } from "@/components/pricing/MoneyBack";


export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingCards />
      <PricingComparison />
      <PricingFAQ />
      <MoneyBack />
      <CTABanner />
    </>
  );
}