import { Box } from '@mui/material';
import CustomAppBar from './CustomAppBar';

type Props = {
  children?: React.ReactNode;
  fullWidth?: boolean;
  noScroll?: boolean;
};

const PageFrame: React.FC<Props> = ({ children, fullWidth, noScroll }) => {
  return (
    <>
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
    </>
  );
};

export default PageFrame;
