/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["external-content.duckduckgo.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  trailingSlash: false,
};

export default nextConfig;
