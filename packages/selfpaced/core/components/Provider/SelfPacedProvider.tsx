import { ApolloProvider } from '@apollo/client';
import AuthGuard from '../Auth/AuthGuard';
import client from '../../api/graphql/client';

interface Props {
  children?: React.ReactNode;
}

const SelfPacedProvider: React.FC<Props> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <AuthGuard>{children}</AuthGuard>
    </ApolloProvider>
  );
};

export default SelfPacedProvider;
