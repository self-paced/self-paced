import { AwsLambdaVpcConfig } from '@serverless/typescript';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  LINE_TOKEN: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  VPC_SUBNETS: z.string().min(1),
  VPC_SECURITY_GROUPS: z.string().min(1),
  DB_ENDPOINT: z.string().min(1),
  DB_PORT: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(_env.error.format(), null, 4)
  );
  process.exit(1);
}

const vpc: AwsLambdaVpcConfig = {
  subnetIds: _env.data.VPC_SUBNETS.split(','),
  securityGroupIds: _env.data.VPC_SECURITY_GROUPS.split(','),
};

const config = {
  nodeEnv: _env.data.NODE_ENV,
  vpc,
  dbEndpoint: _env.data.DB_ENDPOINT,
  dbName: _env.data.DB_NAME,
  dbPort: parseInt(_env.data.DB_PORT),
  dbUser: _env.data.DB_USER,
  dbPassword: _env.data.DB_PASSWORD,
  lineToken: _env.data.LINE_TOKEN,
  nextAuthSecret: _env.data.NEXTAUTH_SECRET,
} as const;

export default config;
