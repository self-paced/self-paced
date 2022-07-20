import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Axios from 'axios';
import { redirect } from 'next/dist/server/api-utils';

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
        const url = 'http://localhost:5050/local/auth.token';

        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const user = await res.json();

        if (res.ok && user) {
          console.log('authenticate ok');
          console.log('user: ' + JSON.stringify(user.result));
          return user;
          //return 'hoge';
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
    async session({ session, token, user }) {
      // callbackを受け取ってセッションに入れようとしてるあと
      console.log('session: ' + JSON.stringify(session));
      console.log('user: ' + JSON.stringify(user));
      console.log('token: ' + JSON.stringify(token));

      session.user.hello = 'token';
      session.user.user = user;
      session.user.userRole = token.userRole;
      return session;
    },
  },
};

export default NextAuth(authOptions);
