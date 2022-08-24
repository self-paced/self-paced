import { env } from '../../libs/config/env';
import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { decode, JWT } from 'next-auth/jwt';

// todo prismaを使用するときにコメントアウトを外す
//import { PrismaClient } from '@prisma/client';
//const prisma = new PrismaClient();

const PUBLIC_PATHS = ['/auth.signInWithCookie'];

// 各リクエストの作られます
export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  let jwtPayload;
  if (PUBLIC_PATHS.includes(req.url)) {
    jwtPayload = null;
  } else {
    const token =
      env.NODE_ENV === 'development'
        ? req.cookies['next-auth.session-token']
        : req.cookies['__Secure-next-auth.session-token'];
    jwtPayload = await decode({
      token,
      secret: env.NEXTAUTH_SECRET,
    });
    if (!jwtPayload)
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid JWT' });
  }
  return {
    req,
    res,
    jwt: jwtPayload as JWT,
    // prisma,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;
