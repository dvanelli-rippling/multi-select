import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages uses repository name as base path
  basePath: '/multi-select',
  trailingSlash: true,
};

export default nextConfig;
