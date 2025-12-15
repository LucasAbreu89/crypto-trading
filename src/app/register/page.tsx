"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password validation
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms of service to continue.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=/dashboard`,
          data: {
            full_name: fullName,
            accept_marketing: acceptMarketing,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Check if email confirmation is disabled (auto-confirmed)
      if (data?.user?.confirmed_at) {
        // User is auto-confirmed, redirect to dashboard
        router.push("/dashboard");
        return;
      }

      // Email confirmation required
      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Success State
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] grid-pattern px-4">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#8b5cf6] rounded-full filter blur-[128px] opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00f5ff] rounded-full filter blur-[128px] opacity-15" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-[#10b981]" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-[#9ca3af] mb-6">
              We sent a confirmation link to{" "}
              <span className="text-white font-medium">{email}</span>. Click the
              link to activate your account.
            </p>
            <p className="text-sm text-[#6b7280]">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                }}
                className="text-[#8b5cf6] hover:text-[#a78bfa]"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] grid-pattern px-4 py-12">
      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#8b5cf6] rounded-full filter blur-[128px] opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00f5ff] rounded-full filter blur-[128px] opacity-15" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Axiom"
              width={180}
              height={54}
              className="mx-auto"
              unoptimized
            />
          </Link>
          <p className="text-[#9ca3af] mt-2">Create your account</p>
        </div>

        {/* Register Card */}
        <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#ef4444]">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-[#12121a] border border-[#2d2d3d] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#8b5cf6] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#12121a] border border-[#2d2d3d] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#8b5cf6] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#12121a] border border-[#2d2d3d] rounded-lg pl-10 pr-12 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#8b5cf6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  {[
                    { check: passwordChecks.length, text: "8+ characters" },
                    { check: passwordChecks.uppercase, text: "Uppercase letter" },
                    { check: passwordChecks.lowercase, text: "Lowercase letter" },
                    { check: passwordChecks.number, text: "Number" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1 ${
                        item.check ? "text-[#10b981]" : "text-[#6b7280]"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {item.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full bg-[#12121a] border rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#6b7280] focus:outline-none transition-colors ${
                    confirmPassword
                      ? passwordsMatch
                        ? "border-[#10b981]"
                        : "border-[#ef4444]"
                      : "border-[#2d2d3d] focus:border-[#8b5cf6]"
                  }`}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#2d2d3d] bg-[#12121a] text-[#8b5cf6] focus:ring-[#8b5cf6]"
                />
                <span className="text-sm text-[#9ca3af]">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#8b5cf6] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#8b5cf6] hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptMarketing}
                  onChange={(e) => setAcceptMarketing(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#2d2d3d] bg-[#12121a] text-[#8b5cf6] focus:ring-[#8b5cf6]"
                />
                <span className="text-sm text-[#9ca3af]">
                  Send me trading tips and product updates
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2d2d3d]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1a2e] text-[#6b7280]">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full bg-[#12121a] border border-[#2d2d3d] rounded-lg py-3 flex items-center justify-center gap-3 hover:border-[#3f3f5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-[#9ca3af]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-[#6b7280] hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
