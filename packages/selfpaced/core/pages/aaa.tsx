import type { NextPage } from 'next';
import React from 'react';

const Page: NextPage<{ Theme?: React.FC }> = ({ Theme, children }) => {
  if (Theme) return <Theme></Theme>;
  return (
    <>
      <div>Page1</div>
      <div>{children}</div>
    </>
  );
};

export default Page;
