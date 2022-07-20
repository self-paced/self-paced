import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const auth = createRouter().mutation('token', {
  input: z.object({
    token: z.string(),
    domain: z.string(),
  }),
  resolve: ({ input }) => {
    if (input.token == 'hoge') {
      return {
        status: 200,
        message: 'success',
      };
    } else {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'error' });
    }
  },
});

export default auth;
