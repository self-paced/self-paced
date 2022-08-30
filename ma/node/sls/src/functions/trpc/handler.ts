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

// todo エラーが出たのでコメントアウトしてます。
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
  const url = new URL(dbLink.originalLink);
  url.searchParams.append('_ecfma', linkShortId);
  res.redirect(url.toString());
});

/**
 * Socket通信のCVエンドポイント
 * パラメータを受け取り、DBに保存します。
 */
app.post('/cv', async (req, res) => {
  const { _ecfma, order_id, order_number, total_price } = req.query;
  const linkId = shortTranslator.toUUID(_ecfma as string);

  const dbLink = await prisma.userMessageLink.findUnique({
    where: {
      id: linkId,
    },
  });

  if (!dbLink) {
    console.error('link not found', req.query);
    res.json('Not found');
    return;
  }

  await prisma.userMessageLinkActivity.create({
    data: {
      userMessageLink: {
        connect: {
          id: linkId,
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
