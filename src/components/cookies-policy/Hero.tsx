
"use client";
import { motion } from "motion/react";
import { Cookie } from "lucide-react";
import { bodyTextClass, metaTextClass } from "./typography";

export function Hero() {
    return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-theme-devil-green via-black to-black overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-2">
            <Cookie className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-5xl font-bold text-white">Cookie Policy</h1>
          <p className={`${bodyTextClass} max-w-2xl mx-auto`}>
            This policy explains how SamCard uses cookies and similar
            technologies to recognize you when you visit our website and use our
            services.
          </p>
          <p className={metaTextClass}>Last Updated: March 9, 2026</p>
        </motion.div>
      </div>
    </section>
  );
}