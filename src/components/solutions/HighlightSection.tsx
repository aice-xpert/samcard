"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BarChart3, Upload, Zap, Shield } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track scans, locations, devices, and user behavior in real-time with comprehensive dashboards.",
  },
  {
    icon: Upload,
    title: "Bulk Upload Tools",
    description:
      "Create thousands of QR codes at once with CSV import and template management.",
  },
  {
    icon: Zap,
    title: "Dynamic QR Codes",
    description:
      "Update content anytime without reprinting. Perfect for evolving campaigns.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Password protection, expiry dates, and access controls for sensitive content.",
  },
];

export function HighlightSection() {
  const { isDark } = useTheme();
  return (
<section className={`py-20 relative overflow-hidden ${
  isDark
    ? "bg-gradient-to-b from-black to-[#031103]"
    : "bg-gradient-to-b from-white via-[#f0f8f0] to-[#e8f3e8]"
}`}>

  <div className={`absolute top-0 left-0 right-0 h-[2px] z-20 pointer-events-none ${
    isDark ? "bg-black" : "bg-gray-200"
  }`} />

  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <div className="absolute top-32 left-1/4 w-96 h-96 rounded-full blur-3xl bg-theme-digital-green/30" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl bg-theme-devil-green/40" />
  </div>

      <div className="relative max-w-7xl mx-auto px-6">
  
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features for{" "}
            <span className="text-theme-digital-green">
              Better QR Campaigns
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, manage, and optimize your QR code
            campaigns at scale
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className={`rounded-xl p-6 h-full transition-all ${
                isDark
                  ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                  : "bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
              }`}>
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 bg-theme-digital-green/20">
                  <feature.icon className="w-7 h-7 text-theme-digital-green" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/features">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-primary to-theme-strong-green
                         hover:shadow-2xl hover:shadow-theme-digital-green/30 transition-all"
            >
              Explore All Features
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}