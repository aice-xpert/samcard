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
      <div className="px-8 m-11">
        {/* Upper  */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* DigiCard */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                className="w-10 h-10 rounded-lg"
                src="/Digicard.png"
                alt="DigiCard logo"
                width={40}
                height={40}
              />
              <h3 className="text-xl font-bold">DigiCard</h3>
            </div>
            <p className="text-[#808080]">
              The modern way to share your professional identity. Create, share,
              and track your digital business cards.
            </p>
            <div className="flex gap-4">
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
          <div>
            <h1 className="text-xl font-bold mb-4">Product</h1>
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
          <div>
            <h1 className="text-xl font-bold mb-4">Company</h1>
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
          {/* Get In Touch */}
          <div>
            <h1 className="text-xl font-bold mb-4">Get in Touch</h1>
            <ul className="space-y-3 text-[#808080]">
              <li className="flex gap-3 ">
                <Mail size={20} />
                <a
                  className="hover:text-[#4FD1C5]"
                  href="mailto:hello@digicard.com"
                >
                  hello@digicard.com
                </a>
              </li>
              <li className="flex gap-3 ">
                <Phone size={20} />
                <a className="hover:text-[#4FD1C5]" href="tel:+1234567890">
                  +1 (234) 567-890{" "}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Lower */}
        <div className="pt-8 border-t border-white/5 flex justify-between items-center gap-4 text-[#808080]">
          <div>© 2026 DigiCard. All rights reserved</div>
          <div className="flex gap-6">
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
