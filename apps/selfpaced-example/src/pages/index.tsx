import type { NextPage } from 'next';
import PageFrame from '../components/PageFrame';
import { Box } from '@mui/material';
import React from 'react';

const Page: NextPage = () => {
  return (
    <PageFrame>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '8px', p: '10px' }}
      >
        TEST
      </Box>
    </PageFrame>
  );
};

export default Page;
