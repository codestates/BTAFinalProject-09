/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  async redirects() {
    return [
      {
        source: '/account/:address',
        destination: '/account/:address/transactions',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
