import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove basePath if deploying to root domain, or set to '/multi-select' for subdirectory
  // basePath: '/multi-select',
  trailingSlash: true,
};

export default nextConfig;
