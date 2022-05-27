import {
  AppBar,
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import * as react from 'react';
import { signOut } from 'next-auth/react';
import { SIDE_BAR_WIDTH } from './AdminSideBar';

const AdminAppBar: react.FC = () => {
  return (
    <AppBar
      sx={{
        width: `calc(100% - ${SIDE_BAR_WIDTH}px)`,
        marginLeft: `${SIDE_BAR_WIDTH}px`,
      }}
      position="sticky"
      elevation={0}
      color="inherit"
    >
      <Toolbar variant="dense">
        {/* Left Area */}
        <Box
          sx={{ flex: '1', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Link href="/admin" passHref>
            <Typography
              sx={{ cursor: 'pointer' }}
              variant="h6"
              noWrap
              component="div"
            >
              SelfPaced Admin
            </Typography>
          </Link>
        </Box>
        {/* Center Area */}
        <Box
          sx={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        ></Box>
        {/* Right Area */}
        <Box
          sx={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
            gap: '5px',
          }}
        >
          <Link href="/" passHref>
            <Button>Back to Home</Button>
          </Link>
          <Button onClick={() => signOut({ callbackUrl: '/' })}>
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;
