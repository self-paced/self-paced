import { createRouter } from '../createRouter';
import { z } from 'zod';

const message = createRouter().query('event', {
  input: z.object({
    id: z.string().nullish(),
  }),
  resolve: async ({ input, ctx }) => {
    return await ctx.prisma.messageEvent.findUnique({
      where: {
        id: input.id || undefined,
      },
    });
  },
});

export default message;
