import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {},
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'googleusercontent.com',
      'basil-images-dev.s3.eu-west-1.amazonaws.com',
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
