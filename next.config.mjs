// next.config.js (CommonJS)
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enable experimental features for better Vercel compatibility
    serverComponentsExternalPackages: [],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kiyapz.s3.eu-central-2.wasabisys.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.eu-central-2.wasabisys.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Ensure proper build output for Vercel
  output: 'standalone',
};

export default nextConfig;
