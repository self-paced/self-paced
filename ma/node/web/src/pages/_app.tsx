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
      <SessionProvider
        session={pageProps.session}
        refetchInterval={0}
        basePath={process.env.BASE_PATH + '/api/auth'}
      >
        <AuthGuard>
          <AppUtilityProvider noFrame={Component.noFrame}>
            <Component {...pageProps} />
          </AppUtilityProvider>
        </AuthGuard>
      </SessionProvider>
    </>
  );
}

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browserの場合は、現在のURLを利用
    return process.env.BASE_PATH;
  }
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}${process.env.BASE_PATH}`; // SSRの場合はVERCELのURLを利用

  return `http://localhost:4040${process.env.BASE_PATH}`; // devの場合はlocalhostを利用
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    const url =
      process.env.NEXT_PUBLIC_TRPC_URL ?? `${getBaseUrl()}/sls/dev/trpc`; // TODO: 環境変数の自動設定

    return {
      url,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
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
})(MyApp);
