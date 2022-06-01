import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { SelfPacedProvider } from 'selfpaced';
import React from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SelfPacedProvider>
        <Component {...pageProps} />
      </SelfPacedProvider>
    </SessionProvider>
  );
}

export default MyApp;
