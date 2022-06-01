import '../styles/globals.scss';
import type { AppProps } from 'next/app';
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
      <SessionProvider session={session}>
        <SelfPacedProvider>
          <Component {...pageProps} />
        </SelfPacedProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
