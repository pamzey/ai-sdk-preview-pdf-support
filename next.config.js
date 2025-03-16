/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Edge Runtime for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb' // Match our client-side limit
    }
  },
  // Configure routing and middleware
  async headers() {
    return [
      {
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
  // Configure API routes
  async rewrites() {
    return {
      beforeFiles: [
        // Ensure API routes are handled correctly
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig
