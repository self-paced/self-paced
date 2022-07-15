import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../../../sls/src/functions/trpc/routers';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}
