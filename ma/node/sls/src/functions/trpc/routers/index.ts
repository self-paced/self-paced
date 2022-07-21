import { createRouter } from '../createRouter';
import line from './line';
import user from './user';
import auth from './auth';

export const appRouter = createRouter()
  .merge('line.', line)
  .merge('user.', user)
  .merge('auth.', auth);
// APIの型定義をExport
export type AppRouter = typeof appRouter;
