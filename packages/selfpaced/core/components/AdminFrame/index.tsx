import { Box, Button, CssBaseline, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { createTheme, ThemeProvider } from '@mui/material';
import Link from 'next/link';
import AdminAppBar from './AdminAppBar';
import AdminSideBar, { SIDE_BAR_WIDTH } from './AdminSideBar';
import { teal } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: teal,
    background: {
      default: teal[50],
    },
  },
});

interface Props {
  children?: React.ReactNode;
}

const AdminFrame: React.FC<Props> = ({ children }) => {
  const { data: session } = useSession({ required: true });
  if (!session?.user.isAdmin) return <NotAuthorized />;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <AdminAppBar />
        <AdminSideBar />
        <Box
          sx={{
            marginLeft: `${SIDE_BAR_WIDTH}px`,
            padding: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const NotAuthorized: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Box sx={{ margin: 'auto', textAlign: 'center' }}>
        <Typography>You are not authorized!</Typography>
        <Link href="/" passHref>
          <Button>Back to Home</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default AdminFrame;
