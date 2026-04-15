import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  transpilePackages: ["@vietmap/vietmap-gl-js"],
  async rewrites() {
    return [
      {
        source: "/api/maps/vietmap/:path*",
        destination: "https://maps.vietmap.vn/:path*",
      },
    ];
  },
};

export default nextConfig;
