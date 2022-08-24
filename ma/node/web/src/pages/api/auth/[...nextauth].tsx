import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// todo 一旦ドメインとプロジェクトIDのマップで対応する 後々修正する
const projectIdMap = [
  {
    domain: 'localhost:4040',
    projectId: 'local',
  },
  {
    domain: 'demo35.ec-force.com',
    projectId: 'demo35',
  },
  {
    domain: 'futsuno.shop',
    projectId: 'futsunoshop',
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {},
      async authorize(_credentials, req) {
        // todo 一旦ドメインとプロジェクトIDのマップで対応する 後々修正する
        const project = projectIdMap.find(({ domain }) =>
          req.headers?.host.includes(domain)
        );

        if (process.env.NODE_ENV === 'development') {
          const user: User = {
            id: 1,
            email: 'ma@super-studio.jp',
            ecfToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            // todo 一旦ドメインとプロジェクトIDのマップで対応する 後々修正する
            projectId: project?.projectId,
          }; // local dummy user
          return user;
        }
        try {
          if (!req.headers?.origin) throw new Error('origin header not found');
          const url = `${req.headers.origin}/api/v2/admins/sign_in_with_cookie`;

          const res = await fetch(url, {
            method: 'POST',
            headers: {
              cookie: req.headers?.cookie,
            },
          });

          if (res.ok) {
            const ecfUser = await res.json();
            console.log('res: ' + ecfUser);
            const user: User = {
              id: ecfUser.id,
              email: ecfUser.email,
              ecfToken: ecfUser.authentication_token,
              // todo 一旦ドメインとプロジェクトIDのマップで対応する 後々修正する
              projectId: project?.projectId,
            };
            return user;
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
  callbacks: {
    // callback
    jwt({ token, user }) {
      user &&
        (token.ecfToken = user.ecfToken) &&
        (token.projectId = user.projectId);
      return token;
    },
  },
};

export default NextAuth(authOptions);
