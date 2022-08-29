import { createContext } from './context';
import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import shortUUID from 'short-uuid';
import { AppRouter, appRouter } from './routers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const shortTranslator = shortUUID();

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

/**
 * クッションリンク
 * こちらのURLに入ると、クリックを登録し、もとのリンク先にリダイレクトされます。
 */
app.get('/cusion/:linkShortId', async (req, res) => {
  const { linkShortId } = req.params;
  const linkId = shortTranslator.toUUID(linkShortId);
  const dbLink = await prisma.userMessageLink.findUnique({
    where: {
      id: linkId,
    },
  });
  if (!dbLink) {
    res.json('Not found');
    return;
  }
  await prisma.userMessageLinkActivity.create({
    data: {
      userMessageLinkId: linkId,
      type: 'click',
    },
  });
  const link = dbLink.originalLink;
  res.redirect(link);
});

/**
 * Socket通信のCVエンドポイント
 * パラメータを受け取り、DBに保存します。
 */
app.get('/cv', async (req, res) => {
  const { _ecfma, order_id, order_number, total_price } = req.query;

  const dbLink = await prisma.userMessageLink.findUnique({
    where: {
      id: _ecfma?.toString(),
    },
  });

  if (!dbLink) {
    res.json('Not found');
    return;
  }

  await prisma.userMessageLinkActivity.create({
    data: {
      userMessageLink: {
        connect: {
          id: _ecfma as string | undefined,
        },
      },
      type: 'cv',
      orderId: order_id?.toString(),
      orderNumber: order_number?.toString(),
      orderTotal: Number(total_price),
      content: JSON.stringify(req.query),
    },
  });

  res.send('success');
});

export const main: Handler = serverlessExpress({ app });
