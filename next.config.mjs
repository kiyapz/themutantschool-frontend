// next.config.js (CommonJS)
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.eu-central-2.wasabisys.com",
        port: "",
        // narrow to your folder if you want
        pathname: "/mutant-school/thumbnails/**",
      },
    ],
  },
};

export default nextConfig;
