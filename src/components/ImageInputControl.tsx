"use client";

import React, { useRef, useState } from "react";
import { storageService, UploadOptions } from "@/lib/services/storageService";

interface PresetImage {
  label: string;
  url: string;
  category?: string;
}

interface ImageInputControlProps {
  label?: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  presets?: PresetImage[];
  showPresets?: boolean;
  helperText?: string;
  folder?: UploadOptions["folder"];
  bucket?: UploadOptions["bucket"];
}

export function ImageInputControl({
  label = "Facility Photograph / Layout Picture",
  value,
  onChange,
  presets = [],
  showPresets = false,
  helperText = "Upload a photo from your device to Supabase Storage or paste an external image URL.",
  folder = "locations",
  bucket = "parkzone-media",
}: ImageInputControlProps) {
  const [urlInput, setUrlInput] = useState(value || "");
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize internal urlInput if parent value changes
  React.useEffect(() => {
    setUrlInput(value || "");
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setUploadNotice(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 10MB. Please choose a smaller image.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Client-side canvas normalization (max 1400px)
      const compressedDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (!result) return reject(new Error("Failed reading file"));

          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDim = 1400;
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.88));
            } else {
              resolve(result);
            }
          };
          img.onerror = () => reject(new Error("Failed rendering image element"));
          img.src = result;
        };
        reader.onerror = () => reject(new Error("File reader encountered an error"));
        reader.readAsDataURL(file);
      });

      // 2. Upload to Supabase Storage bucket
      const uploadRes = await storageService.uploadImage(compressedDataUrl, {
        folder,
        bucket,
        fileName: file.name,
      });

      onChange(uploadRes.url);

      if (uploadRes.storageType === "supabase_bucket") {
        setUploadNotice(`✓ Uploaded to Supabase Bucket (${bucket})`);
      } else {
        setUploadNotice("✓ Image ready (optimized data URL)");
      }
      setTimeout(() => setUploadNotice(null), 5000);
    } catch (err: any) {
      console.error("Storage upload failed:", err);
      setErrorMsg(err?.message || "Failed uploading image to storage");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplyUrl = () => {
    setErrorMsg(null);
    setUploadNotice(null);
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChange(null);
      setIsUrlMode(false);
      return;
    }
    onChange(trimmed);
    setIsUrlMode(false);
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {label}
            </label>
            <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200/80 dark:border-neutral-700">
              bucket: {bucket}
            </span>
          </div>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setUrlInput("");
                setUploadNotice(null);
              }}
              className="text-[11px] text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Remove Picture
            </button>
          )}
        </div>
      )}

      {/* Main Image Preview / Drop Area */}
      <div className="relative rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 bg-[#f8f9fa] dark:bg-[#12161f] overflow-hidden transition-all group">
        {/* Uploading Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2.5 p-4 animate-in fade-in duration-150">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-xs font-semibold">Uploading to Supabase Storage Bucket...</span>
            <span className="text-[10px] text-neutral-300 font-mono">bucket/{bucket}/{folder}</span>
          </div>
        )}

        {value ? (
          <div className="relative h-44 sm:h-52 w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-between p-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-wider">
                  Active Picture
                </span>
                {value.includes("/storage/v1/object/public/") && (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-700/50">
                    ☁️ Cloud Bucket
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-100 shadow-sm transition-all"
                >
                  Replace File
                </button>
                <button
                  type="button"
                  onClick={() => setIsUrlMode(!isUrlMode)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/70 text-white hover:bg-black border border-white/20 transition-all"
                >
                  Edit URL
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1a202c] border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-xs text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Upload image to Supabase Storage Bucket
              </p>
              <p className="text-[11px] text-neutral-400 leading-tight">
                {helperText}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold transition-all shadow-xs"
              >
                Browse Device
              </button>
              <button
                type="button"
                onClick={() => setIsUrlMode(!isUrlMode)}
                className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1a202c] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Use Web URL
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload notice / success message */}
      {uploadNotice && (
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          {uploadNotice}
        </p>
      )}

      {/* URL Input Bar */}
      {isUrlMode && (
        <div className="p-3 rounded-xl bg-white dark:bg-[#181d26] border border-neutral-200 dark:border-neutral-700 space-y-2">
          <label className="block text-[11px] font-semibold text-neutral-500">
            Paste Direct Image or CDN URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://...supabase.co/storage/v1/... or https://..."
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#f8f9fa] dark:bg-[#12161f] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 dark:bg-white text-white dark:text-black shrink-0"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <p className="text-[11px] text-red-500 font-medium">{errorMsg}</p>
      )}

      {/* Quick Curated Presets Bar (Hidden unless explicitly enabled) */}
      {showPresets && presets && presets.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Presets & Quick Picks
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presets.map((preset) => {
              const isCurrent = value === preset.url;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isCurrent
                      ? "border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-900/10"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#151921] hover:border-neutral-400"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-200 dark:border-neutral-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">
                      {preset.label}
                    </p>
                    <span className="text-[9px] text-neutral-400 block">
                      {preset.category || "Preset"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

