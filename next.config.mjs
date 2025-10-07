// next.config.js (CommonJS)
const nextConfig = {
  reactStrictMode: true,
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
};

export default nextConfig;
