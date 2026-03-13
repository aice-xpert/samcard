"use client";

export function PrivacyNav() {
  const links = [
    { href: "information-collection", label: "Information We Collect" },
    { href: "how-we-use", label: "How We Use Data" },
    { href: "data-sharing", label: "Data Sharing" },
    { href: "your-rights", label: "Your Rights" },
    { href: "security", label: "Security" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    const navOffset = 100; // height of sticky nav

    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
   <section className="py-4 bg-neutral-950 border-y border-white/10">
      <div className="max-w-4xl mx-auto">
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm">
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => scrollToSection(link.href)}
                className="text-gray-400 hover:text-theme-kelly-green transition-colors duration-200"
              >
                {link.label}
              </button>

              {i < links.length - 1 && (
                <span className="text-gray-600">•</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}