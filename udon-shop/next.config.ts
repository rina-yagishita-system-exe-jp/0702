import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/0702' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/0702/' : '',
};

export default nextConfig;
