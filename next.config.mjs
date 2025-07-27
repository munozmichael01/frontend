/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para evitar problemas con OneDrive
  output: 'standalone',
  
  // ✅ CORREGIDO: Movido de experimental a nivel raíz para Next.js 15
  serverExternalPackages: [],
  
  // ✅ REMOVIDO: optimizeFonts ya no existe en Next.js 15
  // optimizeFonts: false, // ❌ Esta opción ya no es válida
  
  // Configuración de ESLint para ignorar errores durante la construcción
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuración de TypeScript para ignorar errores durante la construcción
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración de imágenes para evitar problemas de optimización
  images: {
    unoptimized: true,
  },
  
  // Configuración de OneDrive
  trailingSlash: false,
  
  // ✅ LIMPIADO: experimental ya no necesita serverComponentsExternalPackages
  experimental: {
    // Mantén aquí otras configuraciones experimentales si las necesitas en el futuro
  },
  
  // Configuración de webpack para evitar problemas de permisos
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;

