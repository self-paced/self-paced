import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  // サンプルクエリー
  const users = trpc.useQuery(['user.list', { name: 'test' }]);
  if (users.error) {
    return <div>Error: {users.error.message}</div>;
  }
  if (!users.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <pre>{JSON.stringify(users.data, null, 2)}</pre>
    </div>
  );
};

export default Home;
