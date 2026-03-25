"use client";
import { motion } from "motion/react";
import { Cookie } from "lucide-react";
import { bodyTextClass, sectionTitleClass } from "./typography";

export function CookiePolicyIntro() {
  return (
    <section className="pt-24 pb-12 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert max-w-none"
        >
          <p className={bodyTextClass}>
            SamCard uses cookies and similar tracking technologies to improve your
            experience on our platform, analyze usage patterns, and deliver
            personalized content. This Cookie Policy explains what cookies are,
            how we use them, and how you can control them.
          </p>
        </motion.div>

        <motion.div
          id="what-are-cookies"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-4"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Cookie className="w-6 h-6 text-accent" />
          </div>

          <div className="flex-1 space-y-4">
            <h2 className={sectionTitleClass}>What Are Cookies?</h2>

            <div className={`space-y-4 ${bodyTextClass}`}>
              <p>
                Cookies are small text files placed on your device when you visit
                a website. They help websites work efficiently and provide
                information to website owners.
              </p>

              <div className="space-y-2">
                <p className="font-medium text-white">Duration:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-accent mt-1">›</span>
                    <span>
                      <strong className="text-white">Persistent cookies:</strong>{" "}
                      Remain on your device for a set period or until you delete
                      them
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent mt-1">›</span>
                    <span>
                      <strong className="text-white">Session cookies:</strong>{" "}
                      Temporary — deleted when you close your browser
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-white">Origin:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-accent mt-1">›</span>
                    <span>
                      <strong className="text-white">First-party cookies:</strong>{" "}
                      Set by the website you&apos;re visiting
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent mt-1">›</span>
                    <span>
                      <strong className="text-white">Third-party cookies:</strong>{" "}
                      Set by a domain other than the one you&apos;re visiting
                    </span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}