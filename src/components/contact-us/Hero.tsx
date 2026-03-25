"use client";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export function ContactHero() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-theme-devil-green via-black to-black overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-theme-kelly-green/10 mb-2 ring-1 ring-theme-kelly-green/20">
            <MessageSquare className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Get in <span className="text-accent">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about SamCard? We&apos;d love to hear from you. Send us
            a message and we&apos;ll respond as soon as possible.
          </p>
        </motion.div>
      </div>
    </section>
  );
}