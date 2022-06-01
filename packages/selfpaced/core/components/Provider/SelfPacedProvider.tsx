import { ApolloProvider } from '@apollo/client';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import AuthGuard from '../Auth/AuthGuard';
import client from '../../api/graphql/client';

const theme = createTheme({
  palette: {
    background: {
      default: '#ECECF4',
    },
  },
});

interface Props {
  children?: React.ReactNode;
}

const SelfPacedProvider: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <AuthGuard>{children}</AuthGuard>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default SelfPacedProvider;
