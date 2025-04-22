import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL("https://pleasant-okapi-183.convex.cloud/api/storage/**"),
            new URL("https://img.clerk.com/**"),
        ],
    },
};

export default nextConfig;
