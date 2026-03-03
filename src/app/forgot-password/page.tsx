"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Reset password for:", email);
    setSubmitted(true);
  };

  return (
    <div
      className="
min-h-screen
bg-gradient-to-b
from-theme-devil-green
via-black
to-black
pt-24 pb-5
flex items-center justify-center px-4
overflow-hidden
relative
"
    >
   

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
          className="
bg-white/5
backdrop-blur-lg
rounded-2xl
p-8
border border-white/10
shadow-2xl shadow-theme-digital-green/10
"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="
w-full pl-11 pr-4 py-3
bg-white/5
border border-white/10
rounded-xl
text-white
placeholder:text-gray-500

focus:outline-none
focus:ring-2
focus:ring-accent
focus:border-transparent

transition-all
"
                  />
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="
w-full py-3
bg-gradient-to-r
from-primary
to-theme-strong-green
text-white
rounded-xl

hover:scale-105
hover:shadow-2xl
hover:shadow-theme-digital-green/30

transition-all
flex items-center justify-center gap-2 group
"
              >
                Send Reset Link
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-theme-kelly-green font-medium">
                If an account exists for {email}, a reset link has been sent.
              </div>

              <p className="text-gray-400 text-sm">
                Please check your inbox and follow the instructions.
              </p>
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
