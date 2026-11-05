export interface UploadOptions {
  folder?: "locations" | "ev-stations" | "spaces" | "avatars" | "general";
  bucket?: "parkzone-media" | "parking-images" | "avatars";
  fileName?: string;
}

export interface UploadResult {
  url: string;
  storageType: "supabase_bucket" | "inline_fallback";
  path?: string | null;
  notice?: string;
}

export const storageService = {
  /**
   * Uploads an image file or base64 data URL to the Supabase Storage bucket.
   * Returns the permanent public CDN URL.
   */
  async uploadImage(
    fileOrDataUrl: File | Blob | string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const formData = new FormData();
    const folder = options.folder || "general";
    const bucket = options.bucket || "parkzone-media";

    formData.append("folder", folder);
    formData.append("bucket", bucket);

    if (typeof fileOrDataUrl === "string") {
      formData.append("dataUrl", fileOrDataUrl);
    } else {
      formData.append("file", fileOrDataUrl, (fileOrDataUrl as File).name || `${folder}-${Date.now()}.jpg`);
    }

    const res = await fetch("/api/storage/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Upload failed with HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!json.success || !json.url) {
      throw new Error(json.error || "Storage upload response did not return a valid URL");
    }

    return {
      url: json.url,
      storageType: json.storageType || "supabase_bucket",
      path: json.path,
      notice: json.notice,
    };
  },

  /**
   * Returns a valid public avatar URL for a user profile, with an automatic
   * branded fallback if avatar_url is missing or empty.
   */
  getAvatarUrl(user?: {
    avatar_url?: string | null;
    full_name?: string | null;
    email?: string | null;
  } | null): string {
    if (user?.avatar_url && user.avatar_url.trim().length > 0) {
      return user.avatar_url;
    }

    const name = user?.full_name || user?.email?.split("@")[0] || "User";
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=212529&color=fff&bold=true&rounded=true&size=128`;
  },
};

