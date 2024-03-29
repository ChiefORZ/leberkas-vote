const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"lh3.googleusercontent.com",
			"googleusercontent.com",
			"basil-images-dev.s3.eu-west-1.amazonaws.com",
		],
		unoptimized: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		appDir: true,
		// serverComponentsExternalPackages: ["@prisma/client"],
	},
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack: (config, { isServer, nextRuntime }) => {
		// Avoid AWS SDK Node.js require issue
		if (isServer && nextRuntime === "nodejs")
			config.plugins.push(
				new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ }),
			);
		return config;
	},
};

module.exports = nextConfig;
