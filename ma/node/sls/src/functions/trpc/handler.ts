import { createContext } from './context';
import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AppRouter, appRouter } from './routers';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: (_origin, callback) => {
      callback(null, true);
    },
  })
);

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware<AppRouter>({
    router: appRouter,
    createContext,
  })
);

app.get('/cv', async (req, res) => {
  console.log('query', req.query);
  const account = await prisma.account.create({
    data: {
      projectId: 'local2',
    },
  });
  // const messages = await prisma.account.findFirst({
  //   where: {
  //     projectId: 'local',
  //   },
  // });
  // console.log('messages', messages);
  res.send('Hello World!');
});

export const main: Handler = serverlessExpress({ app });
