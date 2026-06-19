import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lib/gallery.ts reads filenames under public/images at build time via fs;
  // without this, Vercel's file tracer bundles those photos into the
  // serverless function itself (they're already served as static assets).
  outputFileTracingExcludes: {
    "*": ["public/images/**/*"],
  },
};

export default nextConfig;
