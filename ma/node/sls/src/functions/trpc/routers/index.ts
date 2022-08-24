import { createRouter } from '../createRouter';
import line from './line';
import user from './user';
import segment from './segment';
import publisher from './publisher';
import auth from './auth';
import message from './message';

export const appRouter = createRouter()
  .merge('line.', line)
  .merge('user.', user)
  .merge('segment.', segment)
  .merge('publisher.', publisher)
  .merge('message.', message)
  .merge('auth.', auth);
// APIの型定義をExport
export type AppRouter = typeof appRouter;
