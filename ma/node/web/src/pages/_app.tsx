import '../styles/globals.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import { AppRouter } from '../../../sls/src/functions/trpc/routers';
import AppUtilityProvider from '../components/AppUtilityProvider';
import { SessionProvider } from 'next-auth/react';
import AuthGuard from '../components/AuthGuard';
import Head from 'next/head';

type CustomAppProps = Omit<AppProps, 'Component'> & {
  Component: NextPage<{}, any>;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  return (
    <>
      <Head>
        <title>ecforce ma</title>
      </Head>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <AuthGuard>
          <AppUtilityProvider noFrame={Component.noFrame}>
            <Component {...pageProps} />
          </AppUtilityProvider>
        </AuthGuard>
      </SessionProvider>
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    const url =
      process.env.NODE_ENV === 'production'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}`
        : 'http://localhost:5050/local';

    ctx?.res?.setHeader('Access-Control-Allow-Origin', '*');

    return {
      url,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Header': 'Content-Type',
      },
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
  responseMeta({ clientErrors, ctx }) {
    if (clientErrors.length) {
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

    return {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    };
  },
})(MyApp);
