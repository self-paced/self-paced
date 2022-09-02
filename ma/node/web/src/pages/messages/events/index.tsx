import type { NextPage } from 'next';
import { useState } from 'react';
import Table from '../../../components/Table';
import { Button, TextLink } from '@super_studio/ecforce_ui_albers';
import { trpc } from '../../../utils/trpc';
import Link from 'next/link';
import { formatDateTime, formatDecimals } from '../../../utils/formatter';

const Home: NextPage = () => {
  const perPage = 50;
  const [page, setPage] = useState(1);
  const res = trpc.useQuery(['message.list', { page, perPage }]);

  if (res.error) {
    return <div>Error: {res.error.message}</div>;
  }
  if (!res.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table
        data={res.data.messages}
        columnDefs={[
          {
            field: 'title',
            title: '配信名',
            render: (row) => (
              <Link href={`/messages/events/${row.id}`} passHref>
                <TextLink>{row.title}</TextLink>
              </Link>
            ),
          },
          {
            field: 'createdAt',
            title: '配信日時',
            render: (row) => formatDateTime(row.createdAt),
          },
          {
            field: 'type',
            title: '配信種別',
          },
          {
            field: 'sendCount',
            title: '配信数',
          },
          // TODO: 開封の実装ができたらコメントアウトを外す
          // {
          //   field: 'readCount',
          //   title: '開封数（開封率）',
          //   render: (row) =>
          //     `${row.readCount}（${row.readCount / (row.sendCount || 1) * 100}%）`,
          // },
          {
            field: 'uniqClickCount',
            title: 'クリック数（クリック率）',
            render: (row) =>
              `${row.uniqClickCount}（${formatDecimals(
                (row.uniqClickCount / (row.sendCount || 1)) * 100
              )}%）`,
          },
          {
            field: 'orderCount',
            title: '受注数',
          },
          {
            field: 'orderTotal',
            title: '受注金額',
            render: (row) => `${row.orderTotal}円`,
          },
        ]}
        onSort={(sortData) => {
          console.log(sortData);
        }}
        page={page}
        pageSize={perPage}
        totalItems={res.data.meta.count}
        onPageChange={(page) => setPage(page)}
      />
    </div>
  );
};

export default Home;
