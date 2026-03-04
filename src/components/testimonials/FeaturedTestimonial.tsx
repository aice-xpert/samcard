"use client";

import { Star, Quote } from "lucide-react";
import { FeaturedTestimonial } from "@/constant";

interface Props {
  testimonial: FeaturedTestimonial;
}

export default function FeaturedTestimonialCard({ testimonial }: Props) {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="rounded-[22px] bg-gradient-to-b from-theme-devil-green to-black p-10 lg:p-14">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-[#4FD1C5] fill-[#4FD1C5]" />
                  ))}
                </div>

                <Quote size={40} className="text-[#4FD1C5]/40" />

                <blockquote className="text-xl lg:text-2xl text-gray-200 italic leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#4FD1C5]/40"
                  />
                  <div>
                    <div className="font-semibold text-white text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400">
                      {testimonial.role} · {testimonial.company}
                    </div>
                    <div className="text-[#4FD1C5] text-sm mt-1">
                      {testimonial.industry}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="text-5xl font-bold text-[#4FD1C5] mb-2">
                  +60%
                </div>
                <div className="text-gray-400">
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