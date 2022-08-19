import { NextComponentType, NextPageContext } from 'next';

declare module 'next' {
  type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
    noFrame?: boolean;
  };
}
