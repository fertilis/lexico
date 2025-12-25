import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark Tauri modules as external packages that should not be bundled
  // These modules are only available in Tauri environment, not in browser
  serverExternalPackages: [
    "@tauri-apps/api/fs",
    "tauri-plugin-store-api",
  ],
  // Add empty turbopack config to silence the warning
  // The Function constructor approach in storages.ts prevents static analysis
  // so Turbopack won't try to resolve these modules
  turbopack: {},
};

export default nextConfig;
