"use client";
import { Testimonial } from "@/constant";
import { Star } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialsCard({
  testimonial,
}: TestimonialCardProps) {
  const { isDark } = useTheme();

  return (
    <div className={`backdrop-blur-sm border rounded-2xl p-8 transition-all ${
      isDark
        ? "bg-white/5 border-white/10 hover:border-[#008001]/100"
        : "bg-white border-gray-200 hover:border-[#008001]/100 shadow-sm"
    }`}>
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="text-[#49B618] fill-[#49B618]" size={20} />
        ))}
      </div>

      <p className="text-muted-foreground leading-relaxed mb-6">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
          width={48}
          height={48}
        />
        <div>
          <div className="font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-sm text-muted-foreground">
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>
    </div>
  );
}
