"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/ThemeProvider";
import { SunIcon, MoonIcon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingExistingSession, setIsVerifyingExistingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-check for existing active session to remember login
  React.useEffect(() => {
    let isMounted = true;
    const checkActiveSession = async () => {
      try {
        if (typeof window !== "undefined") {
          const savedEmail = localStorage.getItem("parkzone_admin_session");
          if (savedEmail) {
            setEmail(savedEmail);
          }
        }

        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session && isMounted) {
          window.location.href = "/admin";
          return;
        }
      } catch (err) {
        console.warn("Session auto-detection skipped:", err);
      } finally {
        if (isMounted) setIsVerifyingExistingSession(false);
      }
    };

    checkActiveSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Invalid authentication credentials.");
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        if (rememberTerminal && typeof window !== "undefined") {
          localStorage.setItem("parkzone_admin_session", email.trim());
          document.cookie = `parkzone_admin_session=${encodeURIComponent(email.trim())};path=/;max-age=2592000;SameSite=Lax`;
        }
        window.location.href = "/admin";
      } else {
        window.location.href = "/admin";
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred during authentication.");
      setIsLoading(false);
    }
  };

  if (isVerifyingExistingSession) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f5f8] dark:bg-[#0f1217] text-[#1c222b] dark:text-[#f3f4f6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1a202c] border border-neutral-200 dark:border-neutral-700 p-2 flex items-center justify-center shadow-xs animate-pulse">
            <img src="/picon.png" alt="ParkZone" className="w-full h-full object-contain dark:invert" />
          </div>
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Checking saved session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#f4f5f8] dark:bg-[#0f1217] text-[#1c222b] dark:text-[#f3f4f6] transition-colors duration-150">
      {/* ──────────────── TOP HEADER ──────────────── */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[#e8ecf1] dark:border-[#202734] bg-white dark:bg-[#151921]">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/parkzone-logo.png"
              alt="ParkZone Logo"
              className="h-7 w-auto object-contain dark:invert"
            />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#202734] text-[#7b8794] dark:text-[#9aa5b1] border border-[#e8ecf1] dark:border-[#202734] tracking-wider whitespace-nowrap shrink-0">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-lg bg-neutral-50 dark:bg-[#181d26] border border-[#e8ecf1] dark:border-[#202734] text-[#7b8794] dark:text-[#9aa5b1] hover:text-[#1c222b] dark:hover:text-[#f3f4f6] transition-colors shrink-0"
        >
          {isDarkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </button>
      </header>

      {/* ──────────────── MAIN LOGIN FORM ──────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[420px]">
          <div className="bg-white dark:bg-[#151921] border border-[#e8ecf1] dark:border-[#202734] rounded-[16px] shadow-xs p-7 sm:p-8">
            {/* Title & Description */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-[#1a202c] border border-[#e8ecf1] dark:border-[#202734] flex items-center justify-center p-2 mb-4 shrink-0 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/picon.png"
                  alt="ParkZone Icon"
                  className="w-full h-full object-contain dark:invert"
                />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#1c222b] dark:text-[#f3f4f6]">
                Admin Sign In
              </h1>
              <p className="mt-1 text-xs text-[#7b8794] dark:text-[#9aa5b1] leading-relaxed">
                Enter your administrative credentials to access the ParkZone operations console.
              </p>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 mt-0.5 text-red-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#1c222b] dark:text-[#f3f4f6] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@parkzone.rw"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#12161f] border border-[#e8ecf1] dark:border-[#202734] text-[#1c222b] dark:text-[#f3f4f6] placeholder-[#9aa5b1] text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#1c222b] dark:text-[#f3f4f6] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white dark:bg-[#12161f] border border-[#e8ecf1] dark:border-[#202734] text-[#1c222b] dark:text-[#f3f4f6] placeholder-[#9aa5b1] text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9aa5b1] hover:text-[#1c222b] dark:hover:text-[#f3f4f6]"
                  >
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Session */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberTerminal}
                    onChange={(e) => setRememberTerminal(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#e8ecf1] dark:border-[#202734] text-blue-600 accent-blue-600"
                  />
                  <span className="text-[#7b8794] dark:text-[#9aa5b1] text-xs">
                    Remember this terminal
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#212529] hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-[#0f1217] font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-3.5 w-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ──────────────── FOOTER ──────────────── */}
      <footer className="w-full px-6 py-4 border-t border-[#e8ecf1] dark:border-[#28313e] bg-white dark:bg-[#181d24] flex items-center justify-between text-xs text-[#7b8794] dark:text-[#9aa5b1]">
        <div>
          © 2026 <span className="font-semibold text-[#1c222b] dark:text-[#f3f4f6]">ParkZone Rwanda</span>
        </div>
        <div className="text-[11px]">
          Kigali Urban Mobility Operations
        </div>
      </footer>
    </div>
  );
}
