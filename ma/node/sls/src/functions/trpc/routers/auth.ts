import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';

const auth = createRouter().query('me', {
  input: z.object({
    token: z.string(),
    domain: z.string(),
  }),
  resolve: ({ input }) => {
    // ユーザ取得
    return [input];
  },
});

export default auth;
