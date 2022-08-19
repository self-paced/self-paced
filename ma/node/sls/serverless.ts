import type { AWS } from '@serverless/typescript';
import trpc from '@functions/trpc';
import { allConfigs } from '@libs/config';
import { SLSVPC } from '@libs/helpers/serverlessHelper';

const serverlessConfiguration: AWS = {
  service: 'sls',
  frameworkVersion: '3',
  useDotenv: true,
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
    config: allConfigs,
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
    vpc: '${self:custom.config.${self:custom.stage}.vpc}' as unknown as SLSVPC,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_ENV:
        '${self:custom.config.${self:custom.stage}.NODE_ENV, "production"}',
      ENV: '${self:custom.stage}',
      REGION: '${self:custom.region}',
      DATABASE_URL:
        'mysql://${self:custom.config.${self:custom.stage}.dbUser}:${self:custom.config.${self:custom.stage}.dbPassword}@${self:custom.config.${self:custom.stage}.dbEndpoint}:${self:custom.config.${self:custom.stage}.dbPort}/${self:custom.config.${self:custom.stage}.database}',
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
