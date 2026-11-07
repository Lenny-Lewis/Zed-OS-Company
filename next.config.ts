import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    // 85 is for the full-screen photos on the services pages, where 75 visibly softens them.
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/photos/**',
      },
    ],
  },
};

export default nextConfig;
