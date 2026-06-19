"use client";

import {
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function Footer() {
  const { isDark } = useTheme();

  const footerBg = isDark ? "bg-black border-white/5" : "bg-white border-transparent";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const bodyColor = isDark ? "text-[#808080]" : "text-gray-500";
  const iconBg = isDark ? "bg-white/5 text-white" : "bg-gray-100 text-gray-600";
  const bottomBorder = isDark ? "border-white/5" : "border-gray-100";

  return (
    <footer className={`${footerBg} ${isDark ? "border-t" : ""} py-16`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Upper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* SamCard */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Image
                className="rounded-lg"
                src="/logo.png"
                alt="SamCard logo"
                width={40}
                height={40}
                sizes="40px"
              />
              <h3 className={`text-xl font-bold ${headingColor}`}>SamCard</h3>
            </div>

            <p className={bodyColor}>
              The modern way to share your professional identity. Create, share,
              and track your digital business cards.
            </p>

            <div className="flex justify-center sm:justify-start gap-4">
              <a className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center hover:bg-[#49B618] hover:text-white transition-colors`}>
                <Linkedin size={20} />
              </a>
              <a className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center hover:bg-[#49B618] hover:text-white transition-colors`}>
                <Twitter size={20} />
              </a>
              <a className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center hover:bg-[#49B618] hover:text-white transition-colors`}>
                <Instagram size={20} />
              </a>
              <a className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center hover:bg-[#49B618] hover:text-white transition-colors`}>
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className={`text-xl font-bold ${headingColor}`}>Product</h3>
            <ul className={`${bodyColor} space-y-4`}>
              <li>
                <a className="hover:text-[#49B618] transition-colors" href="/features">Features</a>
              </li>
              <li>
                <a className="hover:text-[#49B618] transition-colors" href="/solutions">Solutions</a>
              </li>
              <li>
                <a className="hover:text-[#49B618] transition-colors" href="/pricing">Pricing</a>
              </li>
              <li>
                <a className="hover:text-[#49B618] transition-colors" href="/testimonials">Testimonials</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className={`text-xl font-bold ${headingColor}`}>Company</h3>
            <ul className={`${bodyColor} space-y-4`}>
              <li>
                <a className="hover:text-[#49B618] transition-colors" href="/about-us">About Us</a>
              </li>
              <li>
                <a className="hover:text-[#49B618] transition-colors" href="#">Careers</a>
              </li>
              <li>
                <Link className="hover:text-[#49B618] transition-colors" href="/blog">Blog</Link>
              </li>
              <li>
                <a className="hover:text-[#49B618] transition-colors" href="/contact-us">Contact</a>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className={`text-xl font-bold ${headingColor}`}>Get in Touch</h3>
            <ul className={`space-y-3 ${bodyColor}`}>
              <li className="flex justify-center sm:justify-start gap-3">
                <Mail size={20} />
                <a className="hover:text-[#49B618] transition-colors" href="mailto:hello@SamCard.com">
                  hello@SamCard.com
                </a>
              </li>
              <li className="flex justify-center sm:justify-start gap-3">
                <Phone size={20} />
                <a className="hover:text-[#49B618] transition-colors" href="tel:+1234567890">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower */}
        <div className={`pt-8 border-t ${bottomBorder} flex flex-col md:flex-row items-center justify-between gap-4 ${bodyColor} text-center md:text-left`}>
          <div>© 2026 SamCard. All rights reserved</div>

          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <a className="hover:text-[#49B618] transition-colors" href="/privacy-policy">Privacy Policy</a>
            <a className="hover:text-[#49B618] transition-colors" href="/terms-and-services">Terms of Service</a>
            <a className="hover:text-[#49B618] transition-colors" href="/cookies-policy">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
