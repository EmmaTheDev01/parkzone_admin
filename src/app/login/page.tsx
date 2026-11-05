"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("parkzone_admin_session") || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingExistingSession, setIsVerifyingExistingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const err = params.get("error");
        if (err === "unauthorized" || err === "not_admin") {
          return "Access Denied: Only users with the 'admin' role are authorized to log in to this portal.";
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  // Auto-check for existing active session on mount
  useEffect(() => {
    let isMounted = true;

    const checkActiveSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && isMounted) {
          // Verify role is strictly 'admin'
          let isAdmin = false;
          try {
            const roleRes = await fetch("/api/auth/verify-role", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: session.user.id, email: session.user.email }),
            });
            if (roleRes.ok) {
              const json = await roleRes.json();
              isAdmin = json.isAdmin === true;
            }
          } catch {
            // fallback check
            const { data: profile } = await supabase
              .from("profiles")
              .select("role, is_active")
              .eq("id", session.user.id)
              .maybeSingle();
            const metaRole = (session.user.user_metadata as Record<string, unknown> | undefined)?.role;
            const r = (profile?.role || (typeof metaRole === "string" ? metaRole : "") || "").toLowerCase();
            isAdmin = r === "admin" && profile?.is_active !== false;
          }

          if (isAdmin) {
            router.push("/admin");
            return;
          } else {
            // Existing non-admin session: purge and sign out immediately
            await supabase.auth.signOut({ scope: "global" });
            if (typeof window !== "undefined") {
              localStorage.removeItem("parkzone_admin_session");
              document.cookie = "parkzone_admin_session=;path=/;max-age=0";
            }
            setErrorMsg("Access Denied: Only accounts with an authorized 'admin' role can access this portal.");
          }
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
  }, [router]);

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

      if (!data?.user) {
        setErrorMsg("Authentication error: No user returned.");
        setIsLoading(false);
        return;
      }

      // ── STRICT ADMIN ROLE GATE ──
      let isAdmin = false;
      let detectedRole = "driver";

      try {
        const roleRes = await fetch("/api/auth/verify-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.id, email: data.user.email }),
        });

        if (roleRes.ok) {
          const json = await roleRes.json();
          isAdmin = json.isAdmin === true;
          detectedRole = json.role || "driver";
        }
      } catch (e) {
        console.warn("API role check warning, falling back:", e);
      }

      // Fallback verification against public.profiles
      if (!isAdmin) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, is_active")
          .eq("id", data.user.id)
          .maybeSingle();

        const userMeta = data.user.user_metadata as Record<string, unknown> | undefined;
        const metaRole = typeof userMeta?.role === "string" ? userMeta.role : "";
        const role = (profile?.role || metaRole || "").toLowerCase();
        if (role === "admin" && profile?.is_active !== false) {
          isAdmin = true;
          detectedRole = "admin";
        } else if (profile?.role) {
          detectedRole = profile.role;
        }
      }

      if (!isAdmin) {
        await supabase.auth.signOut({ scope: "global" });
        if (typeof window !== "undefined") {
          localStorage.removeItem("parkzone_admin_session");
          document.cookie = "parkzone_admin_session=;path=/;max-age=0";
        }

        setErrorMsg(
          `Access Denied: Only users with the 'admin' role are permitted to log in to this portal. Your account role is '${detectedRole}'.`
        );
        setIsLoading(false);
        return;
      }

      // Valid admin verified
      if (rememberTerminal && typeof window !== "undefined") {
        localStorage.setItem("parkzone_admin_session", email.trim());
        document.cookie = `parkzone_admin_session=${encodeURIComponent(
          email.trim()
        )};path=/;max-age=2592000;SameSite=Lax`;
      }
      router.push("/admin");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred during authentication.");
      setIsLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl bg-[#F7F7F6] px-4 py-3 text-[14px] sm:text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none ring-1 ring-transparent focus:bg-white focus:ring-emerald-500/40 transition";

  if (isVerifyingExistingSession) {
    return (
      <div className="min-h-screen bg-[#F7F7F6] text-[#2B2A2A] font-sans antialiased selection:bg-emerald-200 flex flex-col justify-between">
        <header className="sticky top-0 z-50 bg-[#F7F7F6]/85 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="ParkZone" className="h-7 sm:h-8 w-auto object-contain" />
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
          <div className="w-full max-w-[420px] rounded-[24px] sm:rounded-[28px] bg-white p-7 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] space-y-4 animate-pulse">
            <div className="h-4 w-28 bg-neutral-200/80 rounded-full mx-auto" />
            <div className="h-8 w-44 bg-neutral-200/80 rounded-xl mx-auto" />
            <div className="h-4 w-60 bg-neutral-100 rounded-lg mx-auto" />
            <div className="pt-4 space-y-3">
              <div className="h-11 bg-neutral-100 rounded-xl" />
              <div className="h-11 bg-neutral-100 rounded-xl" />
              <div className="h-11 bg-neutral-200/80 rounded-full mt-4" />
            </div>
          </div>
        </main>

        <footer className="px-5 sm:px-8 pb-8 text-center text-[11px] text-neutral-400">
          <span>Verifying secure terminal...</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-[#2B2A2A] font-sans antialiased selection:bg-emerald-200 flex flex-col justify-between">
      {/* ────────────────── MINIMAL HEADER ────────────────── */}
      <header className="sticky top-0 z-50 bg-[#F7F7F6]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ParkZone" className="h-7 sm:h-8 w-auto object-contain" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back home
          </Link>
        </div>
      </header>

      {/* ────────────────── MAIN LOGIN FORM ────────────────── */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 sm:py-16">
        <div className="w-full max-w-[420px]">
          {/* Header Title */}
          <div className="text-center pz-rise mb-8">
            <span className="pz-pill inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium text-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
              Municipal Operations
            </span>
            <h1 className="mt-4 font-serif text-[38px] sm:text-[46px] leading-[1.05] tracking-[-0.015em]">
              Admin Sign In
            </h1>
            <p className="mt-2.5 text-[14px] text-neutral-500 leading-relaxed">
              Enter your credentials to access the ParkZone console.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="pz-rise rounded-[24px] sm:rounded-[28px] bg-white p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] space-y-3.5"
            style={{ animationDelay: "100ms" }}
          >
            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-800 flex items-start gap-2.5 leading-relaxed">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 mt-0.5 text-red-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="admin@parkzone.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Terminal Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-500">
                <input
                  type="checkbox"
                  checked={rememberTerminal}
                  onChange={(e) => setRememberTerminal(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 accent-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#2B2A2A] hover:bg-black disabled:bg-neutral-600 text-white py-3 text-sm font-medium transition-all active:scale-[0.98] shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
      </main>

      {/* ────────────────── FOOTER ────────────────── */}
      <footer className="px-5 sm:px-8 pb-8 pt-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-400">
          <span>© 2026 ParkZone Rwanda Ltd.</span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  );
}
