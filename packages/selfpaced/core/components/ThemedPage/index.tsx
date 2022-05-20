import type { NextPage } from 'next';
import React from 'react';

const ThemedPage: NextPage<{ Theme?: React.FC }> = ({ Theme, children }) => {
  if (Theme) return <Theme>{children}</Theme>;
  return <>{children}</>;
};

export default ThemedPage;
