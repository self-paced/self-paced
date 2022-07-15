import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import { AppRouter } from '../../../sls/src/functions/trpc/routers';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url =
      process.env.NODE_ENV === 'production'
        ? `https://dummy.com/local`
        : 'http://localhost:5050/local';

    return {
      url,
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
