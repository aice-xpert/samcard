"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 5;

// ── helpers ───────────────────────────────────────────────────────────────────

function persistSession(token: string) {
  localStorage.setItem("sessionToken", token);
  document.cookie = `session=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** Grab JWT dropped into the URL hash after a backend OAuth redirect. */
function consumeHashToken() {
  if (typeof window === "undefined") return;
  const match = window.location.hash.match(/[#&]token=([^&]+)/);
  if (match) {
    persistSession(decodeURIComponent(match[1]));
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.location.href = "/dashboard";
  }
}

// ── component ─────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });
  const { isDark } = useTheme();

  useEffect(() => { consumeHashToken(); }, []);

  const updateField = (field: keyof typeof formData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ── email / password signup ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");

      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Signup failed");

      // Persist session token and redirect to dashboard
      if (data.sessionToken) {
        persistSession(data.sessionToken);
      }
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // ── OAuth — redirect to backend ────────────────────────────────────────────
  const handleSocialSignIn = (provider: "google" | "github") => {
    if (!API_BASE) {
      setError("Missing NEXT_PUBLIC_BACKEND_URL");
      return;
    }
    window.location.href = `${API_BASE}/api/auth/oauth/${provider}`;
  };

  const pageBg = isDark
    ? "bg-gradient-to-b from-theme-devil-green via-black to-black"
    : "bg-gradient-to-b from-theme-devil-green/35 via-theme-kelly-green/10 to-white";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-lg border-white/10"
    : "bg-white border-gray-200 shadow-2xl shadow-theme-digital-green/10";

  const headingColor = isDark ? "text-white" : "text-gray-900";
  const subtitleColor = isDark ? "text-gray-400" : "text-gray-500";
  const labelColor = isDark ? "text-white" : "text-gray-700";
  const iconColor = isDark ? "text-gray-400" : "text-gray-400";

  const inputClass = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-theme-digital-green"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-theme-digital-green";

  const socialBtnClass = isDark
    ? "bg-white/5 border-white/10 hover:bg-white/10"
    : "bg-gray-50 border-gray-200 hover:bg-gray-100";

  const socialTextColor = isDark ? "text-white" : "text-gray-700";
  const dividerBorderColor = isDark ? "border-white/10" : "border-gray-200";
  const dividerTextBg = isDark ? "" : "bg-white";
  const footerTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const backLinkColor = isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800";

  return (
    <div className={`min-h-screen ${pageBg} flex justify-center px-4 pt-32 pb-5 overflow-hidden relative`}>
      {/* Glow Effects */}
      <div className={`absolute -top-20 -right-20 w-96 h-96 blur-3xl rounded-full -z-10 ${isDark ? "bg-gradient-to-br from-theme-kelly-green/30 to-theme-digital-green/20" : "bg-gradient-to-br from-theme-kelly-green/45 to-theme-digital-green/30"}`} />
      <div className={`absolute top-10 -left-20 w-72 h-72 blur-3xl rounded-full -z-10 ${isDark ? "bg-gradient-to-br from-theme-devil-green/40 to-theme-digital-green/20" : "bg-gradient-to-br from-theme-devil-green/25 to-theme-digital-green/10"}`} />
      <div className={`absolute top-1/3 left-1/3 w-64 h-64 blur-3xl rounded-full -z-10 ${isDark ? "bg-theme-digital-green/5" : "bg-theme-digital-green/10"}`} />

      <div className="w-full max-w-md">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className={`text-3xl font-bold ${headingColor} mb-2`}>Create Your Account</h1>
          <p className={subtitleColor}>Start creating digital business cards today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl p-8 border ${cardBg}`}
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Social buttons at the top for signup — common UX pattern */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={isLoading}
              className={`py-3 flex items-center justify-center gap-2 border rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${socialBtnClass}`}
            >
              <FcGoogle size={20} />
              <span className={`text-sm ${socialTextColor}`}>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={isLoading}
              className={`py-3 flex items-center justify-center gap-2 border rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${socialBtnClass}`}
            >
              <FaGithub size={20} className={socialTextColor} />
              <span className={`text-sm ${socialTextColor}`}>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${dividerBorderColor}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${subtitleColor} ${dividerTextBg}`}>Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Full Name"
              id="name"
              icon={<User size={20} />}
              value={formData.name}
              onChange={(v) => updateField("name", v)}
              placeholder="John Doe"
              required
              isDark={isDark}
              labelColor={labelColor}
              iconColor={iconColor}
              inputClass={inputClass}
            />

            <InputField
              label="Email Address"
              id="email"
              type="email"
              icon={<Mail size={20} />}
              value={formData.email}
              onChange={(v) => updateField("email", v)}
              placeholder="you@example.com"
              required
              isDark={isDark}
              labelColor={labelColor}
              iconColor={iconColor}
              inputClass={inputClass}
            />

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium ${labelColor} mb-2`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputClass}`}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor} ${isDark ? "hover:text-white" : "hover:text-gray-700"} transition-colors`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Must be at least 8 characters</p>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => updateField("terms", e.target.checked)}
                className={`mt-1 w-4 h-4 rounded ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-300"} text-theme-digital-green focus:ring-theme-digital-green`}
                required
              />
              <span className={`text-sm ${footerTextColor}`}>
                I agree to the{" "}
                <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary to-theme-strong-green text-white rounded-xl
              hover:shadow-2xl hover:shadow-theme-digital-green/30 hover:scale-105
              disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed
              transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                "Creating account…"
              ) : (
                <>
                  Create Account
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm ${footerTextColor}`}>
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">Log in</Link>
          </p>
        </motion.div>

        <div className="mt-6 text-center">
          <Link href="/" className={`text-sm ${backLinkColor} transition-colors`}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}

// ── Reusable InputField ───────────────────────────────────────────────────────

function InputField({
  label, id, icon, value, onChange, placeholder, type = "text", required = false,
  isDark, labelColor, iconColor, inputClass,
}: {
  label: string;
  id: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  isDark: boolean;
  labelColor: string;
  iconColor: string;
  inputClass: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={`block text-sm font-medium ${labelColor} mb-2`}>
        {label}
      </label>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`}>{icon}</div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputClass}`}
        />
      </div>
    </div>
  );
}
