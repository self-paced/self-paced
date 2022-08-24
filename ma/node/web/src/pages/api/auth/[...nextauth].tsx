import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getTRPCUrl } from '../../_app';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(_credentials, req) {
        try {
          if (!req.headers?.origin) throw new Error('origin header not found');
          const url = `${getTRPCUrl()}/auth.signInWithCookie`;
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              origin: req.headers.origin,
              cookie: req.headers.cookie,
            },
          });

          if (res.ok) {
            return (await res.json()).result.data;
          } else {
            console.error(res);
            throw new Error('failed to authorize');
          }
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        domain: '.ec-force.com',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
  callbacks: {
    // callback
    jwt({ token, user }) {
      user && (token.ecfToken = user.ecfToken);
      return token;
    },
  },
};

export default NextAuth(authOptions);
