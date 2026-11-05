import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const unifiedUsersMap = new Map<string, any>();
    let authUsersCount = 0;
    let profilesCount = 0;
    let rpcAvailable = false;
    let hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. Attempt using Supabase Service Role Key (Admin Auth API)
    if (hasServiceKey) {
      try {
        const adminClient = createAdminClient();
        const { data: authData, error: authErr } = await adminClient.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });

        if (!authErr && authData?.users) {
          authUsersCount = authData.users.length;
          for (const u of authData.users) {
            unifiedUsersMap.set(u.id, {
              id: u.id,
              email: u.email || null,
              phone_number: u.phone || (u.user_metadata as any)?.phone_number || null,
              full_name: (u.user_metadata as any)?.full_name || (u.user_metadata as any)?.name || "Registered User",
              avatar_url: (u.user_metadata as any)?.avatar_url || null,
              role: (u.user_metadata as any)?.role || "driver",
              wallet_balance_rwf: 0,
              is_active: !(u as any).banned_until,
              created_at: u.created_at,
              updated_at: u.updated_at || u.created_at,
              last_sign_in_at: u.last_sign_in_at || null,
              provider: u.app_metadata?.provider || "email",
              source: "auth_users",
            });
          }
        } else if (authErr) {
          console.warn("[API /admin/users] Service key listUsers warning:", authErr.message);
        }
      } catch (err) {
        console.warn("[API /admin/users] Error with service key admin auth:", err);
      }
    }

    // 2. Attempt PostgreSQL SECURITY DEFINER RPC 'get_all_users_admin'
    const regularClient = createClient();
    try {
      const { data: rpcData, error: rpcErr } = await regularClient.rpc("get_all_users_admin" as any);
      if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
        rpcAvailable = true;
        for (const r of rpcData as any[]) {
          const existing = unifiedUsersMap.get(r.id);
          unifiedUsersMap.set(r.id, {
            id: r.id,
            email: r.email || existing?.email || null,
            phone_number: r.phone_number || existing?.phone_number || null,
            full_name: r.full_name || existing?.full_name || "Registered User",
            avatar_url: r.avatar_url || existing?.avatar_url || null,
            role: r.role || existing?.role || "driver",
            wallet_balance_rwf: Number(r.wallet_balance_rwf ?? existing?.wallet_balance_rwf ?? 0),
            is_active: r.is_active !== undefined ? Boolean(r.is_active) : true,
            created_at: r.created_at || existing?.created_at || new Date().toISOString(),
            updated_at: r.updated_at || existing?.updated_at || new Date().toISOString(),
            last_sign_in_at: r.last_sign_in_at || existing?.last_sign_in_at || null,
            provider: r.provider || existing?.provider || "email",
            source: existing ? "synced" : "auth_users",
          });
        }
      }
    } catch {
      // RPC not yet migrated in Supabase
    }

    // 3. Query public.profiles
    try {
      const { data: profiles, error: profErr } = await regularClient
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!profErr && Array.isArray(profiles)) {
        profilesCount = profiles.length;
        for (const p of profiles) {
          const existing = unifiedUsersMap.get(p.id);
          unifiedUsersMap.set(p.id, {
            id: p.id,
            email: p.email || existing?.email || null,
            phone_number: p.phone_number || existing?.phone_number || null,
            full_name: p.full_name || existing?.full_name || "Registered User",
            avatar_url: p.avatar_url || existing?.avatar_url || null,
            role: p.role || existing?.role || "driver",
            wallet_balance_rwf: Number(p.wallet_balance_rwf ?? existing?.wallet_balance_rwf ?? 0),
            national_id: p.national_id || null,
            driver_license: p.driver_license || null,
            emergency_contact: p.emergency_contact || null,
            rra_tin: p.rra_tin || null,
            is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
            created_at: p.created_at || existing?.created_at || new Date().toISOString(),
            updated_at: p.updated_at || existing?.updated_at || new Date().toISOString(),
            last_sign_in_at: existing?.last_sign_in_at || null,
            provider: existing?.provider || "email",
            source: existing ? "synced" : "profiles",
          });
        }
      }
    } catch (profErr) {
      console.warn("[API /admin/users] Profiles select warning:", profErr);
    }

    const usersList = Array.from(unifiedUsersMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      users: usersList,
      count: usersList.length,
      meta: {
        hasServiceKey,
        rpcAvailable,
        authUsersCount,
        profilesCount,
      },
    });
  } catch (error: any) {
    console.error("[API /admin/users] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error fetching admin users",
        users: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, role, is_active, wallet_balance_rwf, avatar_url, full_name } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: userId" },
        { status: 400 }
      );
    }

    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const client = hasServiceKey ? createAdminClient() : createClient();

    // 1. Prepare profile updates
    const profilePayload: any = {
      updated_at: new Date().toISOString(),
    };
    if (role !== undefined) profilePayload.role = role;
    if (is_active !== undefined) profilePayload.is_active = Boolean(is_active);
    if (wallet_balance_rwf !== undefined) profilePayload.wallet_balance_rwf = Number(wallet_balance_rwf);
    if (avatar_url !== undefined) profilePayload.avatar_url = avatar_url;
    if (full_name !== undefined) profilePayload.full_name = full_name;

    // Check if profile exists in public.profiles
    const { data: existingProfile } = await (client as any)
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", userId)
      .maybeSingle();

    if (existingProfile) {
      const { error: updateErr } = await (client as any)
        .from("profiles")
        .update(profilePayload)
        .eq("id", userId);

      if (updateErr) {
        console.warn("[API /admin/users PATCH] Profile update warning:", updateErr.message);
      }
    } else {
      // Upsert profile row with defaults
      let userEmail = null;
      let userName = full_name || "Registered User";

      if (hasServiceKey) {
        try {
          const { data: authUser } = await (client as any).auth.admin.getUserById(userId);
          if (authUser?.user) {
            userEmail = authUser.user.email || null;
            userName =
              full_name ||
              (authUser.user.user_metadata as any)?.full_name ||
              (authUser.user.user_metadata as any)?.name ||
              userName;
          }
        } catch (e) {
          console.warn("[API /admin/users PATCH] auth user lookup error:", e);
        }
      }

      await (client as any).from("profiles").upsert({
        id: userId,
        email: userEmail,
        full_name: userName,
        role: role || "driver",
        is_active: is_active !== undefined ? Boolean(is_active) : true,
        wallet_balance_rwf: wallet_balance_rwf !== undefined ? Number(wallet_balance_rwf) : 0,
        avatar_url: avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // 2. If Service Role Key is present, sync with Supabase Auth admin
    if (hasServiceKey) {
      try {
        const adminClient = createAdminClient();
        const userMetaUpdates: any = {};
        if (role !== undefined) userMetaUpdates.role = role;
        if (full_name !== undefined) userMetaUpdates.full_name = full_name;
        if (avatar_url !== undefined) userMetaUpdates.avatar_url = avatar_url;

        const authPayload: any = {};
        if (Object.keys(userMetaUpdates).length > 0) {
          authPayload.user_metadata = userMetaUpdates;
        }
        if (is_active === false) {
          authPayload.ban_duration = "876000h";
        } else if (is_active === true) {
          authPayload.ban_duration = "none";
        }

        if (Object.keys(authPayload).length > 0) {
          await adminClient.auth.admin.updateUserById(userId, authPayload);
        }
      } catch (authErr) {
        console.warn("[API /admin/users PATCH] auth.admin sync warning:", authErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      userId,
      updates: profilePayload,
    });
  } catch (error: any) {
    console.error("[API /admin/users PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update user profile" },
      { status: 500 }
    );
  }
}
