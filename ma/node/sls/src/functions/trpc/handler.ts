import { createContext } from './context';
import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AppRouter, appRouter } from './routers';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware<AppRouter>({
    router: appRouter,
    createContext,
  })
);

export const main: Handler = serverlessExpress({ app });
