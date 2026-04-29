"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

function VerifyTokenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "signup"; // 'signup' or 'reset'

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint =
        type === "signup"
          ? "/api/auth/verify-signup-token"
          : "/api/auth/verify-reset-token";

      const response = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        if (type === "signup") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          setTimeout(() => router.push("/login"), 2000);
        }
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint =
        type === "signup"
          ? "/api/auth/tenants/signup"
          : "/api/auth/forgot-password";

      const response = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setError("");
        alert("Verification code resent to your email");
      } else {
        setError("Failed to resend code");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex h-screen bg-white">
        {/* LEFT SIDE - IMAGE */}
        <div
          className="w-1/2 flex flex-col items-center justify-center relative overflow-hidden p-8"
          style={{ backgroundColor: "#0F3E76" }}
        >
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <Image
              src="/theme.jpg"
              alt="GBAJO"
              width={600}
              height={600}
              priority
              className="object-contain w-full h-full max-w-lg max-h-lg"
            />
          </div>

          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-32 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* RIGHT SIDE - SUCCESS */}
        <div className="w-1/2 flex flex-col justify-center items-center px-12 bg-white">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-12 flex justify-start">
              <Image
                src="/logo.png"
                alt="GBAJO Logo"
                width={120}
                height={40}
                priority
                className="object-contain"
              />
            </div>

            {/* Success Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center font-['Poppins']">
              {type === "signup" ? "Account Verified!" : "Email Verified!"}
            </h2>
            <p className="text-gray-600 text-center mb-8 font-['Inter']">
              {type === "signup"
                ? "Your account has been verified successfully. Redirecting to dashboard..."
                : "Your email has been verified. Redirecting to login..."}
            </p>

            {/* Loader */}
            <div className="flex justify-center mb-8">
              <div
                className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
                style={{ borderTopColor: "#0F3E76" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* LEFT SIDE - IMAGE */}
      <div
        className="w-1/2 flex flex-col items-center justify-center relative overflow-hidden p-8"
        style={{ backgroundColor: "#0F3E76" }}
      >
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Image
            src="/gbajo.jpg"
            alt="GBAJO"
            width={600}
            height={600}
            priority
            className="object-contain w-full h-full max-w-lg max-h-lg"
          />
        </div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* RIGHT SIDE - VERIFY FORM */}
      <div className="w-1/2 flex flex-col justify-center items-center px-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12 flex justify-start">
            <Image
              src="/logo.png"
              alt="GBAJO Logo"
              width={120}
              height={40}
              priority
              className="object-contain"
            />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Poppins']">
            Verify Email
          </h2>
          <p className="text-gray-600 mb-2 font-['Inter']">
            {type === "signup"
              ? "Enter the verification code sent to your email"
              : "Enter the code we sent to reset your password"}
          </p>
          <p className="text-gray-500 text-sm mb-8 font-['Inter']">{email}</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Token Input */}
          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder-gray-400 font-['Inter'] text-center text-lg font-semibold tracking-widest"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-['Inter']">
                {token.length}/6 characters
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || token.length < 6}
              style={{ backgroundColor: "#0F3E76" }}
              className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition font-['Poppins']"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          {/* Resend Code */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 font-['Inter'] mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendToken}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold font-['Inter']"
            >
              Resend Code
            </button>
          </div>

          {/* Back Link */}
          <div className="text-center mt-8">
            <a
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-700 font-['Inter']"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyTokenPage() {
  return (
    <Suspense>
      <VerifyTokenContent />
    </Suspense>
  );
}
