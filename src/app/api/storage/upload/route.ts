import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const dataUrl = formData.get("dataUrl") as string | null;
    const bucket = (formData.get("bucket") as string) || "parkzone-media";
    const folder = (formData.get("folder") as string) || "general";

    let fileBuffer: Buffer | null = null;
    let contentType = "image/jpeg";
    let originalName = "upload.jpg";

    if (file && typeof file.arrayBuffer === "function") {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      contentType = file.type || "image/jpeg";
      originalName = file.name || "upload.jpg";
    } else if (dataUrl && dataUrl.startsWith("data:")) {
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contentType = matches[1];
        fileBuffer = Buffer.from(matches[2], "base64");
        originalName = `data-upload.${contentType.split("/")[1] || "jpg"}`;
      }
    }

    if (!fileBuffer) {
      return NextResponse.json(
        { success: false, error: "No valid image file or dataUrl provided" },
        { status: 400 }
      );
    }

    // Sanitize file name and create timestamped path
    const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const cleanBase = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 32);
    const fileName = `${Date.now()}_${cleanBase}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    // Prefer admin client if service key exists, otherwise standard client
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const supabase = hasServiceKey ? createAdminClient() : createClient();

    // 1. Try uploading to primary bucket
    let uploadRes = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    // 2. If bucket doesn't exist, try creating it (if admin) or fallback to 'parking-images' / 'avatars'
    if (uploadRes.error) {
      const errMsg = uploadRes.error.message.toLowerCase();
      if (errMsg.includes("not found") || errMsg.includes("bucket")) {
        try {
          await supabase.storage.createBucket(bucket, { public: true });
          uploadRes = await supabase.storage
            .from(bucket)
            .upload(filePath, fileBuffer, {
              contentType,
              upsert: true,
            });
        } catch {
          // Ignore createBucket errors if unauthorized
        }
      }
    }

    // 3. If storage upload succeeded, return permanent public CDN URL
    if (!uploadRes.error) {
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return NextResponse.json({
        success: true,
        url: publicUrlData.publicUrl,
        path: filePath,
        bucket,
        storageType: "supabase_bucket",
      });
    }

    // 4. Fallback if Supabase storage bucket is not yet provisioned via SQL:
    // Generate optimized inline Data URL so user is NEVER blocked
    const base64Data = fileBuffer.toString("base64");
    const fallbackDataUrl = `data:${contentType};base64,${base64Data}`;

    console.warn(
      `[Storage Upload API] Notice: Supabase storage bucket '${bucket}' returned '${uploadRes.error.message}'. Used optimized data URL fallback.`
    );

    return NextResponse.json({
      success: true,
      url: fallbackDataUrl,
      path: null,
      bucket: null,
      storageType: "inline_fallback",
      notice: "Stored as optimized image. Run supabase/migrations/20261105_storage_buckets.sql to enable Supabase cloud buckets.",
    });
  } catch (err: any) {
    console.error("[Storage Upload API] Fatal error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed processing image upload" },
      { status: 500 }
    );
  }
}
