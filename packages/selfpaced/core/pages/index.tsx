import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

export const RenderPage: React.FC<{ themes: any }> = ({ themes, children }) => {
  const router = useRouter();
  if (!router) return null;
  const req = getPagePath((router.query?.sppage as string[]) ?? ['']);
  const Page = dynamic<{
    Theme?: React.FC;
    params: { [key: string]: string };
  }>(() =>
    import(`${req.path}`).catch(() => {
      return function Error() {
        return <div>Page Not Found</div>;
      };
    })
  );
  return (
    <Page Theme={themes[req.path]} params={req.params}>
      {children}
    </Page>
  );
};

const PAGES: Readonly<{ [key: string]: string }> = Object.freeze({
  '/': './lp',
  '/admin': './admin',
  '/admin/course/[id]': './admin/course/[id]',
  '/aaa': './aaa',
  '/bbb': './bbb',
  '/course/[id]': './course/[id]',
});

const getPagePath = (reqPage: string[]) => {
  let params: { [key: string]: string } = {};
  const path = Object.keys(PAGES).find((path) => {
    const splittedPath = path.slice(1).split('/');
    if (splittedPath.length !== reqPage.length) return false;
    const localParams: { [key: string]: string } = {};
    for (const i in splittedPath) {
      const paramMatch = splittedPath[i].match(/\[(.+)\]/);
      if (paramMatch) {
        localParams[paramMatch[1]] = reqPage[i];
        continue;
      }
      if (splittedPath[i] !== reqPage[i]) return false;
    }
    params = localParams;
    return true;
  });
  return { path: PAGES[path!] ?? '/not-found', params };
};
