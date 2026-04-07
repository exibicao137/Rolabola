import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Mantemos para ignorar erros de tipo no deploy
    ignoreBuildErrors: true,
  },
  // O Next.js agora prefere que configurações de lint sejam tratadas
  // automaticamente ou via arquivo .eslintrc separado.
  // Removendo a chave 'eslint' daqui, o aviso amarelo do log some!
};

export default nextConfig;
