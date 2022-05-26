import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { initDataSource } from '../db/data-source';
import { User } from '../db/entity/User';
import { comparePasswords } from '../../helpers/authHelper';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  await initDataSource();
  return await NextAuth(req, res, {
    theme: {
      colorScheme: 'light',
    },
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials, req) {
          const user = await User.findOneBy({
            email: credentials?.email ?? '',
          });

          if (
            user &&
            (await comparePasswords(credentials?.password ?? '', user.password))
          ) {
            return {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              isAdmin: user.isAdmin,
            };
          } else {
            return null;
          }
        },
      }),
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
        token.isAdmin = user?.isAdmin ?? false;
        return token;
      },
      async session({ session, token }) {
        session.isRegistered = token.isRegistered;
        session.user.isAdmin = token.isAdmin;
        return session;
      },
    },
  });
}
