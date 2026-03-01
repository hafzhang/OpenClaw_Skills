import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 明确设置生产环境的基础 URL
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://www.clawtools.dev',
  },
};

export default nextConfig;
