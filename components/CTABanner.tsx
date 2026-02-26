import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { CTA_TRUST_BADGES } from "@/constant";

export function CTABanner() {
  return (
    <section
      id="cta"
      className="py-24 bg-gradient-to-b from-[#006312] to-black border-white/5"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#006312] backdrop-blur-sm rounded-full flex items-center justify-center border border-[#49B618]/30">
              <Sparkles className="text-[#49B618]" size={40} />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Transform Your Networking?
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Join 50,000+ professionals who are already networking smarter with
              DigiCard. Create your first digital business card in under 2
              minutes.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#"
              className="group px-10 py-5 bg-gradient-to-r from-[#008001] to-[#009200] text-white rounded-xl hover:shadow-2xl hover:shadow-[#49B618]/20 hover:scale-105 transition-all flex items-center gap-3 text-lg font-semibold"
            >
              Start Free Trial
              <ArrowRight
                size={20}
              />
            </Link>
            <Link
              href="/#"
              className="px-10 py-5 bg-white/5 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/10 hover:border-[#49B618]/50 transition-all text-lg font-semibold"
            >
              View Dashboard Demo
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-white">
            {CTA_TRUST_BADGES.map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
