import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/udon-shop' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/udon-shop/' : '',
};

export default nextConfig;
