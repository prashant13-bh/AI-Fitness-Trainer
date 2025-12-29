import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias["@mediapipe/pose"] = path.resolve(
      __dirname,
      "src/lib/mediapipe-pose-shim.js"
    );
    return config;
  },
  experimental: {
    // @ts-ignore
    turbo: {
      resolveAlias: {
        "@mediapipe/pose": "./src/lib/mediapipe-pose-shim.js",
      },
    },
  },
};


export default nextConfig;


