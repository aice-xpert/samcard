"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-theme-devil-green via-black to-black px-4">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-4">Almost Done!</h1>
        
        <p className="text-gray-300 mb-6">
          We've sent a confirmation link to{" "}
          {email ? (
            <strong className="text-white break-all">{email}</strong>
          ) : (
            "your email"
          )}
          . Please check your inbox and click the link to complete your registration.
        </p>

        <a
          href="https://mail.google.com/mail/u/0/#inbox"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full mb-6 py-3 px-6 bg-gradient-to-r from-primary to-theme-strong-green text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          Open Gmail
        </a>

        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Didn't receive the email? Check your spam folder or{" "}
            <Link href="/signup" className="text-accent hover:underline">
              try again
            </Link>.
          </p>

          <Link
            href="/"
            className="inline-block w-full py-3 px-6 bg-white/10 text-white rounded-xl hover:bg-white/20 hover:scale-[1.02] transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <p className="animate-pulse">Loading...</p>
        </div>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}