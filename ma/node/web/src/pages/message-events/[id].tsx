import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import {
  Card,
  CardHead,
  CardBody,
  CardFooter,
  DetailTable,
  DetailTableRow,
  DetailTableHeader,
  DetailTableData,
  Button,
  Tabs,
  Tab,
  TextLink,
} from '@super_studio/ecforce_ui_albers';
import { useRouter } from 'next/router';
import MessageType, {
  AnyMessageTypeDetails,
} from '../../components/LineMessage/MessageType';
import { useState } from 'react';
import Table from '../../components/Table';

const Targets: React.FC<{ messageId: string }> = ({ messageId }) => {
  const [page, setPage] = useState(1);
  const perPage = 30;

  const targets = trpc.useQuery([
    'message.listTargets',
    { messageId, page: 1, perPage },
  ]);

  if (targets.error) {
    return <div>Error: {targets.error.message}</div>;
  }

  if (!targets.data) {
    return <div>Loading...</div>;
  }

  return (
    <Table
      columnDefs={[
        {
          title: '顧客番号',
          field: 'userNumber',
          render: (row) => (
            <TextLink href={`/admin/customers/${row.userId}`}>
              {row.userNumber}
            </TextLink>
          ),
        },
        { title: '氏名', field: 'name' },
        { title: 'メールアドレス', field: 'email' },
        { title: 'LINE ID', field: 'lineId' },
        {
          title: '配信ステータス',
          field: 'status',
          render: (row) => (row.status === 'success' ? '成功' : '失敗'),
        },
        // TODO: 開封の対応が完成したら、コメントアウトを外す
        // {
        //   title: '開封',
        //   field: 'readAt',
        //   render: (row) => (row.readAt ? '開封済み' : '未開封'),
        // },
        {
          title: 'クリック',
          field: 'click',
          render: (row) => {
            for (const link of row.userMessageLinks) {
              for (const activity of link.UserMessageLinkActivities) {
                if (activity.type === 'click') {
                  return 'クリック済み';
                }
              }
            }
            return '未クリック';
          },
        },
        {
          title: '受注',
          field: 'cv',
          render: (row) => {
            for (const link of row.userMessageLinks) {
              for (const activity of link.UserMessageLinkActivities) {
                if (activity.type === 'cv') {
                  return '購入済み';
                }
              }
            }
            return '未購入';
          },
        },
      ]}
      data={targets.data.targets}
      page={page}
      pageSize={perPage}
      totalItems={targets.data.meta.count}
      onPageChange={(page) => setPage(page)}
    />
  );
};

const Details: React.FC<{ messageId: string }> = ({ messageId }) => {
  const event = trpc.useQuery(['message.event', { id: messageId }]);

  if (event.error) {
    return <div>Error: {event.error.message}</div>;
  }

  if (!event.data) {
    return <div>Loading...</div>;
  }

  const { messageEvent, links, ...aggregationData } = event.data;

  return (
    <>
      <Card>
        <CardHead>配信実績</CardHead>
        <CardBody>
          <DetailTable>
            <DetailTableRow>
              <DetailTableHeader>配信タイトル</DetailTableHeader>
              <DetailTableData>{messageEvent.title}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>配信セグメント</DetailTableHeader>
              <DetailTableData>{messageEvent.segmentTitle}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>配信日時</DetailTableHeader>
              <DetailTableData>{messageEvent.createdAt}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>配信メッセージ</DetailTableHeader>
              <DetailTableData>
                {JSON.parse(messageEvent.content as string).map(
                  (message: AnyMessageTypeDetails, i: number) => {
                    const MessageComponent =
                      MessageType[message.type].detailComponent;
                    return (
                      <div key={i} className="mb-5">
                        <h3 className="font-bold">メッセージ #{i + 1}</h3>
                        <MessageComponent messageDetails={message} />
                      </div>
                    );
                  }
                )}
              </DetailTableData>
            </DetailTableRow>
          </DetailTable>
        </CardBody>
      </Card>
      <div className="mb-5" />
      <Card>
        <CardHead>分析情報</CardHead>
        <CardBody>
          <DetailTable>
            <DetailTableRow>
              <DetailTableHeader>配信数</DetailTableHeader>
              <DetailTableData>{aggregationData.sendCount}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>クリック数（クリック率）</DetailTableHeader>
              <DetailTableData>{`${aggregationData.uniqClickCount}（${
                (aggregationData.uniqClickCount / aggregationData.sendCount) *
                100
              }%）`}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>受注数</DetailTableHeader>
              <DetailTableData>{aggregationData.orderCount}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>受注金額</DetailTableHeader>
              <DetailTableData>{aggregationData.orderTotal}円</DetailTableData>
            </DetailTableRow>
          </DetailTable>
        </CardBody>
      </Card>
      <div className="mb-5" />
      <Card>
        <CardHead>リンク一覧</CardHead>
        <CardBody>
          <DetailTable>
            <DetailTableRow>
              <DetailTableHeader className="font-bold">URL</DetailTableHeader>
              <DetailTableData className="font-bold">
                クリック数
              </DetailTableData>
            </DetailTableRow>
            {links.map((item) => (
              <DetailTableRow key={item.link}>
                <DetailTableHeader>{item.link}</DetailTableHeader>
                <DetailTableData>{item.clickCount}</DetailTableData>
              </DetailTableRow>
            ))}
          </DetailTable>
        </CardBody>
      </Card>
    </>
  );
};

const TABS = Object.freeze(['配信設定詳細', '配信対象者']);

const Page: NextPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  if (!router.query.id) {
    return <div>No id</div>;
  }

  const onHistoryback = () => {
    router.back();
  };

  return (
    <div>
      <div className="mb-5">
        <Tabs>
          {TABS.map((tab) => (
            <Tab
              key={tab}
              onClick={() => setSelectedTab(tab)}
              selected={tab === selectedTab}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>
      </div>
      <div>
        {selectedTab === '配信設定詳細' && (
          <Details messageId={router.query.id as string} />
        )}
        {selectedTab === '配信対象者' && (
          <Targets messageId={router.query.id as string} />
        )}
      </div>
      <div className="mb-5" />
      <Card>
        <CardFooter>
          <div className="flex justify-end m-5">
            <Button variant="basic" onClick={onHistoryback}>
              戻る
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
