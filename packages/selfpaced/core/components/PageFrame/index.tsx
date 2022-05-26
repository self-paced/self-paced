import { Box } from '@mui/material';
import * as react from 'react';
import CustomAppBar from './CustomAppBar';

type Props = {
  rightContent?: react.ReactNode;
  fullWidth?: boolean;
  noScroll?: boolean;
};

const PageFrame: react.FC<Props> = ({
  children,
  rightContent,
  fullWidth,
  noScroll,
}) => {
  return (
    <react.Fragment>
      <CustomAppBar></CustomAppBar>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100%',
          height: noScroll ? 'calc(100vh - 64px)' : undefined, // TODO: set appbar height as variable
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: fullWidth ? undefined : 1450,
            minWidth: 0,
            minHeight: 'calc(100vh - 64px)',
            margin: fullWidth ? 0 : { xs: 0, md: '0 auto' },
          }}
        >
          {children}
        </Box>
      </Box>
    </react.Fragment>
  );
};

export default PageFrame;
