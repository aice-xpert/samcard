"use client";
import { Target, Heart, Zap, Shield } from "lucide-react";

export const values = [
  {
    icon: Target,
    title: "Innovation First",
    description:
      "We continuously build smarter networking tools that help professionals connect instantly and grow their opportunities.",
  },
  {
    icon: Heart,
    title: "User Focused",
    description:
      "Everything we create is designed to provide the best possible experience for professionals worldwide.",
  },
  {
    icon: Zap,
    title: "Speed & Simplicity",
    description:
      "Networking should be effortless. SamCard allows you to share your identity instantly with one tap.",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description:
      "Your data belongs to you. We prioritize strong security and privacy protection in everything we build.",
  },
];


import { motion } from "framer-motion";
import Image from "next/image";
import {
  Globe,
  CheckCircle2,
} from "lucide-react";


export function StoryMissionValues() {
  return (
    <>
      {/* Story Section */}

      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Story Text */}

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >

              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Our Story
              </h2>

              <div className="space-y-4 text-gray-300 leading-relaxed">

                <p>
                  SamCard was created with a simple goal — to eliminate the
                  limitations of traditional business cards. Professionals
                  needed a faster and smarter way to connect in a digital world.
                </p>

                <p>
                  What started as a small idea quickly evolved into a powerful
                  networking platform used by thousands of professionals
                  globally. SamCard makes it possible to share your identity
                  instantly using QR codes, NFC, or links.
                </p>

                <p>
                  Today SamCard helps professionals build stronger connections,
                  grow their networks, and leave lasting impressions anywhere
                  in the world.
                </p>

              </div>

              {/* Achievements */}

              <div className="mt-8 flex flex-wrap gap-4">

                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  <CheckCircle2 className="text-theme-devil-green" size={20} />
                  <span className="text-white">Founded in 2024</span>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  <CheckCircle2 className="text-theme-devil-green" size={20} />
                  <span className="text-white">Global Users</span>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  <CheckCircle2 className="text-theme-devil-green" size={20} />
                  <span className="text-white">Growing Team</span>
                </div>

              </div>

            </motion.div>

            {/* Story Image */}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >

              <Image
                src="/images/story.png"
                alt="SamCard team collaboration"
                width={700}
                height={500}
                className="rounded-2xl"
              />

              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-theme-devil-green/20 blur-3xl rounded-full" />

            </motion.div>

          </div>

        </div>
      </section>

      {/* Mission & Vision */}

      <section className="py-24 bg-black">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-2 gap-8">

            {/* Mission */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-white/5 rounded-2xl border border-white/10"
            >

              <div className="w-14 h-14 bg-theme-devil-green/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-theme-devil-green" size={28} />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h3>

              <p className="text-gray-300 leading-relaxed">
                Our mission is to simplify professional networking through
                powerful digital tools that allow people to share their
                identity instantly and create meaningful connections.
              </p>

            </motion.div>

            {/* Vision */}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="p-10 bg-white/5 rounded-2xl border border-white/10"
            >

              <div className="w-14 h-14 bg-theme-devil-green/10 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-theme-devil-green" size={28} />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Our Vision
              </h3>

              <p className="text-gray-300 leading-relaxed">
                We envision a future where professionals can connect globally
                without barriers using modern digital identity solutions like
                SamCard.
              </p>

            </motion.div>

          </div>

        </div>

      </section>

      {/* Values */}

      <section className="py-24 bg-black">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Core Values
            </h2>

            <p className="text-gray-400 text-lg">
              The principles that guide everything we build
            </p>

          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">

            {values.map((value, index) => {

              const Icon = value.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-10 bg-white/5 rounded-2xl border border-white/10 hover:border-theme-devil-green/40 transition"
                >

                  <div className="w-14 h-14 bg-theme-devil-green/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-theme-devil-green" size={28} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {value.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed">
                    {value.description}
                  </p>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>
    </>
  );
}