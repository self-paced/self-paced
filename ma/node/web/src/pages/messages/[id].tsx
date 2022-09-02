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
import { formatDecimals } from '../../utils/formatter';

const Details: React.FC<{ messageId: string }> = ({ messageId }) => {
  const event = trpc.useQuery(['schedule.event', { id: messageId }]);

  if (event.error) {
    return <div>Error: {event.error.message}</div>;
  }

  if (!event.data) {
    return <div>Loading...</div>;
  }

  const messageSchedule = event.data;

  return (
    <>
      <Card>
        <CardHead>配信実績</CardHead>
        <CardBody>
          <DetailTable>
            <DetailTableRow>
              <DetailTableHeader>配信タイトル</DetailTableHeader>
              <DetailTableData>{messageSchedule.title}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>配信セグメント</DetailTableHeader>
              <DetailTableData>{messageSchedule.segmentTitle}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>配信予定日時</DetailTableHeader>
              <DetailTableData>
                {messageSchedule.deliveryScheduleAt}
              </DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>更新日時</DetailTableHeader>
              <DetailTableData>{messageSchedule.updatedAt}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>ステータス</DetailTableHeader>
              <DetailTableData>{messageSchedule.status}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>タイプ</DetailTableHeader>
              <DetailTableData>{messageSchedule.status}</DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>定期配信の有無</DetailTableHeader>
              <DetailTableData>
                {(() => {
                  if (messageSchedule.messageReccuringId != null) {
                    return <>あり</>;
                  } else {
                    return <>なし</>;
                  }
                })()}
              </DetailTableData>
            </DetailTableRow>
            <DetailTableRow>
              <DetailTableHeader>配信メッセージ</DetailTableHeader>
              <DetailTableData>
                {JSON.parse(messageSchedule.content as string).map(
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
    </>
  );
};

const Page: NextPage = () => {
  const router = useRouter();

  if (!router.query.id) {
    return <div>No id</div>;
  }

  const onHistoryback = () => {
    router.back();
  };

  return (
    <div>
      <div>
        <Details messageId={router.query.id as string} />
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
