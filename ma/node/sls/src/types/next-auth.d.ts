import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    ecfToken: string;
    projectId: string;
  }
}
