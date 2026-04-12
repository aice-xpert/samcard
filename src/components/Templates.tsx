"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

const templates = [
  {
    name: "Modern Minimalist",
    category: "Professional",
    color: "from-surface to-theme-blackout",
    accent: "bg-white",
  },
  {
    name: "Creative Bold",
    category: "Creative",
    color: "from-theme-digital-green to-theme-devil-green",
    accent: "bg-theme-blackout",
  },
  {
    name: "Tech Innovator",
    category: "Technology",
    color: "from-theme-strong-green to-theme-digital-green",
    accent: "bg-theme-kelly-green",
  },
  {
    name: "Executive Elite",
    category: "Corporate",
    color: "from-slate-800 to-theme-blackout",
    accent: "bg-theme-digital-green",
  },
  {
    name: "Nature Inspired",
    category: "Eco-Friendly",
    color: "from-theme-kelly-green to-theme-strong-green",
    accent: "bg-white",
  },
  {
    name: "Elegant Classic",
    category: "Traditional",
    color: "from-[#6B7280] to-[#1F2937]",
    accent: "bg-theme-digital-green",
  },
];

const VIEWPORT = { once: true };

export function Templates() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section
      id="templates"
      className="py-24 bg-gradient-to-b from-[#031203] to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Beautiful Templates for Every Style
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose from our professionally designed templates and customize them
            to perfectly match your brand.
          </p>
        </motion.div>

        <div className="relative pb-12 px-12">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 z-10
                       w-10 h-10 flex items-center justify-center rounded-full
                       bg-white/10 border border-white/20 text-white
                       hover:bg-theme-digital-green hover:border-theme-digital-green
                       transition-all backdrop-blur-sm"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 z-10
                       w-10 h-10 flex items-center justify-center rounded-full
                       bg-white/10 border border-white/20 text-white
                       hover:bg-theme-digital-green hover:border-theme-digital-green
                       transition-all backdrop-blur-sm"
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
            {templates.map((template, index) => (
              <SwiperSlide key={template.name}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="group cursor-pointer"
                >
                  <div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl
                                  hover:shadow-2xl hover:shadow-theme-digital-green/10
                                  hover:border-theme-digital-green/50 transition-all overflow-hidden"
                  >
                    <div
                      className={`h-64 bg-gradient-to-br ${template.color} p-8 relative`}
                    >
                      <div className="space-y-4">
                        <div
                          className={`w-16 h-16 ${template.accent} rounded-xl`}
                        />
                        <div className="space-y-2">
                          <div className="w-32 h-3 bg-white/90 rounded" />
                          <div className="w-24 h-2 bg-white/70 rounded" />
                        </div>
                        <div className="absolute bottom-8 right-8 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-lg" />
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full" />
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {template.category}
                      </p>
                      <button
                        className="mt-4 w-full py-2 bg-white/5 text-white border border-white/10
                                         rounded-lg hover:bg-theme-digital-green hover:border-theme-digital-green
                                         transition-all"
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
          <button
            className="px-8 py-4 bg-gradient-to-r from-theme-digital-green to-theme-devil-green
                             text-white rounded-xl hover:shadow-xl hover:shadow-theme-digital-green/20
                             hover:scale-105 transition-all"
          >
            Browse All Templates
          </button>
        </motion.div>
      </div>
    </section>
  );
}
