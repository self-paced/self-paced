import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import NewUser from './NewUser';
import Setup from './Setup';

const CHECK_APP = gql`
  query CheckApp {
    checkApp
  }
`;

const AuthGuard: React.FC = ({ children }) => {
  const { data: session, status } = useSession();
  const { loading, error, data } = useQuery<{ checkApp: boolean }>(CHECK_APP);
  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error Initializing the app!</div>;
  }

  if (data.checkApp === false) {
    return <Setup />;
  }

  if (session && session.isRegistered === false) {
    return <NewUser />;
  }

  return <>{children}</>;
};

export default AuthGuard;
