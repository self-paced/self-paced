import type { InferGetServerSidePropsType, NextPage } from 'next';
import { serverSideClient } from '../utils/trpc';

export const getServerSideProps = async () => {
  const res = await serverSideClient.query('user.list', { name: 'test' });

  return {
    props: {
      queryRes: res,
    },
  };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  return <pre>{JSON.stringify(props.queryRes, null, 2)}</pre>;
};

export default Home;
