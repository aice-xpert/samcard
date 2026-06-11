"use client";
import { TESTIMONIAL_STATS, TESTIMONIALS } from "../constant";
import TestimonialsCard from "./TestimonialsCard";
import { useTheme } from "@/contexts/ThemeContext";

export default function Testimonials() {
  const { isDark } = useTheme();

  return (
    <section
      id="testimonails"
      className={`py-24 ${
        isDark
          ? "bg-gradient-to-b from-[#031103] to-black"
          : "bg-gradient-to-b from-[#e8f3e8] to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Loved by Professionals Worldwide
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their <br />
            networking with SamCard.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
            >
              <TestimonialsCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-16 border-t ${
          isDark ? "border-white/10" : "border-gray-200"
        } text-center`}>
          {TESTIMONIAL_STATS.map(({ value, label }) => (
            <div 
              key={label} 
              className="space-y-2"
            >
              <div className="text-4xl font-bold text-[#009200]">{value}</div>
              <div className="text-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
