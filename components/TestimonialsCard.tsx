import { Testimonial } from "@/constant";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialsCard({
  testimonial,
}: TestimonialCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#008001]/100 transition-all">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="text-[#49B618] fill-[#49B618]" size={20} />
        ))}
      </div>

      <p className="text-gray-300 leading-relaxed mb-6">"{testimonial.text}"</p>

      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-sm text-gray-400">
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>
    </div>
  );
}
