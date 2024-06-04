/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "api.airso.id", "gunbasa-api.digibay.id"], // Add your domain here
  },
  output: "standalone",
};

module.exports = nextConfig;
