const withTwin = require('./config/withTwin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'googleusercontent.com',
      'basil-images-dev.s3.eu-west-1.amazonaws.com',
    ],
  },
  experimental: {
    appDir: true,
    // serverComponentsExternalPackages: ["@prisma/client"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
