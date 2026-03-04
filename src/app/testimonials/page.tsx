import FeaturedTestimonialCard from "@/components/testimonials/FeaturedTestimonial";
import TestimonialGrid from "@/components/testimonials/TestimonialGrid";
import CaseStudies from "@/components/testimonials/CaseStudy";
import { CTABanner } from "@/components/CTABanner";
import { EXTENDED_TESTIMONIALS } from "@/constant";

export default function TestimonialsPage() {
  const featured = EXTENDED_TESTIMONIALS.find(t => t.isFeatured);

  return (
    <div className="bg-black  min-h-screen text-white pt-24">
      {featured && (
        <FeaturedTestimonialCard testimonial={featured} />
      )}
      <TestimonialGrid />
      <CaseStudies />
      <CTABanner />
    </div>
  );
}