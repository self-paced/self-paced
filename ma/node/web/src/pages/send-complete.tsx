import type { NextPage } from 'next';
import {
  Card,
  CardHead,
  CardBody,
  Button,
} from '@super_studio/ecforce_ui_albers';
import Link from 'next/link';

const Page: NextPage = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-[32rem]">
        <div>
          <Card>
            <CardHead>配信リクエストが完了しました。</CardHead>
            <CardBody>
              <Link href="/line-message" passHref>
                <Button>配信画面へ戻る</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
