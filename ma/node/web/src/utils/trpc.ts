import { createReactQueryHooks, createTRPCClient } from '@trpc/react';
import type { AppRouter } from '../../../sls/src/functions/trpc/routers';
import { getBaseUrl } from '../pages/_app';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}

/**
 * tRPC Vanilla Client
 * SSRの場合はこちらのクライアントを利用してください。
 */
export const serverSideClient = createTRPCClient<AppRouter>({
  url: `${getBaseUrl()}/sls/dev/trpc`,
});
