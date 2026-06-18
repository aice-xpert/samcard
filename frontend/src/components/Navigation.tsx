"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const navLink = isDark
    ? "font-sans font-medium tracking-wide text-gray-300 hover:text-accent transition-colors duration-200 cursor-pointer"
    : "font-sans font-medium tracking-wide text-gray-900 hover:text-theme-digital-green transition-colors duration-200 cursor-pointer";

  return (
        <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || isMobileMenuOpen
          ? "bg-gradient-to-b from-theme-devil-green/80 via-theme-devil-green/60 to-transparent backdrop-blur-md border-theme-devil-green/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Row */}
        <div className="flex items-center justify-between h-20 min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/logo.png"
              alt="SamCard"
              width={40}
              height={40}
              sizes="40px"
              className="rounded-lg"
            />
            <span className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>SamCard</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className={navLink}>
              Features
            </Link>
            <Link href="/solutions" className={navLink}>
              Solutions
            </Link>
            <Link href="/pricing" className={navLink}>
              Pricing
            </Link>
            <Link href="/testimonials" className={navLink}>
              Testimonials
            </Link>
            <Link href="/login" className={navLink}>
              Login
            </Link>
           
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-theme-digital-green text-white rounded-lg
                         hover:bg-theme-strong-green hover:shadow-lg hover:shadow-theme-digital-green/30
                         transition-all duration-300"
            >
              Sign Up
            </Link>
             <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`p-2 rounded-lg transition-all duration-200 ${isDark ? "text-gray-300 hover:text-accent hover:bg-white/10" : "text-gray-700 hover:text-theme-digital-green hover:bg-black/5"}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition ${isDark ? "text-white hover:bg-theme-strong-green/40" : "text-gray-900 hover:bg-black/10"}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-theme-devil-green/30">
            <div className="flex flex-col gap-4 px-4">
              <Link href="/features" className={`${navLink} text-left`} onClick={() => setIsMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="/solutions" className={`${navLink} text-left`} onClick={() => setIsMobileMenuOpen(false)}>
                Solutions
              </Link>
              <Link
                href="/pricing"
                className={`${navLink} text-left`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link href="/testimonials" className={`${navLink} text-left`} onClick={() => setIsMobileMenuOpen(false)}>
                Testimonials
              </Link>
              <Link href="/login" className={`${navLink} text-left`} onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 text-left font-sans font-medium tracking-wide transition-colors duration-200 ${isDark ? "text-gray-300 hover:text-accent" : "text-gray-900 hover:text-theme-digital-green"}`}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
              <Link
                href="/signup"
                className="mt-2 px-6 py-3 bg-theme-digital-green text-white rounded-lg
                           hover:bg-theme-strong-green transition-all text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
