"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="pt-32 pb-20 bg-gradient-to-b from-theme-devil-green via-black to-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your Business Card,
                <span className="block text-accent">Reimagined</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Create stunning digital business cards with custom QR codes.
                Share your contact info instantly, track engagement, and make
                lasting impressions — all from your smartphone.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-primary to-theme-strong-green text-white rounded-xl
                           hover:shadow-2xl hover:shadow-theme-digital-green/30 hover:scale-105
                           transition-all flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>

              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl
                           hover:border-accent hover:bg-white/20 transition-all text-center"
              >
                View Dashboard Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6">
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">1M+</div>
                <div className="text-sm text-gray-400">Cards Shared</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </motion.div>

          
<motion.div
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
  className="relative"
>
  <Image
    src="/images/hero2.png"
    alt="Digital business cards"
    width={800}
    height={600}
    className="w-full mix-blend-screen opacity-95 [mask-image:radial-gradient(ellipse_70%_70%_at_center,white,transparent)]"
    priority
  />

  {/* Glow effects */}
  <div className="absolute -top-8 -right-8 w-64 h-64 bg-gradient-to-br from-theme-kelly-green/30 to-theme-digital-green/30 rounded-full blur-3xl -z-10" />
  <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gradient-to-br from-theme-devil-green/50 to-theme-digital-green/20 rounded-full blur-3xl -z-10" />
</motion.div>
        </div>
      </div>
    </section>
  );
}
