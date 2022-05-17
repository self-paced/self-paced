import { Icon, List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import Link from 'next/link';
import * as react from 'react';

interface MenuItem {
  name: string;
  icon: string;
  to: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Item1', icon: 'dynamic_feed', to: '#' },
  { name: 'Item2', icon: 'people', to: '#' },
  { name: 'Item3', icon: 'event', to: '#' },
  { name: 'Item4', icon: 'golf_course', to: '#' },
  { name: 'Item5', icon: 'recommend', to: '#' },
  { name: 'Item6', icon: 'groups', to: '#' },
];

const CustomSideBar: react.FC = () => {
  return (
    <List sx={{ maxWidth: '100%' }}>
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
  );
};

export default CustomSideBar;
