import {
  AppBar,
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import * as react from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const CustomAppBar: react.FC = () => {
  const { data: session, status } = useSession();

  return (
    <AppBar position="sticky" elevation={1} color="default">
      <Toolbar>
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
          <Link href="/" passHref>
            <Typography
              sx={{ cursor: 'pointer' }}
              variant="h6"
              noWrap
              component="div"
            >
              SelfPaced
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
          {session?.user.isAdmin && (
            <Link href="/admin" passHref>
              <Button variant="contained">Admin</Button>
            </Link>
          )}
          {status === 'authenticated' && (
            <Button onClick={() => signOut()}>Sign Out</Button>
          )}
          {status === 'unauthenticated' && (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
          <IconButton size="large" onClick={() => {}} color="inherit">
            <Avatar />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
