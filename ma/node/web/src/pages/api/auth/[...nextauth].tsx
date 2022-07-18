import NextAuth, { NextAuthOptions } from 'next-auth';
import { createSSGHelpers } from '@trpc/react/ssg';
import CredentialsProvider from 'next-auth/providers/credentials';
import superjson from 'superjson';
// import { appRouter } from '../../../../../sls/src/functions/trpc/routers';
import { router } from '../trpc/[trpc]';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        token: { label: 'Token', type: 'text' },
        domain: { label: 'Domain', type: 'text' },
      },
      async authorize(credentials, req) {
        //const ssg = createSSGHelpers({
        //  router: router,
        //  transformer: superjson,
        //  ctx: {},
        //});

        //await ssg.fetchQuery('auth.me', { token: "hoge", domain: "hogehoge"});
        //console.log('state', ssg.dehydrate())

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
