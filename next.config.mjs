/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["vercel.blob.store"], // Allow Vercel Blob images/files
  },
  // Optional: Configure larger file uploads if needed
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
