import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages serves from repository name subdirectory
  basePath: '/multi-select',
  assetPrefix: '/multi-select',
  trailingSlash: true,
};

export default nextConfig;
