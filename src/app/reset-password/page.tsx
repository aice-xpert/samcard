"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Mail } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

function ResetPasswordForm() {
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  // Supabase recovery links use URL hash fragments: #type=recovery&code=XXX
  // We need to extract from both hash and query params for flexibility
  const codeFromParams = searchParams.get("code");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(codeFromParams);

  useEffect(() => {
    // Try to extract code from URL hash if not in query params
    if (!codeFromParams && typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const hashCode = params.get("code");
      if (hashCode) {
        setCode(hashCode);
      } else {
        setError("Invalid or missing recovery code. Please request a new reset link.");
      }
    }
  }, [codeFromParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.trim()) {
      setError("Email is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Send the recovery code, email, and new password to the backend
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email: email.trim(), newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      console.error("[reset-password]", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pageBg = isDark
    ? "bg-gradient-to-b from-theme-devil-green via-black to-black"
    : "bg-gradient-to-b from-theme-devil-green/35 via-theme-kelly-green/10 to-white";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-lg border-white/10 shadow-2xl shadow-theme-digital-green/10"
    : "bg-white border-gray-200 shadow-2xl shadow-theme-digital-green/10";

  const headingColor = isDark ? "text-white" : "text-gray-900";
  const subtitleColor = isDark ? "text-gray-400" : "text-gray-500";
  const labelColor = isDark ? "text-white" : "text-gray-700";
  const iconColor = isDark ? "text-gray-400" : "text-gray-400";

  const inputClass = isDark
    ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-accent"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-theme-digital-green";

  const backLinkColor = isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800";
  const footerTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const successTextColor = isDark ? "text-white" : "text-gray-900";
  const successSubtext = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${pageBg} pt-24 pb-5 flex items-center justify-center px-4 overflow-hidden relative`}>
      <div className={`absolute -top-20 -right-20 w-96 h-96 blur-3xl rounded-full -z-10 ${isDark ? "bg-gradient-to-br from-theme-kelly-green/30 to-theme-digital-green/20" : "bg-gradient-to-br from-theme-kelly-green/45 to-theme-digital-green/30"}`} />
      <div className={`absolute -bottom-20 -left-20 w-80 h-80 blur-3xl rounded-full -z-10 ${isDark ? "bg-gradient-to-br from-theme-devil-green/40 to-theme-digital-green/20" : "bg-gradient-to-br from-theme-devil-green/25 to-theme-digital-green/10"}`} />

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className={`text-3xl font-bold ${headingColor} mb-2`}>Set New Password</h1>
          <p className={subtitleColor}>Enter your new password below.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`rounded-2xl p-8 border ${cardBg}`}
        >
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="w-12 h-12 text-theme-kelly-green" />
              </div>
              <div className={`font-semibold text-lg ${successTextColor}`}>Password updated!</div>
              <p className={`${successSubtext} text-sm`}>Redirecting you to login...</p>
              <Link href="/login" className="text-sm text-accent hover:text-theme-digital-green transition-colors">
                Go to login now
              </Link>
            </div>
          ) : error && error.includes("Invalid or missing") ? (
            <div className="text-center space-y-4">
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
              <p className="text-gray-400 text-sm">
                The reset link may have expired. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-theme-strong-green text-white rounded-xl hover:scale-105 transition-all"
              >
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`} size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="you@example.com"
                    required
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputClass}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>New Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`} size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="At least 8 characters"
                    required
                    className={`w-full pl-11 pr-11 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor} ${isDark ? "hover:text-white" : "hover:text-gray-700"} transition-colors`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>Confirm Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`} size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(null); }}
                    placeholder="Repeat your password"
                    required
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputClass}`}
                  />
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !code}
                className="w-full py-3 bg-gradient-to-r from-primary to-theme-strong-green text-white rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-theme-digital-green/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  <>Reset Password <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          )}

          <p className={`mt-6 text-center text-sm ${footerTextColor}`}>
            <Link href="/forgot-password" className="text-accent hover:text-theme-digital-green transition-colors">
              Request a new reset link
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <Link href="/" className={`text-sm ${backLinkColor} transition-colors`}>
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
