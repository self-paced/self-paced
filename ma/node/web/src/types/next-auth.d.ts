import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: number;
    ecfToken: string;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    ecfToken: string;
  }
}
