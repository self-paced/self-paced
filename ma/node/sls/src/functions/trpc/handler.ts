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
app.use(express.urlencoded({ extended: true }));
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
  // DBからURLデータを取得
  const { linkShortId } = req.params;
  const linkId = shortTranslator.toUUID(linkShortId);
  const dbLink = await prisma.userMessageLink.findUnique({
    where: {
      id: linkId,
    },
    include: {
      userMessageEvent: {
        include: {
          messageEvent: {
            include: {
              account: true,
            },
          },
        },
      },
    },
  });
  if (!dbLink) {
    res.json('Not found');
    return;
  }
  const url = new URL(dbLink.originalLink);

  // Lineからのボットアクセスの場合（開封時にサムネールを取得するため）
  // user-agent: facebookexternalhit/1.1;line-poker/1.0
  if (req.headers['user-agent']?.match(/facebookexternalhit.*line-poker/)) {
    // ボットアクセスの場合は、開封日時を設定する
    await prisma.userMessageEvent.updateMany({
      data: {
        readAt: new Date(),
      },
      where: {
        lineId: dbLink.userMessageEvent.lineId,
        readAt: null,
        messageEvent: {
          account: {
            id: dbLink.userMessageEvent.messageEvent.account.id,
          },
        },
      },
    });
    res.redirect(url.toString());
    return;
  }

  // クリックからのアクセスの場合、クリックイベントを登録する
  await prisma.userMessageLinkActivity.create({
    data: {
      userMessageLinkId: linkId,
      type: 'click',
    },
  });

  // 設定URLにリダイレクトする
  url.searchParams.append('_ecfma', linkShortId);
  res.redirect(url.toString());
});

/**
 * Socket通信のCVエンドポイント
 * パラメータを受け取り、DBに保存します。
 */
app.post('/cv', async (req, res) => {
  console.log('CV start', req.body);
  const { _ecfma, order_id, order_number, total_price } = req.body;
  const linkId = shortTranslator.toUUID(_ecfma as string);

  const dbLink = await prisma.userMessageLink.findUnique({
    where: {
      id: linkId,
    },
  });

  if (!dbLink) {
    console.error('link not found', req.body);
    res.json('Not found');
    return;
  }

  console.log('CV dbLink', dbLink);

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
      content: JSON.stringify(req.body),
    },
  });

  console.log('CV received', req.body);
  res.send('success');
});

export const main: Handler = serverlessExpress({ app });
