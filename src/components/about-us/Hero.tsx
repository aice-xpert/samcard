"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {

  ArrowRight

} from "lucide-react";



export function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-48 pb-0 bg-gradient-to-b from-theme-devil-green via-black to-black overflow-x-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-theme-devil-green/10 via-black to-black pointer-events-none" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-theme-devil-green/20 blur-3xl rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-theme-devil-green/20 blur-3xl rounded-full" />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto pb-16"
        >

        

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-10" >
            Connect Smarter with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-devil-green to-accent">
              SamCard
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Share your digital business card instantly using QR codes,
            NFC, or a simple link. SamCard makes networking smarter,
            faster, and completely paperless.
          </p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/signup"
              className="group px-10 py-5 bg-gradient-to-r from-[#008001] to-[#009200] text-white rounded-xl
              hover:shadow-2xl hover:shadow-[#49B618]/20 hover:scale-105
              transition-all flex items-center gap-3 text-lg font-semibold"
            >
              Get Started Free
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              href="/pricing"
              className="px-10 py-5 bg-white/5 backdrop-blur-sm text-white border border-white/20 rounded-xl
              hover:bg-white/10 hover:border-[#49B618]/50
              transition-all text-lg font-semibold"
            >
              View Pricing
            </Link>
          </motion.div>
        </motion.div>
      </div>

  

    </section>
  );
}