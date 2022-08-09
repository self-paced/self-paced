import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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

        const url = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/trpc/auth.token`
          : 'http://localhost:4040/api/trpc/auth.token';

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
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user,
        };
      }
      return token;
    },
    async session({ session }) {
      session.user.name = 'hoge';
      session.user.isAdmin = true;
      return session;
    },
  },
};

const nextAuthHandler = NextAuth(authOptions);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('NEXT_AUTH');
  console.log(process.env.NEXTAUTH_URL);
  console.log(process.env.VERCEL_URL);
  // if (process.env.NEXTAUTH_URL) {
  //   req.headers['x-forwarded-host'] = new URL(process.env.NEXTAUTH_URL).host;
  // }

  return nextAuthHandler(req, res);
}
