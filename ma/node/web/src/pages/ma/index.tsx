import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import { useSession, signIn } from 'next-auth/react';

const Index: NextPage = () => {
  const { data: session } = useSession();
  // サンプルクエリー
  const users = trpc.useQuery(['user.list', { name: 'test' }]);
  if (users.error) {
    return <div>Error: {users.error.message}</div>;
  }
  if (!users.data) {
    return <div>Loading...</div>;
  }
  if (session) {
    return (
      <div>
        <div>これはAPIのレスポンスです：</div>
        <pre>{JSON.stringify(users.data, null, 2)}</pre>
      </div>
    );
  }
};

export default Index;
