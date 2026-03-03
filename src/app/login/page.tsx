"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login:", {
      email,
      password,
    });
  };

  return (
    <div
      className="
min-h-screen
bg-gradient-to-b
from-theme-devil-green
via-black
to-black
pt-24 pb-24
flex items-center justify-center px-4
overflow-hidden
relative
"
    >
      {/* Glow Effects Like Hero */}

      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-theme-kelly-green/30 to-theme-digital-green/20 blur-3xl rounded-full -z-10" />

      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-theme-devil-green/40 to-theme-digital-green/20 blur-3xl rounded-full -z-10" />

      <div className="w-full max-w-md">
        {/* Logo */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image
              src="/logo.png"
              alt="DigiCard"
              width={48}
              height={48}
              className="rounded-lg"
            />

            <span className="text-2xl font-bold text-white">DigiCard</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>

          <p className="text-gray-400">Sign in to your account to continue</p>
        </motion.div>

        {/* Card */}

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

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="
w-full pl-11 pr-12 py-3
bg-white/5
border border-white/10
rounded-xl
text-white
placeholder:text-gray-500

focus:outline-none
focus:ring-2
focus:ring-accent

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

            {/* Remember */}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="
w-4 h-4
rounded
border-white/10
bg-white/5
text-accent
focus:ring-accent
"
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
              Sign In
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          {/* Divider */}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social */}

          <div className="grid grid-cols-2 gap-4">
            <button className="py-3 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <FcGoogle size={20} />
              <span>Google</span>
            </button>

            <button className="py-3 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <FaGithub size={20} />
              <span>GitHub</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-accent hover:text-theme-digital-green transition-colors"
            >
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
