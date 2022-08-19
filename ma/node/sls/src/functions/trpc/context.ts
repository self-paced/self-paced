import { env } from '../../libs/config/env';
import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { decode } from 'next-auth/jwt';

// todo prismaを使用するときにコメントアウトを外す
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 各リクエストの作られます
export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const token = req.cookies['next-auth.session-token'];
  const jwtPayload = await decode({
    token,
    secret: env.NEXTAUTH_SECRET,
  });
  if (!jwtPayload)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  return {
    req,
    res,
    prisma,
    jwt: jwtPayload,
    // prisma,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;
