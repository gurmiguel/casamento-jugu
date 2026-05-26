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
