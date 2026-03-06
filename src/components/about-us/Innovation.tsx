"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Platform",
    description:
      "Built with strong security practices to keep your professional data protected.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Sharing",
    description:
      "Share your digital card instantly through QR code, NFC, or a simple link.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Used by professionals worldwide to connect and grow their networks digitally.",
  },
];

export function InnovationSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#031103]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Innovation at{" "}
            <span className="text-theme-devil-green">SamCard</span>
          </h2>

          <p className="text-gray-400 text-lg">
            We continuously explore modern technologies to make
            professional networking faster, smarter, and more impactful
            for professionals worldwide.
          </p>
        </div>

        {/* Feature Boxes */}
        <div className="grid md:grid-cols-3 gap-8">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-neutral-950 border border-white/10
                           hover:border-theme-devil-green/40 hover:shadow-lg
                           hover:shadow-theme-devil-green/10 transition-all"
              >

                <div className="w-12 h-12 mb-6 bg-theme-devil-green/10 rounded-xl flex items-center justify-center">
                  <Icon className="text-theme-devil-green" size={24} />
                </div>

                <h4 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h4>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}