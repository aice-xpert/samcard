"use client";

import { Star, Quote } from "lucide-react";
import { FeaturedTestimonial } from "@/constant";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  testimonial: FeaturedTestimonial;
}

export default function FeaturedTestimonialCard({ testimonial }: Props) {
  const { isDark } = useTheme();

  return (
    <section className={`py-10 px-4 sm:px-6 lg:px-8 ${isDark ? "bg-black" : "bg-background"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <div className={`rounded-[22px] bg-gradient-to-b from-theme-devil-green ${isDark ? "to-black" : "to-background"} p-10 lg:p-14`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-accent fill-accent" />
                  ))}
                </div>

                <Quote size={40} className="text-accent/40" />

                <blockquote className="text-xl lg:text-2xl text-muted-foreground italic leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-accent/40"
                  />
                  <div>
                    <div className="font-semibold text-white text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </div>
                    <div className="text-accent text-sm mt-1">
                      {testimonial.industry}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${isDark ? "bg-white/5 border border-white/10" : "bg-white border-gray-200 shadow-sm"} rounded-2xl p-8`}>
                <div className="text-5xl font-bold text-accent mb-2">
                  +60%
                </div>
                <div className="text-muted-foreground">
                  Increase in lead-to-client conversions
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
