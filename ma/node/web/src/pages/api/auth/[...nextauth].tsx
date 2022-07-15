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
