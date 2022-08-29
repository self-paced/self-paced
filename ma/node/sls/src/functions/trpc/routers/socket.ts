import { createRouter } from '../createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const socket = createRouter().query('cv', {
  input: z.object({
    number: z.string().min(1),
    hey: z.string().min(1),
  }),
  resolve: async ({ input }) => {
    return await input;
  },
});

export default socket;
