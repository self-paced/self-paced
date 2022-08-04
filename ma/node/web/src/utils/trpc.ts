import { createReactQueryHooks, createTRPCClient } from '@trpc/react';
import type { AppRouter } from '../../../sls/src/functions/trpc/routers';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}

/**
 * tRPC Vanilla Client
 * SSRの場合はこちらのクライアントを利用してください。
 */
export const serverSideClient = createTRPCClient<AppRouter>({
  url: 'http://localhost:4040/api/trpc',
});
