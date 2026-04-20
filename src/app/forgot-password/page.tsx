"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

function friendlyError(code: string): string {
  switch (code) {
    case "auth/invalid-email": return "Please enter a valid email address.";
    case "auth/user-not-found": return "No account found with that email.";
    case "auth/too-many-requests": return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed": return "Network error. Check your connection and try again.";
    default: return "Failed to send reset email. Please try again.";
  }
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setSubmitted(true);
    } catch (err: any) {
      console.error("[forgot-password]", err);
      const code: string = err?.code ?? "";
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-theme-devil-green via-black to-black pt-24 pb-5 flex items-center justify-center px-4 overflow-hidden relative">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-theme-kelly-green/30 to-theme-digital-green/20 blur-3xl rounded-full -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-theme-devil-green/40 to-theme-digital-green/20 blur-3xl rounded-full -z-10" />

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Forgot Your Password?
          </h1>
          <p className="text-gray-400">
            Enter your email and we will send you a reset link.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl shadow-theme-digital-green/10"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
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
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-theme-strong-green text-white rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-theme-digital-green/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>Send Reset Link <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="w-12 h-12 text-theme-kelly-green" />
              </div>
              <div className="text-white font-semibold text-lg">Check your inbox!</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                We sent a password reset link to <span className="text-white font-medium">{email}</span>.<br />
                Check your spam folder if you don&apos;t see it.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(""); }}
                className="text-sm text-accent hover:text-theme-digital-green transition-colors"
              >
                Try a different email
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-accent hover:text-theme-digital-green transition-colors"
            >
              Back to login
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-center"
        >
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}