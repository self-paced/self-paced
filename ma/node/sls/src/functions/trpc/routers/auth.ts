import { createRouter } from '../../trpc/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import ecforceApi, { getOrigin } from '../../../libs/helpers/ecforceApi';

const JWTSchema = z.object({
  id: z.number(),
  email: z.string(),
  ecfToken: z.string(),
  projectId: z.string(),
});

type JWT = z.infer<typeof JWTSchema>;

// todo 一旦ドメインとプロジェクトIDのマップで対応する 後々修正する
const PROJECT_ID_MAP: Readonly<{ [key: string]: string }> = Object.freeze({
  'http://localhost:4040': 'local',
  'https://demo35.ec-force.com': 'demo35',
  'https://futsuno.shop': 'futsunoshop',
});

const auth = createRouter().mutation('signInWithCookie', {
  input: z.object({}).optional(),
  output: JWTSchema,
  resolve: async ({ ctx }) => {
    try {
      const ecfUser = await ecforceApi.signInWithCookie(ctx);
      // todo 一旦ドメインとプロジェクトIDのマップで対応する 後々修正する
      const projectId = PROJECT_ID_MAP[getOrigin(ctx)];
      const jwt: JWT = {
        id: ecfUser.id,
        email: ecfUser.email,
        ecfToken: ecfUser.authentication_token,
        projectId,
      };
      return jwt;
    } catch (e) {
      console.error(e);
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'error' });
    }
  },
});

export default auth;
