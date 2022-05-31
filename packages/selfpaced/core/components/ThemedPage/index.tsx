import type { NextPage } from 'next';
import React from 'react';

interface Props {
  children?: React.ReactNode;
  Theme?: React.FC<{ children?: React.ReactNode }>;
}

const ThemedPage: React.FC<Props> = ({ Theme, children }) => {
  if (Theme) return <Theme>{children}</Theme>;
  return <>{children}</>;
};

export default ThemedPage;
