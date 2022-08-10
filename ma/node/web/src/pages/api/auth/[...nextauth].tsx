import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getBaseUrl } from '../../_app';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        token: { label: 'Token', type: 'text' },
        domain: { label: 'Domain', type: 'text' },
      },
      async authorize(credentials, req) {
        const payload = {
          token: credentials?.token,
          domain: credentials?.domain,
        };

        const url = `${getBaseUrl()}/api/trpc/auth.token`;

        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],

  callbacks: {
    // callback
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user,
        };
      }
      return token;
    },
    session({ session }) {
      session.user.name = 'hoge';
      session.user.isAdmin = true;
      return session;
    },
  },
};

export default NextAuth(authOptions);