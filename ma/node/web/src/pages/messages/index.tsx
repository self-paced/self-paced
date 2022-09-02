import type { NextPage } from 'next';
import { useState } from 'react';
import Table from '../../components/Table';
import { Button, TextLink } from '@super_studio/ecforce_ui_albers';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { formatDateTime } from '../../utils/formatter';

const Home: NextPage = () => {
  const perPage = 50;
  const [page, setPage] = useState(1);
  const res = trpc.useQuery(['schedule.list', { page, perPage }]);

  if (res.error) {
    return <div>Error: {res.error.message}</div>;
  }
  if (!res.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="text-right">
        <Link href="/messages/new">
          <Button variant="primary" size="medium">
            新規作成
          </Button>
        </Link>
      </div>
      <Table
        data={res.data.messages}
        columnDefs={[
          {
            field: 'title',
            title: '配信名',
            render: (row) => (
              <Link href={`/messages/${row.id}`} passHref>
                <TextLink>{row.title}</TextLink>
              </Link>
            ),
          },
          {
            field: 'segmentTitle',
            title: '配信セグメント',
          },
          {
            field: 'status',
            title: 'ステータス',
          },
          {
            field: 'type',
            title: '配信種別',
          },
          {
            field: 'deliveryScheduleAt',
            title: '配信日時',
            render: (row) => formatDateTime(row.createdAt),
          },
          {
            field: 'updatedAt',
            title: '更新日時',
            render: (row) => formatDateTime(row.updatedAt),
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
