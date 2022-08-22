import type { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { useDialog } from '../components/AppUtilityProvider/DialogProvider';
import CustomButton from '../components/CustomButton';
import Table from '../components/Table';
import { Badge, TextLink } from '@super_studio/ecforce_ui_albers';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  // サンプルクエリー
  const users = trpc.useQuery(['user.list', { name: 'test' }]);
  const showDialog = useDialog();
  const [page, setPage] = useState(1);

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
      <Table
        data={[
          { header1: 'aa', header2: 'header2', header3: 'header3' },
          { header1: 'header1', header2: 'vv', header3: 'header3' },
          { header1: 'header1', header2: 'header2', header3: 'cc' },
        ]}
        columnDefs={[
          { field: 'header1' },
          {
            field: 'header2',
            sortable: true,
            render: (row) => <Badge status="success" label={row.header2} />,
          },
          {
            field: 'header3',
            sortable: true,
            render: (row) => <TextLink href="#">{row.header3}</TextLink>,
          },
        ]}
        onSort={(sortData) => {
          console.log(sortData);
        }}
        page={page}
        pageSize={10}
        totalItems={100}
        onPageChange={(page) => setPage(page)}
      />
    </div>
  );
};

export default Home;
