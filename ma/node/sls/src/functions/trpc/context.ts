import { inferAsyncReturnType } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 各リクエストの作られます
export const createContext =
  ({}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({
    prisma,
  });
export type Context = inferAsyncReturnType<typeof createContext>;
