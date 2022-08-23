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
} from '@super_studio/ecforce_ui_albers';
import { useRouter } from 'next/router';
import MessageType, {
  AnyMessageTypeDetails,
} from '../../components/LineMessage';

const Page: NextPage = () => {
  const router = useRouter();

  if (!router.query.id) {
    return <div>No id</div>;
  }

  const event = trpc.useQuery([
    'message.event',
    { id: String(router.query.id) },
  ]);

  if (event.error) {
    return <div>Error: {event.error.message}</div>;
  }

  if (!event.data) {
    return <div>Loading...</div>;
  }

  const onHistoryback = () => {
    router.back();
  };

  return (
    <div>
      <div className="mb-5">
        <Card>
          <CardHead>配信実績</CardHead>
          <CardBody>
            <DetailTable>
              <DetailTableRow>
                <DetailTableHeader>配信タイトル</DetailTableHeader>
                <DetailTableData>{event.data.title}</DetailTableData>
              </DetailTableRow>
              <DetailTableRow>
                <DetailTableHeader>配信セグメント</DetailTableHeader>
                <DetailTableData>{event.data.segument_title}</DetailTableData>
              </DetailTableRow>
              <DetailTableRow>
                <DetailTableHeader>配信日時</DetailTableHeader>
                <DetailTableData>{event.data.created_at}</DetailTableData>
              </DetailTableRow>
              <DetailTableRow>
                <DetailTableHeader>配信メッセージ</DetailTableHeader>
                <DetailTableData>
                  {JSON.parse(event.data.content as string).map(
                    (message: AnyMessageTypeDetails, i: number) => {
                      const MessageComponent =
                        MessageType[message.type].component;
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
      </div>
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
