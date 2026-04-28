"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep("verify");
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to reset password");
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
              Password Reset!
            </h2>
            <p className="text-gray-600 text-center mb-8 font-['Inter']">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>

            {/* Login Button */}
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

      {/* RIGHT SIDE - FORM */}
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

          {step === "email" ? (
            <>
              {/* Email Step */}
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Poppins']">
                Forgot Password?
              </h2>
              <p className="text-gray-600 mb-8 font-['Inter']">
                Enter your email to receive a reset link
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSendEmail}>
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

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#0F3E76" }}
                  className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition font-['Poppins']"
                >
                  {loading ? "Sending..." : "Send Reset Email"}
                </button>
              </form>

              <div className="text-center mt-6 text-sm text-gray-600 font-['Inter']">
                Remember your password?{" "}
                <a
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Log in
                </a>
              </div>
            </>
          ) : (
            <>
              {/* Verify Token Step */}
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Poppins']">
                Reset Password
              </h2>
              <p className="text-gray-600 mb-8 font-['Inter']">
                Check your email for the verification code
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerifyToken}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-['Inter']">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter code from email"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder-gray-400 font-['Inter']"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-['Inter']">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder-gray-400 font-['Inter']"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-['Inter']">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder-gray-400 font-['Inter']"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "#0F3E76" }}
                  className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition font-['Poppins']"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setToken("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold font-['Inter']"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
