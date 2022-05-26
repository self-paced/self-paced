import '../styles/globals.scss';
import { Provider } from 'react-redux';
import { store } from '../store';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '../graphql/client';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { SelfPacedProvider } from 'selfpaced';
import React from 'react';

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
          <SelfPacedProvider>
            <Provider store={store}>
              <Component {...pageProps} />
            </Provider>
          </SelfPacedProvider>
        </SessionProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default MyApp;
