"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useTheme } from "@/contexts/ThemeContext";
import { cardTemplates, type CardTemplate } from "@/data/cardTemplates";
import TemplateThumb from "@/components/TemplatePicker/TemplateThumb";

const VIEWPORT = { once: true };

export function Templates() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { isDark } = useTheme();
  const [previewTemplate, setPreviewTemplate] = useState<CardTemplate | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeIsDark = mounted ? isDark : true;

  return (
    <section
      id="templates"
      className={`py-24 ${
        themeIsDark
          ? "bg-gradient-to-b from-[#031203] to-background"
          : "bg-gradient-to-b from-[#e8f3e8] to-background"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Beautiful Templates for Every Style
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our professionally designed templates and customize them
            to perfectly match your brand.
          </p>
        </motion.div>

        <div className="relative pb-12 px-12">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 flex items-center justify-center rounded-full
                       border transition-all backdrop-blur-sm ${
              themeIsDark
                ? "bg-white/10 border-white/20 text-white hover:bg-theme-digital-green hover:border-theme-digital-green"
                : "bg-white border-gray-300 text-foreground hover:bg-theme-digital-green hover:border-theme-digital-green hover:text-white"
            }`}
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10
                       w-10 h-10 flex items-center justify-center rounded-full
                       border transition-all backdrop-blur-sm ${
              themeIsDark
                ? "bg-white/10 border-white/20 text-white hover:bg-theme-digital-green hover:border-theme-digital-green"
                : "bg-white border-gray-300 text-foreground hover:bg-theme-digital-green hover:border-theme-digital-green hover:text-white"
            }`}
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className="!pb-10"
          >
            {cardTemplates.map((template, index) => (
              <SwiperSlide key={template.id} className="!h-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="group h-full"
                >
                  <div
                    className={`h-full flex flex-col backdrop-blur-sm border rounded-2xl
                                  hover:shadow-2xl hover:shadow-theme-digital-green/10
                                  hover:border-theme-digital-green/50 transition-all overflow-hidden ${
                        themeIsDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-gray-200 shadow-sm"
                    }`}
                  >
                    {/* Real mini-card preview rendered from the template data */}
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

                    <div className="p-6 space-y-2 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {template.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(template)}
                        className={`mt-4 w-full py-2 rounded-lg transition-all ${
                          themeIsDark
                            ? "bg-white/5 text-white border border-white/10 hover:bg-theme-digital-green hover:border-theme-digital-green"
                            : "bg-gray-100 text-foreground border border-gray-200 hover:bg-theme-digital-green hover:border-theme-digital-green hover:text-white"
                        }`}
                      >
                        Preview Template
                      </button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          className="text-center mt-12"
        >
          <Link
            href="/templates"
            className="inline-block px-8 py-4 bg-gradient-to-r from-theme-digital-green to-theme-devil-green
                             text-white rounded-xl hover:shadow-xl hover:shadow-theme-digital-green/20
                             hover:scale-105 transition-all"
          >
            Browse All Templates
          </Link>
        </motion.div>
      </div>

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
                themeIsDark
                  ? "bg-[#0a140a] border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                aria-label="Close preview"
                className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                    themeIsDark
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
    </section>
  );
}
