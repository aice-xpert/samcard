"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 5; // 5 days in seconds

// ── helpers ───────────────────────────────────────────────────────────────────

function persistSession(token: string) {
  localStorage.setItem("sessionToken", token);
  document.cookie = `session=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * When the backend redirects back after OAuth it appends `#token=<jwt>` to the
 * URL so the frontend can grab it before the fragment is stripped by the browser.
 */
function consumeHashToken() {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  const match = hash.match(/[#&]token=([^&]+)/);
  if (match) {
    persistSession(decodeURIComponent(match[1]));
    // Clean the fragment so it doesn't leak in copy-paste or history
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.location.href = "/dashboard";
  }
}

// ── component ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick up token from OAuth redirect hash on mount
  useEffect(() => { consumeHashToken(); }, []);

  // ── email / password login ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.sessionToken) persistSession(data.sessionToken);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ── OAuth — just redirect to the backend OAuth entry-point ─────────────────
  const handleSocialSignIn = (provider: "google" | "github") => {
    if (!API_BASE) {
      setError("Missing NEXT_PUBLIC_BACKEND_URL");
      return;
    }
    // The backend will handle the full OAuth dance and redirect back here
    window.location.href = `${API_BASE}/api/auth/oauth/${provider}`;
  };

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-b from-theme-devil-green via-black to-black
        pt-24 pb-5
        flex items-center justify-center px-4
        overflow-hidden relative
      "
    >
      {/* Glow Effects */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-theme-kelly-green/30 to-theme-digital-green/20 blur-3xl rounded-full -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-theme-devil-green/40 to-theme-digital-green/20 blur-3xl rounded-full -z-10" />

      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="
            bg-white/5 backdrop-blur-lg rounded-2xl p-8
            border border-white/10 shadow-2xl shadow-theme-digital-green/10
          "
        >
          {/* Error Banner */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="
                    w-full pl-11 pr-4 py-3
                    bg-white/5 border border-white/10 rounded-xl
                    text-white placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                    transition-all
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="
                    w-full pl-11 pr-12 py-3
                    bg-white/5 border border-white/10 rounded-xl
                    text-white placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-accent
                    transition-all
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent focus:ring-accent"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-accent hover:text-theme-digital-green transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3
                bg-gradient-to-r from-primary to-theme-strong-green
                text-white rounded-xl
                hover:scale-105 hover:shadow-2xl hover:shadow-theme-digital-green/30
                transition-all flex items-center justify-center gap-2 group
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
              "
            >
              {loading ? "Signing in…" : "Sign In"}
              {!loading && (
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-400 bg-transparent">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialSignIn("google")}
              disabled={loading}
              className="py-3 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcGoogle size={20} />
              <span className="text-white text-sm">Google</span>
            </button>

            <button
              onClick={() => handleSocialSignIn("github")}
              disabled={loading}
              className="py-3 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGithub size={20} className="text-white" />
              <span className="text-white text-sm">GitHub</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:text-theme-digital-green transition-colors">
              Sign up for free
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}