/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects() {
    return [
      {
        source: '/',
        destination: '/line-message',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
