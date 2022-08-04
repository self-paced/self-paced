import type { NextPage } from 'next';
import Link from 'next/link';
import { useDialog } from '../components/AppUtilityProvider/DialogProvider';
import CustomButton from '../components/CustomButton';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  // サンプルクエリー
  const users = trpc.useQuery(['user.list', { name: 'test' }]);
  const showDialog = useDialog();

  const all = trpc.useQuery(['user.all']);
  console.log(all.data);

  if (users.error) {
    return <div>Error: {users.error.message}</div>;
  }
  if (!users.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>これはAPIのレスポンスです：</div>
      <pre>{JSON.stringify(users.data, null, 2)}</pre>
      <CustomButton
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
      </CustomButton>
      <Link href="/form-example" passHref>
        <a>
          <CustomButton>Go to Form Example</CustomButton>
        </a>
      </Link>
      <Link href="/send" passHref>
        <a>
          <CustomButton>Go to Send Page</CustomButton>
        </a>
      </Link>
    </div>
  );
};

export default Home;
