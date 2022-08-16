import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getToken } from 'next-auth/jwt';

// todo prismaを使用するときにコメントアウトを外す
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 各リクエストの作られます
export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const jwt = await getToken({ req });
  if (!jwt)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  return {
    req,
    res,
    jwt,
    prisma,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;
