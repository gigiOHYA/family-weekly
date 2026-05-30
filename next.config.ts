import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/family-weekly',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
