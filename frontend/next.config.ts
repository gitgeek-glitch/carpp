import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["assets.aceternity.com"],
  },
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL, // This will expose the environment variable to your frontend
  },
};

export default nextConfig;
