import { inferAsyncReturnType } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { prisma } from '../../db/client';

// 各リクエストの作られます
export const createContext =
  ({}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
    return prisma;
  };
export type Context = inferAsyncReturnType<typeof createContext>;
