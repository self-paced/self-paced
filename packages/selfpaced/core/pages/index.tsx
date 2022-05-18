import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

export const RenderPage: React.FC<{ themes: any }> = ({ themes, children }) => {
  const router = useRouter();
  if (!router) return null;
  const path = (router.query.sppage as string[]).join('/');
  const Page = dynamic<{ Theme?: React.FC }>(() =>
    import(`./${path}`).catch(() => {
      return function Error() {
        return <div>Page Not Found</div>;
      };
    })
  );
  return <Page Theme={themes[path]}>{children}</Page>;
};
