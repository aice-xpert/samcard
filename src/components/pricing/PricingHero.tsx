"use client";


import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function PricingHero() {

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-theme-devil-green via-black to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          {/* Top Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2
                       bg-theme-digital-green/20
                       border border-theme-digital-green/30
                       rounded-full text-theme-kelly-green text-sm"
          >
            <Zap size={16} />
            <span>All plans include 14-day free trial</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-accent to-theme-digital-green bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From solo entrepreneurs to enterprise teams, we have the right
            solution for you. Start free and scale as you grow.
          </p>

         
        </motion.div>
      </div>
    </section>
  );
}