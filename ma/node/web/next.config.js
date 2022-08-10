/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.BASE_PATH,
  env: {
    // パブリック環境変数（ブラウザーで取得可能）
    BASE_PATH: process.env.BASE_PATH,
  },
  // redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/line-message',
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
