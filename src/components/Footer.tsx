import {
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Upper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* SamCard */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Image
                className="w-10 h-10 rounded-lg"
                src="/SamCard.png"
                alt="SamCard logo"
                width={40}
                height={40}
              />
              <h3 className="text-xl font-bold">SamCard</h3>
            </div>

            <p className="text-[#808080]">
              The modern way to share your professional identity. Create, share,
              and track your digital business cards.
            </p>

            <div className="flex justify-center sm:justify-start gap-4">
              <a className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#4FD1C5] transition-colors">
                <Linkedin size={20} />
              </a>
              <a className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#4FD1C5] transition-colors">
                <Twitter size={20} />
              </a>
              <a className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#4FD1C5] transition-colors">
                <Instagram size={20} />
              </a>
              <a className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#4FD1C5] transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-xl font-bold">Product</h3>
            <ul className="text-[#808080] space-y-4">
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  Features
                </a>
              </li>
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  Solution
                </a>
              </li>
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  Pricing
                </a>
              </li>
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  Integration
                </a>
              </li>
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-xl font-bold">Company</h3>
            <ul className="text-[#808080] space-y-4">
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  Blog
                </a>
              </li>
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  Press Kit
                </a>
              </li>
              <li>
                <a className="hover:text-[#4FD1C5]" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-xl font-bold">Get in Touch</h3>
            <ul className="space-y-3 text-[#808080]">
              <li className="flex justify-center sm:justify-start gap-3">
                <Mail size={20} />
                <a
                  className="hover:text-[#4FD1C5]"
                  href="mailto:hello@SamCard.com"
                >
                  hello@SamCard.com
                </a>
              </li>

              <li className="flex justify-center sm:justify-start gap-3">
                <Phone size={20} />
                <a className="hover:text-[#4FD1C5]" href="tel:+1234567890">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[#808080] text-center md:text-left">
          <div>© 2026 SamCard. All rights reserved</div>

          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <a className="hover:text-[#4FD1C5]" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-[#4FD1C5]" href="#">
              Terms of Service
            </a>
            <a className="hover:text-[#4FD1C5]" href="#">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
