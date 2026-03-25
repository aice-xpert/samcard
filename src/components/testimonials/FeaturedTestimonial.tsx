"use client";

import { Star, Quote } from "lucide-react";
import { FeaturedTestimonial } from "@/constant";
import Image from "next/image";

interface Props {
  testimonial: FeaturedTestimonial;
}

export default function FeaturedTestimonialCard({ testimonial }: Props) {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-black ">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="rounded-[22px] bg-gradient-to-b from-theme-devil-green to-black p-10 lg:p-14">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-accent fill-accent" />
                  ))}
                </div>

                <Quote size={40} className="text-accent/40" />

                <blockquote className="text-xl lg:text-2xl text-gray-200 italic leading-relaxed">
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
                    <div className="text-gray-400">
                      {testimonial.role} · {testimonial.company}
                    </div>
                    <div className="text-accent text-sm mt-1">
                      {testimonial.industry}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="text-5xl font-bold text-accent mb-2">
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