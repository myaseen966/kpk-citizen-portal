import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enables the Next.js "standalone" build output, which produces a minimal
  // self-contained server bundle (server.js + only the node_modules that are
  // actually required at runtime). This is purely a build/output setting —
  // it does not change any application behavior — and it lets the Docker
  // image stay small and avoids shipping the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
