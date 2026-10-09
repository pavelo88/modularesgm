import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // <-- El dominio de Firebase agregado
        port: '',
        pathname: '/**',
      },
      {
        // Imágenes del catálogo GM subidas a Storage como objetos públicos (catalog/...).
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/mgm-68c65.firebasestorage.app/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pelikano.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cosentino.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.briggsec.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:; frame-ancestors 'self';" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/banos', destination: '/muebles-bano', permanent: true },
      { source: '/ba%C3%B1os', destination: '/muebles-bano', permanent: true },
      { source: '/bano', destination: '/muebles-bano', permanent: true },
      { source: '/cocina', destination: '/cocinas', permanent: true },
      { source: '/closet', destination: '/closets', permanent: true },
      { source: '/oficina', destination: '/muebles-oficina', permanent: true },
      { source: '/puerta', destination: '/puertas', permanent: true },
      { source: '/escritorio', destination: '/escritorios', permanent: true },
    ];
  },
};

export default nextConfig;