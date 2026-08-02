import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* performance: enable compression + image optimization */
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@heroicons/react", "jspdf"],
  },
};

export default nextConfig;