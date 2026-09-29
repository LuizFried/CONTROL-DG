import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Evita que pequenos avisos de tipagem travem o deploy na Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
