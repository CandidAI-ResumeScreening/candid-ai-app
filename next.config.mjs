/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["vercel.blob.store"],
  },
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // This will ignore all ESLint errors during build
  },
};

export default nextConfig;
