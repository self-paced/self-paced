import { inferAsyncReturnType } from '@trpc/server';
import { PrismaClient } from '@prisma/client';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

const prisma = new PrismaClient();

// 各リクエストの作られます
export const createContext = ({ req, res }: CreateNextContextOptions) => {
  return {
    req,
    res,
    prisma,
  };
};
export type Context = inferAsyncReturnType<typeof createContext>;
