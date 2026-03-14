/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
	},
	experimental: {
		optimizePackageImports: ["lucide-react"],
	},
	// Enable standalone output for Docker
	output: "standalone",
};

module.exports = nextConfig;
