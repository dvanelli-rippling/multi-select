import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  // Only use static export for GitHub Pages builds
  ...(isGitHubPages && {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: '/multi-select',
    assetPrefix: '/multi-select',
    trailingSlash: true,
  }),
};

export default nextConfig;
