import {
  Drawer,
  Icon,
  List,
  ListItemIcon,
  MenuItem,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import * as react from 'react';

interface MenuItem {
  name: string;
  icon: string;
  to: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Courses', icon: 'dynamic_feed', to: '#' },
  { name: 'Users', icon: 'people', to: '#' },
];

export const SIDE_BAR_WIDTH = 220;

const AdminSideBar: react.FC = () => {
  return (
    <Drawer
      sx={{
        width: SIDE_BAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDE_BAR_WIDTH,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={true}
    >
      <List>
        {MENU_ITEMS.map((item) => (
          <Link key={item.name} href={item.to} passHref>
            <MenuItem>
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
              <Typography noWrap>{item.name}</Typography>
            </MenuItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSideBar;
