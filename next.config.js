/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Edge Runtime for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb' // Match our client-side limit
    }
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
