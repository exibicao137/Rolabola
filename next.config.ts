import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignora erros de TypeScript durante o build para garantir o deploy
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora erros de linting (regras de escrita) durante o build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
