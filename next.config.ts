import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Keeps the dev "N" badge out of screenshots and demos.
  devIndicators: false,
  partialPrefetching: true,
  turbopack: {
    // Pin the root: a stray lockfile in the home folder would otherwise be picked up.
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
