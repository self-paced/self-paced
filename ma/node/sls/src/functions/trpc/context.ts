import { inferAsyncReturnType } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

// 各リクエストの作られます
export const createContext =
  ({}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({});
export type Context = inferAsyncReturnType<typeof createContext>;
