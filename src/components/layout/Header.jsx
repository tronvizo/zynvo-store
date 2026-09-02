import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Menu as MenuIcon, 
  AdminPanelSettingsOutlined as AdminIcon,
  StorefrontOutlined as StoreIcon,
  HomeOutlined as HomeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
    { label: 'All Products', path: '/products', icon: <StoreIcon fontSize="small" /> },
    { label: 'Admin', path: '/admin', icon: <AdminIcon fontSize="small" /> }
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, justifyContent: 'space-between', gap: 2 }}>
          
          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu" 
              onClick={() => setMobileOpen(true)}
              sx={{ color: '#111111' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Brand Name Text Only (No logo image/icon per PRD §5.1) */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#111111',
              textDecoration: 'none',
              fontSize: { xs: '1.25rem', sm: '1.45rem' },
              textTransform: 'uppercase',
              userSelect: 'none',
              '&:hover': {
                opacity: 0.85
              }
            }}
          >
            ZYNVO STORE
          </Typography>

          {/* Desktop Search Bar */}
          <Box 
            component="form" 
            onSubmit={handleSearchSubmit}
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              backgroundColor: '#F3F4F6', 
              borderRadius: '24px', 
              px: 2, 
              py: 0.5,
              width: { md: 320, lg: 420 },
              border: '1px solid transparent',
              transition: 'all 0.2s',
              '&:focus-within': {
                backgroundColor: '#FFFFFF',
                borderColor: '#111111',
                boxShadow: '0 0 0 2px rgba(17,17,17,0.08)'
              }
            }}
          >
            <SearchIcon sx={{ color: '#6B7280', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search products, gear, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: '100%', fontSize: '0.9rem', color: '#111111' }}
            />
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: location.pathname === '/' ? '#111111' : '#4B5563',
                fontWeight: location.pathname === '/' ? 700 : 500,
                fontSize: '0.92rem',
                borderBottom: location.pathname === '/' ? '2px solid #111111' : '2px solid transparent',
                borderRadius: 0,
                px: 1.5,
                py: 1
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/products"
              sx={{
                color: location.pathname === '/products' ? '#111111' : '#4B5563',
                fontWeight: location.pathname === '/products' ? 700 : 500,
                fontSize: '0.92rem',
                borderBottom: location.pathname === '/products' ? '2px solid #111111' : '2px solid transparent',
                borderRadius: 0,
                px: 1.5,
                py: 1
              }}
            >
              All Products
            </Button>
            <Button
              component={Link}
              to="/admin"
              variant="outlined"
              startIcon={<AdminIcon fontSize="small" />}
              sx={{
                ml: 1,
                borderColor: '#E5E7EB',
                color: '#111111',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#111111',
                  backgroundColor: '#F9FAFB'
                }
              }}
            >
              Admin Panel
            </Button>
          </Box>

          {/* Mobile Search Icon Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.5 }}>
            <IconButton 
              onClick={() => navigate('/products')}
              sx={{ color: '#111111' }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton 
              onClick={() => navigate('/admin')}
              sx={{ color: '#111111' }}
            >
              <AdminIcon />
            </IconButton>
          </Box>

        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: 280, p: 2, display: 'flex', flexDirection: 'column' }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
            ZYNVO STORE
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Mobile Search Input */}
        <Box 
          component="form" 
          onSubmit={handleSearchSubmit}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#F3F4F6', 
            borderRadius: '8px', 
            px: 1.5, 
            py: 0.75,
            mb: 2
          }}
        >
          <SearchIcon sx={{ color: '#6B7280', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '100%', fontSize: '0.9rem' }}
          />
        </Box>

        <List>
          {navLinks.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                to={item.path} 
                onClick={() => setMobileOpen(false)}
                sx={{ 
                  borderRadius: '8px',
                  backgroundColor: location.pathname === item.path ? '#F3F4F6' : 'transparent',
                  fontWeight: location.pathname === item.path ? 700 : 500
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', color: '#111111' }}>
                  {item.icon}
                </Box>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.95rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
