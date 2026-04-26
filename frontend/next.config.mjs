/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost:8000/api/v1/:path*',
    },
  ],
};

export default nextConfig;
