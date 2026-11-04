import { NextResponse } from "next/server";
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
