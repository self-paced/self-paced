import NextAuth, { NextAuthOptions } from 'next-auth';
import { createSSGHelpers } from '@trpc/react/ssg';
import CredentialsProvider from 'next-auth/providers/credentials';
import { appRouter, createContext } from '../../api/trpc/[trpc]'
export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        token: { label: 'Token', type: 'text' },
        domain: { label: 'Domain', type: 'text' },
      },
      async authorize(credentials, req) {

        const transformer = superjson
        const ssg = createSSGHelpers({
          router: appRouter,
          transformer,
          ctx: createContext,
        });

         await ssg.fetchQuery('auth.me', { token: "hoge", domain: "hogehoge"});
         console.log('state', ssg.dehydrate())

        console.log(credentials);
        const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' };

        if (credentials?.token == 'hoge') {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    // redirect
    signIn: 'http://localhost:3000',
  },

  callbacks: {
    async jwt({ token }) {
      token.userRole = 'admin';
      return token;
    },
  },
};

export default NextAuth(authOptions);
