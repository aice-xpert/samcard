"use client";
import { QrCode, Share2, Layout } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const features = [
  {
    icon: QrCode,
    title: "Custom QR Codes",
    description:
      "Generate beautiful, branded QR codes that link directly to your digital business card. Fully customizable with your colors and logo.",
  },
  {
    icon: Share2,
    title: "Contactless Sharing",
    description:
      "Share your card instantly via NFC, QR code, text, email, or social media. No app download required for recipients.",
  },
  {
    icon: Layout,
    title: "Professional Templates",
    description:
      "Choose from dozens of stunning templates designed by professionals. Fully customizable to match your brand.",
  },
];

export function Features() {
  const { isDark } = useTheme();

  return (
    <section
      id="features"
      className={`py-24 ${
        isDark
          ? "bg-gradient-to-b from-black via-[#020f02] to-[#031203]"
          : "bg-gradient-to-b from-white via-[#f0f8f0] to-[#e8f3e8]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Everything You Need to Network Smarter
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you make meaningful connections
            and grow your professional network.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group backdrop-blur-sm rounded-2xl p-8 border transition-all ${
                isDark
                  ? "bg-white/5 border-white/10 hover:border-theme-digital-green/50"
                  : "bg-white border-gray-200 hover:border-theme-digital-green/50 shadow-sm"
              }`}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-theme-digital-green to-theme-devil-green
                              rounded-xl flex items-center justify-center mb-6
                              group-hover:scale-110 transition-transform">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Highlight Banner */}
        <div
          className={`mt-20 rounded-3xl p-12 text-center backdrop-blur-sm ${
            isDark
              ? "bg-gradient-to-br from-theme-digital-green/10 to-theme-devil-green/5 border border-theme-digital-green/20 text-white"
              : "bg-gradient-to-br from-theme-digital-green/10 to-theme-devil-green/5 border border-theme-digital-green/20 text-foreground"
          }`}
        >
          <h3 className="text-3xl font-bold mb-4">
            All Features Work Seamlessly Together
          </h3>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            isDark ? "text-gray-300" : "text-muted-foreground"
          }`}>
            Our integrated platform ensures that every feature works in harmony,
            giving you the best digital business card experience possible.
          </p>
          <button
            className="px-8 py-4 bg-gradient-to-r from-theme-digital-green to-theme-devil-green
                       text-white rounded-xl hover:shadow-xl hover:shadow-theme-digital-green/20
                       hover:scale-105 transition-all"
          >
            Explore All Features
          </button>
        </div>

      </div>
    </section>
  );
} 
