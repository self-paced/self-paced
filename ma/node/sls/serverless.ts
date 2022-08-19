import type { AWS } from '@serverless/typescript';
import trpc from './src/functions/trpc';
import config from './src/libs/config';

const serverlessConfiguration: AWS = {
  service: 'sls',
  frameworkVersion: '3',
  useDotenv: true,
  package: {
    individually: true,
  },
  custom: {
    stage: '${opt:stage, "local"}',
    config: {
      local: {
        NODE_ENV: 'development',
      },
    },
    region: '${env:AWS_REGION}',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceExclude: 'aws-sdk',
      },
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: '${self:custom.region}' as any,
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    vpc: config.vpc,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_ENV:
        '${self:custom.config.${self:custom.stage}.NODE_ENV, "production"}',
      ENV: '${self:custom.stage}',
      REGION: '${self:custom.region}',
      DATABASE_URL: `mysql://${config.dbUser}:${config.dbPassword}@${config.dbEndpoint}:${config.dbPort}/${config.dbName}`,
      LINE_TOKEN: '${env:LINE_TOKEN}',
      NEXTAUTH_SECRET: '${env:NEXTAUTH_SECRET}',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    trpc,
  },
};

module.exports = serverlessConfiguration;
