"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/auth/tenants/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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

        {/* RIGHT SIDE - SUCCESS MESSAGE */}
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
              Check your email!
            </h2>
            <p className="text-gray-600 text-center mb-4 font-['Inter'] leading-relaxed">
              We will notify you when your signup is approved.
            </p>
            <p className="text-gray-500 text-center mb-8 font-['Inter'] text-sm">
              A confirmation link has been sent to{" "}
              <span className="font-semibold text-gray-700">{email}</span>
            </p>

            {/* Back to Login */}
            <a
              href="/auth/login"
              style={{ backgroundColor: "#0F3E76" }}
              className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 transition font-['Poppins'] text-center block"
            >
              Back to Login
            </a>
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

      {/* RIGHT SIDE - SIGNUP FORM */}
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
            Create Account
          </h2>
          <p className="text-gray-600 mb-8 font-['Inter']">
            Enter your email to get started
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <form onSubmit={handleSignup}>
            <div className="mb-6">
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder-gray-400 font-['Inter']"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#0F3E76" }}
              className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition font-['Poppins']"
            >
              {loading ? "Sending..." : "Sign up"}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 text-sm text-gray-600 font-['Inter']">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
