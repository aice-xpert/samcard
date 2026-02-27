"use client";

import { TESTIMONIAL_STATS, TESTIMONIALS } from "../constant";
import {motion} from "motion/react"
import TestimonialsCard from "./TestimonialsCard";

const VIEWPORT = { once: true }

export default function Testimonials() {
  return (
    <section
      id="testimonails"
      className="py-24 bg-gradient-to-b from-[#031103] to-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
          >
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Loved by Professionals Worldwide
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their <br />
            networking with DigiCard.
          </p>
        </motion.div>

        {/* Testimonials Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialsCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/10 text-center">
          {TESTIMONIAL_STATS.map(({ value, label }, index) => (
            <motion.div 
              key={label} 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl font-bold text-[#009200]">{value}</div>
              <div className="text-white">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
