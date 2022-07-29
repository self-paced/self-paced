import { inferAsyncReturnType } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

// todo prismaを使用するときにコメントアウトを外す
//import { PrismaClient } from '@prisma/client';
//const prisma = new PrismaClient();

// 各リクエストの作られます
export const createContext =
  ({}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({
    // todo prisma を使用するときにコメントアウトを外す
    //   prisma,
  });
export type Context = inferAsyncReturnType<typeof createContext>;
