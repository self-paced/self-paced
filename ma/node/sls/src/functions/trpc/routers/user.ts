import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';

const user = createRouter()
  .mutation('create', {
    input: z.object({
      dummy: z.string(),
    }),
    resolve: ({ input }) => {
      // ユーザ作成
      console.log(input);
      return true;
    },
  })
  .query('list', {
    input: z.object({
      name: z.string(),
    }),
    resolve: ({ input }) => {
      // ユーザ取得
      return [input];
    },
  });

export default user;