import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { decode } from 'next-auth/jwt';

import { PrismaClient } from '@prisma/client';
import config from '../../libs/config';
const prisma = new PrismaClient();

// 各リクエストの作られます
export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const token = req.cookies['next-auth.session-token'];
  const jwtPayload = await decode({
    token,
    secret: config.nextAuthSecret,
  });
  if (!jwtPayload)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  return {
    req,
    res,
    prisma,
    jwt: jwtPayload,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;
