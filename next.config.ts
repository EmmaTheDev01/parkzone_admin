import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL || "",
    NEXT_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_SUPABASE_PUBLISHABLE_KEY || "",
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
