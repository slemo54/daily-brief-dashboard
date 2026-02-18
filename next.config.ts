import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'export' to support API routes for Vercel cron jobs
  // output: 'export',
  // distDir: 'dist',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
