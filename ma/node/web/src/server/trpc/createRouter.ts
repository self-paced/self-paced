import { Context } from './context';
import * as trpc from '@trpc/server';

/**
 * Context付きのルーターを作るためのヘルパー関数
 */
export function createRouter() {
  return trpc.router<Context>();
}
