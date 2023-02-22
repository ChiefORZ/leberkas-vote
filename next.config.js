const withTwin = require('./config/withTwin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'googleusercontent.com',
      'basil-images-dev.s3.eu-west-1.amazonaws.com',
    ],
    unoptimized: true,
  },
  experimental: {
    appDir: true,
    // serverComponentsExternalPackages: ["@prisma/client"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
