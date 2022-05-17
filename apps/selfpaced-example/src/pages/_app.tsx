import '../styles/globals.scss';
import { Provider } from 'react-redux';
import { store } from '../store';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '../graphql/client';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { SessionProvider, useSession } from 'next-auth/react';
import React from 'react';
import NewUser from '../components/Auth/NewUser';

const theme = createTheme({
  palette: {
    background: {
      default: '#ECECF4',
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
          <AuthGuard>
            <Provider store={store}>
              <Component {...pageProps} />
            </Provider>
          </AuthGuard>
        </SessionProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

const AuthGuard: React.FC = ({ children }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session && session.isRegistered === false) {
    return <NewUser />;
  }

  return <>{children}</>;
};

export default MyApp;
