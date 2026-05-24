import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  cacheComponents: true,
  cacheLife: {
    uploadedImages: {
      stale: 60 * 60, // 1 hour
      revalidate: 10, // revalidate every 10 seconds
      expire: 24 * 60 * 60, // 1 day
    },
  },
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  allowedDevOrigins: [
    '*.ngrok-free.app',
    'localhost',
  ],
}

export default nextConfig
