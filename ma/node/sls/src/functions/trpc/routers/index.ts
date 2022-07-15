import { createRouter } from '../createRouter';
import line from './line';
import user from './user';

export const appRouter = createRouter()
  .merge('line.', line)
  .merge('user.', user);
// APIの型定義をExport
export type AppRouter = typeof appRouter;
