import { createContext } from './context';
import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cookieParser from 'cookie-parser';
import { AppRouter, appRouter } from './routers';
import 'next'; // こちらのエラー対応： https://github.com/nextauthjs/next-auth/discussions/4606

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware<AppRouter>({
    router: appRouter,
    createContext,
  })
);

export const main: Handler = serverlessExpress({ app });
