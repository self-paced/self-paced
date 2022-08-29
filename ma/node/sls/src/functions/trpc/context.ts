import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { decode, JWT } from 'next-auth/jwt';

import { PrismaClient } from '@prisma/client';
import config from '../../libs/config';
const prisma = new PrismaClient();

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
      config.nodeEnv === 'development'
        ? req.cookies['next-auth.session-token']
        : req.cookies['__Secure-next-auth.session-token'];
    jwtPayload = await decode({
      token,
      secret: config.nextAuthSecret,
    });
    console.log('JWT Payload:', jwtPayload);
    if (!jwtPayload)
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid JWT' });
  }
  return {
    req,
    res,
    jwt: jwtPayload as JWT,
    prisma,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;
