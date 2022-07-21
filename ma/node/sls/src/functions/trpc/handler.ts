import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import { createContext } from './context';
import { appRouter } from './routers';

export const main = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
