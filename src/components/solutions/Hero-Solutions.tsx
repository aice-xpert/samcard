"use client";

import { motion } from "motion/react";


export function Hero() {
  const scrollToSolutions = () => {
    const solutionsSection = document.getElementById("solutions");
    if (solutionsSection) {
      solutionsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-52 pb-32 overflow-hidden bg-gradient-to-b from-theme-devil-green via-black to-black">

      <div className="absolute inset-0 bg-gradient-to-b from-theme-devil-green/20 via-black to-black" />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
    
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            QR Code Solutions
          </h1>

   
          <div className="mb-10 space-y-4">
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Rated best QR Code solution provider by world&aposs top brands, we are
              a one stop solution for all your QR Code marketing and business needs.
            </p>
          </div>

       
          <motion.button
            onClick={scrollToSolutions}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-primary to-theme-strong-green text-white rounded-lg font-semibold
                       hover:shadow-2xl hover:shadow-theme-digital-green/30 hover:scale-105
                       transition-all"
          >
            Explore Solutions
          </motion.button>
        </motion.div>
      </div>

    
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-theme-digital-green/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-theme-devil-green/20 rounded-full blur-3xl" />
    </section>
  );
}