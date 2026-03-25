import FeaturedTestimonialCard from "@/components/testimonials/FeaturedTestimonial";
import TestimonialGrid from "@/components/testimonials/TestimonialGrid";
import CaseStudies from "@/components/testimonials/CaseStudy";
import { CTA } from "@/components/testimonials/CTA";
import { EXTENDED_TESTIMONIALS } from "@/constant";
import {Hero} from "@/components/testimonials/Hero";
import { FeaturedTestimonial } from "@/components/testimonials/RotatingTestimonial";
import { StatsBar } from "@/components/testimonials/StatsBar";
import { ReviewPlatforms } from "@/components/testimonials/ReviewPlatforms";

export default function TestimonialsPage() {
  const featured = EXTENDED_TESTIMONIALS.find(t => t.isFeatured);

  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedTestimonial />
      {featured && (
        <FeaturedTestimonialCard testimonial={featured} />
      )}
      <TestimonialGrid />
      <CaseStudies />
      <ReviewPlatforms />
      <CTA />
    </>
  );
}