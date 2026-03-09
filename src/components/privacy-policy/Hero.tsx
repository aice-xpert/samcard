import { Shield } from 'lucide-react';

export function Hero() {
  return (
   <section
      id="hero"
      className="pt-32 pb-20 bg-gradient-to-b from-theme-devil-green via-black to-black overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,180,0,0.15) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{
            background: 'rgba(0, 180, 0, 0.1)',
            border: '1px solid rgba(0, 180, 0, 0.3)',
          }}
        >
          <Shield className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
          Privacy Policy
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-gray-300">
          Your privacy is important to us. This policy explains how SamCard collects, uses, and
          protects your personal information.
        </p>
        <p className="text-sm mt-4 text-gray-500">
          Last Updated: March 9, 2026
        </p>
      </div>
    </section>
  );
}