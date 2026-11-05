import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, isAdmin: false, error: "Missing userId or email" },
        { status: 400 }
      );
    }

    let detectedRole: string | null = null;
    let isActive: boolean = true;

    // 1. First check with Admin Client (service role) to inspect public.profiles
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const adminClient = hasServiceKey ? createAdminClient() : createClient();

    if (userId) {
      const { data: profile } = await (adminClient as any)
        .from("profiles")
        .select("role, is_active")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        detectedRole = profile.role || null;
        if (profile.is_active !== undefined) {
          isActive = Boolean(profile.is_active);
        }
      }
    }

    // 2. Check by email in profiles if role not yet determined
    if (!detectedRole && email) {
      const { data: profileByEmail } = await (adminClient as any)
        .from("profiles")
        .select("role, is_active")
        .eq("email", email)
        .maybeSingle();

      if (profileByEmail) {
        detectedRole = profileByEmail.role || null;
        if (profileByEmail.is_active !== undefined) {
          isActive = Boolean(profileByEmail.is_active);
        }
      }
    }

    // 3. If service role is available, check auth.users metadata
    if (hasServiceKey && userId && !detectedRole) {
      try {
        const { data: authUser } = await adminClient.auth.admin.getUserById(userId);
        if (authUser?.user) {
          const metaRole =
            (authUser.user.user_metadata as any)?.role ||
            (authUser.user.app_metadata as any)?.role;
          if (metaRole) {
            detectedRole = metaRole;
          }
          if ((authUser.user as any).banned_until) {
            isActive = false;
          }
        }
      } catch (err) {
        console.warn("[verify-role] auth.admin check error:", err);
      }
    }

    const normalizedRole = (detectedRole || "driver").trim().toLowerCase();
    const isAdmin = normalizedRole === "admin" && isActive;

    return NextResponse.json({
      success: true,
      isAdmin,
      role: normalizedRole,
      isActive,
    });
  } catch (error: any) {
    console.error("[verify-role] Error:", error);
    return NextResponse.json(
      { success: false, isAdmin: false, error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}
