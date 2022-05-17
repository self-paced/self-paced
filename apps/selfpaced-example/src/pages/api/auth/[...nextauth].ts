import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { initDataSource } from '../../../db/data-source';
import { User } from '../../../db/entity/User';

const _topAwait = await initDataSource(); // WebPack bug: top level await only works when assigning to variable.

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
        }
        const user = await User.findOneBy({ email: token.email! });
        token.isRegistered = !!user;
        return token;
      },
      async session({ session, token }) {
        session.isRegistered = token.isRegistered;
        return session;
      },
    },
  });
}
