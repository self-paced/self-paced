import type { NextPage } from 'next';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { useAppSelector } from '../store/hooks';
import styles from '../styles/Home.module.scss';
import PageFrame from '../components/PageFrame';

// TODO: DELETE PAGE

const Page: NextPage = () => {
  const count = useAppSelector((state) => state.counter.count);
  return (
    <PageFrame>
      <div className={styles.main}>
        <div>Page 2</div>
        <div>{count}</div>
        <div>
          <Link href="/" passHref>
            <Button>
              <Icon>arrow_back</Icon>Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </PageFrame>
  );
};

export default Page;
