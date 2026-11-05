import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/client";

// GET /api/parking/spaces?locationId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");

    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const client = hasServiceKey ? createAdminClient() : createClient();

    let query = (client as any).from("parking_spaces").select("*");
    if (locationId) {
      query = query.eq("location_id", locationId);
    }

    const { data, error } = await query.order("space_number", { ascending: true });

    if (error) {
      console.warn("[API /parking/spaces GET] error:", error.message);
      return NextResponse.json({ success: false, spaces: [], error: error.message }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      spaces: data || [],
      count: (data || []).length,
    });
  } catch (err: any) {
    console.error("[API /parking/spaces GET] exception:", err);
    return NextResponse.json({ success: false, spaces: [], error: err?.message }, { status: 500 });
  }
}

// POST /api/parking/spaces (Create space)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const client = hasServiceKey ? createAdminClient() : createClient();

    const insertPayload: any = {
      location_id: body.location_id,
      space_number: body.space_number,
      zone_code: body.zone_code || "Zone A",
      space_type: body.space_type || "regular",
      is_occupied: Boolean(body.is_occupied),
      price_per_hour_rwf: body.price_per_hour_rwf !== undefined ? Number(body.price_per_hour_rwf) : 300,
      image_url: body.image_url || null,
      qr_code_token: body.qr_code_token || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (body.floor) insertPayload.floor = body.floor;

    let { data, error } = await (client as any)
      .from("parking_spaces")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      // Fallback for legacy columns
      const legacyPayload: any = {
        location_id: body.location_id,
        space_number: body.space_number,
        floor: body.floor || "1",
        space_type: body.space_type || "regular",
        status: body.is_occupied ? "occupied" : "available",
        hourly_rate: body.price_per_hour_rwf || 300,
        daily_rate: 2000,
      };
      const res = await (client as any)
        .from("parking_spaces")
        .insert(legacyPayload)
        .select()
        .single();
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.error("[API /parking/spaces POST] error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      space: data,
    });
  } catch (err: any) {
    console.error("[API /parking/spaces POST] exception:", err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

// DELETE /api/parking/spaces (Delete space)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("id");

    if (!spaceId) {
      return NextResponse.json({ success: false, error: "Missing space id" }, { status: 400 });
    }

    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const client = hasServiceKey ? createAdminClient() : createClient();

    const { error } = await (client as any)
      .from("parking_spaces")
      .delete()
      .eq("id", spaceId);

    if (error) {
      console.error("[API /parking/spaces DELETE] error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, spaceId });
  } catch (err: any) {
    console.error("[API /parking/spaces DELETE] exception:", err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
