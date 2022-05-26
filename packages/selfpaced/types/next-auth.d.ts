import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      isAdmin: boolean;
    };
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin: boolean;
  }
}
