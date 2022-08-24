/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  basePath: process.env.BASE_PATH,
  env: {
    // パブリック環境変数（ブラウザーで取得可能）
    BASE_PATH: process.env.BASE_PATH,
  },
  redirects() {
    return [
      {
        source: '/',
        destination: '/message-events',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
