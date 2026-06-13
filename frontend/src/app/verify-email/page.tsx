"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in.");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email. The link may be invalid or expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong while verifying your email.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-theme-devil-green via-black to-black flex justify-center px-4 pt-32 pb-5">
      <div className="w-full max-w-md text-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-theme-digital-green animate-spin mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Verifying...</h2>
              <p className="text-gray-400">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Verified!</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              <Link
                href="/login"
                className="w-full py-3 px-6 bg-gradient-to-r from-primary to-theme-strong-green text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              <Link
                href="/signup"
                className="w-full py-3 px-6 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                Sign up again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <Loader2 className="w-8 h-8 animate-spin text-theme-digital-green" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
