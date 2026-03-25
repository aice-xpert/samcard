import { MapPin } from "lucide-react";

export function ContactMap() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Find Us</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Visit our headquarters in the heart of San Francisco
          </p>
        </div>

        <div className="relative h-[400px] bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-theme-kelly-green/30 transition-colors">
          {/* Subtle green glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-theme-devil-green/5 to-transparent pointer-events-none" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-theme-kelly-green/20 rounded-full blur-xl scale-150" />
                <MapPin className="relative w-16 h-16 text-accent mx-auto" />
              </div>
              <div>
                <p className="text-white font-semibold mb-2">SamCard Headquarters</p>
                <p className="text-gray-400 text-sm">
                  123 Business Street, Suite 100<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-theme-strong-green text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-theme-digital-green/30 hover:scale-105 transition-all"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}