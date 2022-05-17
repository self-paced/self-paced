import { Box } from '@mui/material';
import * as react from 'react';
import CustomAppBar from './CustomAppBar';
import CustomSideBar from './CustomSideBar';

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
            flex: 10,
            display: fullWidth ? 'none' : { xs: 'none', md: 'block' },
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                top: 64,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <CustomSideBar />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 40,
            maxWidth: fullWidth ? undefined : 800,
            minWidth: 0,
            minHeight: 'calc(100vh - 64px)',
            margin: fullWidth ? 0 : { xs: 0, md: '0 20px' },
            backgroundColor: 'white',
          }}
        >
          {children}
        </Box>
        <Box
          sx={{
            flex: { sm: 5, md: 10 },
            display: fullWidth ? 'none' : { xs: 'none', sm: 'block' },
          }}
        >
          {rightContent}
        </Box>
      </Box>
    </react.Fragment>
  );
};

export default PageFrame;
