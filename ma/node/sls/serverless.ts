import type { AWS } from '@serverless/typescript';
import trpc from './src/functions/trpc';
import config, { env } from './src/libs/config';

const serverlessConfiguration: AWS = {
  service: 'sls',
  frameworkVersion: '3',
  package: {
    individually: true,
  },
  custom: {
    stage: '${opt:stage, "local"}',
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
      ENV: '${self:custom.stage}',
      REGION: '${self:custom.region}',
      ...env,
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    trpc,
  },
};

module.exports = serverlessConfiguration;
