import type { NextPage } from 'next';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { useDialog } from '../components/AppUtilityProvider/DialogProvider';
import { trpc } from '../utils/trpc';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@super_studio/ecforce_ui_albers';

const CustomButton: React.FC<{
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  children: React.ReactNode;
}> = ({ onClick, children }) => {
  return (
    <button
      className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Home: NextPage = () => {
  const { data: session } = useSession();
  // サンプルクエリー
  const users = trpc.useQuery(['user.list', { name: 'test' }]);
  const showDialog = useDialog();

  const auth = trpc.useQuery(['auth.me', { token: 'hoge', domain: 'hoge' }]);
  console.log(auth);
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
        <p>
          <Button>success</Button>
        </p>
        <button
          className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          onClick={async () => {
            const confirmed = await showDialog({
              title: 'サンプル',
              message:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et metus eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum dapibus justo id est commodo volutpat eu at est. Proin vestibulum, dolor at condimentum pharetra, libero ante cursus arcu, eget consequat nunc nisi at arcu. Etiam dui nibh, iaculis eu volutpat luctus, commodo ac odio. Nullam eget nibh et orci accumsan egestas. Fusce quis leo leo.',
            });
            if (confirmed) {
              console.log('Confirmed!');
            } else {
              console.log('Canceled');
            }
          }}
        >
          Show Dialog
        </button>
      </div>
    );
  }
};

export default Home;
