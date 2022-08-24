import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import ecforceApi from '../../../libs/helpers/ecforceApi';

const JWTSchema = z.object({
  id: z.number(),
  email: z.string(),
  ecfToken: z.string(),
});

type JWT = z.infer<typeof JWTSchema>;

const auth = createRouter().mutation('signInWithCookie', {
  input: z.object({}).optional(),
  output: JWTSchema,
  resolve: async ({ ctx }) => {
    try {
      const ecfUser = await ecforceApi.signInWithCookie(ctx);
      const jwt: JWT = {
        id: ecfUser.id,
        email: ecfUser.email,
        ecfToken: ecfUser.authentication_token,
      };
      return jwt;
    } catch (e) {
      console.error(e);
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'error' });
    }
  },
});

export default auth;
