import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';

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
      return {
        status: 401,
        message: 'error',
      };
    }
  },
});

export default auth;
