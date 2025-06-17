/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para evitar problemas con OneDrive
  output: 'standalone',
  
  // Configuración para certificados SSL en desarrollo
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Configuración de fuentes para evitar problemas de red
  optimizeFonts: false,
  
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
