import { env } from '../../libs/config/env';
import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

// todo prismaを使用するときにコメントアウトを外す
//import { PrismaClient } from '@prisma/client';
//const prisma = new PrismaClient();

interface JWT {
  sub: string;
  email: string;
  ecfToken: string;
}

// 各リクエストの作られます
export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  const token = req.cookies['next-auth.session-token'];
  const jwtPayload = jwt.verify(token, env.NEXTAUTH_SECRET) as JWT;
  if (!jwtPayload)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  return {
    req,
    res,
    jwt: jwtPayload,
    // prisma,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;
