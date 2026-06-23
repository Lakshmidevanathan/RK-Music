import type { NextConfig } from "next";

function getBasePath(): string {
  if (process.env.GITHUB_PAGES !== "true") return "";
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (!repo || repo.endsWith(".github.io")) return "";
  return `/${repo}`;
}

const basePath = getBasePath();

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
