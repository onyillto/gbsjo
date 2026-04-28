"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/tenants/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Background Circles */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
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
            Log in to your Account
          </h2>
          <p className="text-gray-600 mb-8 font-['Inter']">
            Welcome back! Enter your details below
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
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

          {/* Password Input */}
          <div className="mb-4">
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder-gray-400 font-['Inter']"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 font-['Inter']">
                Remember me
              </span>
            </label>
            <a
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-['Inter']"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ backgroundColor: "#0F3E76" }}
            className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition font-['Poppins']"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-6 text-sm text-gray-600 font-['Inter']">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
