import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dutz-bkt.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "dutz.s3.amazonaws.com",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/login",
      permanent: true,
    },
  ],
};

export default nextConfig;
