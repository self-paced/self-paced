import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';

const line = createRouter().mutation('sendWithLineConditions', {
  input: z.object({
    age: z.number(),
    sex: z.union([z.literal('male'), z.literal('female')]),
  }),
  resolve: ({ input }) => {
    console.log('メッセージ送信中');
    return {
      ...input,
    };
  },
});

export default line;
