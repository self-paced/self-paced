const withTM = require('next-transpile-modules')(['ui', 'selfpaced']);
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  webpack: (config, options) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
    );
    return config;
  },
});

module.exports = nextConfig;
