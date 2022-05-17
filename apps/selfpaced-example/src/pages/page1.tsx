import type { NextPage } from 'next';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { counterActions } from '../store/slices/counterSlice';
import { gql, useQuery } from '@apollo/client';
import PageFrame from '../components/PageFrame';

// TODO: DELETE PAGE

const query = gql`
  query Me {
    me {
      id
      firstName
      lastName
    }
  }
`;

const Page: NextPage = () => {
  const count = useAppSelector((state) => state.counter.count);
  const dispatch = useAppDispatch();

  const { loading, error, data } = useQuery(query);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <PageFrame>
      <div>Page 1</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>{count}</div>
      <div>
        <Button onClick={() => dispatch(counterActions.increment())}>
          <Icon>add</Icon>
        </Button>
      </div>
      <Link href="/" passHref>
        <Button>
          <Icon>arrow_back</Icon>Back to Home
        </Button>
      </Link>
    </PageFrame>
  );
};

export default Page;
