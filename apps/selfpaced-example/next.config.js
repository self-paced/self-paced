const withTM = require('next-transpile-modules')(['selfpaced']);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
});

module.exports = nextConfig;
