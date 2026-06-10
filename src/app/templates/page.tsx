"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { cardTemplates, type CardTemplate } from "@/data/cardTemplates";
import TemplateThumb from "@/components/TemplatePicker/TemplateThumb";

export default function TemplatesPage() {
  const { isDark } = useTheme();
  const [previewTemplate, setPreviewTemplate] = useState<CardTemplate | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section
        className={`pt-28 pb-16 px-4 sm:px-6 lg:px-8 ${
          isDark
            ? "bg-gradient-to-b from-[#031203] to-background"
            : "bg-gradient-to-b from-[#e8f3e8] to-background"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-theme-digital-green/10 text-accent border border-theme-digital-green/20">
            {cardTemplates.length} ready-made templates
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Browse All Templates
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Professionally designed digital business cards for every style.
            Pick one, customize it to match your brand, and share in minutes.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {cardTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
              whileHover={{ scale: 1.02 }}
              className="group h-full"
            >
              <div
                className={`h-full flex flex-col rounded-2xl border overflow-hidden transition-all
                  hover:shadow-2xl hover:shadow-theme-digital-green/10 hover:border-theme-digital-green/50 ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(template)}
                  aria-label={`Preview ${template.name} template`}
                  className="block w-full p-6 pb-0 cursor-pointer"
                >
                  <div className="mx-auto max-w-[180px]">
                    <TemplateThumb template={template} />
                  </div>
                </button>

                <div className="p-6 flex flex-col flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {template.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(template)}
                    className={`mt-4 w-full py-2 rounded-lg transition-all ${
                      isDark
                        ? "bg-white/5 text-white border border-white/10 hover:bg-theme-digital-green hover:border-theme-digital-green"
                        : "bg-gray-100 text-foreground border border-gray-200 hover:bg-theme-digital-green hover:border-theme-digital-green hover:text-white"
                    }`}
                  >
                    Preview Template
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-3xl mx-auto text-center mt-20 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Ready to make it yours?
          </h2>
          <p className="text-muted-foreground">
            Sign up free and apply any template to your card in one click.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-theme-digital-green to-theme-devil-green
                       text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-theme-digital-green/20
                       hover:scale-105 transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Preview modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewTemplate(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`${previewTemplate.name} preview`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md rounded-2xl border p-6 ${
                isDark ? "bg-[#0a140a] border-white/10" : "bg-white border-gray-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                aria-label="Close preview"
                className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  isDark
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mx-auto max-w-[220px]">
                <TemplateThumb template={previewTemplate} />
              </div>

              <div className="mt-6 text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  {previewTemplate.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {previewTemplate.description}
                </p>
              </div>

              <Link
                href="/signup"
                className="mt-6 block w-full text-center px-8 py-3 bg-gradient-to-r from-theme-digital-green to-theme-devil-green
                           text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-theme-digital-green/20
                           hover:scale-[1.02] transition-all"
              >
                Use This Template
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
