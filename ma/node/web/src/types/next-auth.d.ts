import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: number;
    ecfToken: string;
    // todo req.headers が存在しない場合は undefined 処理が入ってるので後で直す
    projectId: string | undefined;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    ecfToken: string;
  }
}
