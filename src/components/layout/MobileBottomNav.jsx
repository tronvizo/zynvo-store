import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  HomeOutlined as HomeIcon,
  StorefrontOutlined as StoreIcon,
  AdminPanelSettingsOutlined as AdminIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/products')) return 1;
    if (location.pathname.startsWith('/admin')) return 2;
    return 0;
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: 'block', md: 'none' },
        borderTop: '1px solid #E5E7EB',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <BottomNavigation
        showLabels
        value={getCurrentValue()}
        onChange={(event, newValue) => {
          if (newValue === 0) navigate('/');
          else if (newValue === 1) navigate('/products');
          else if (newValue === 2) navigate('/admin');
        }}
        sx={{
          height: 60,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            py: 0.5,
            color: '#6B7280',
            '&.Mui-selected': {
              color: '#111111',
              fontWeight: 700
            }
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
              fontWeight: 700
            }
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon sx={{ fontSize: 22 }} />} />
        <BottomNavigationAction label="Catalog" icon={<StoreIcon sx={{ fontSize: 22 }} />} />
        <BottomNavigationAction label="Admin" icon={<AdminIcon sx={{ fontSize: 22 }} />} />
      </BottomNavigation>
    </Paper>
  );
}
