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
  ListItemText
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
    { label: 'Admin Panel', path: '/admin', icon: <AdminIcon fontSize="small" /> }
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', zIndex: 1100 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 58, md: 70 }, justifyContent: 'space-between', gap: 1 }}>
          
          {/* Mobile Menu Icon & Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="open mobile navigation menu" 
              onClick={(e) => {
                e.currentTarget.blur();
                setMobileOpen(true);
              }}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#111111', p: 1 }}
            >
              <MenuIcon fontSize="medium" />
            </IconButton>

            {/* Brand Logo & Name */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                textDecoration: 'none',
                color: '#111111',
                userSelect: 'none'
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="ZYNVO STORE Logo"
                sx={{
                  width: { xs: 34, sm: 38, md: 44 },
                  height: { xs: 34, sm: 38, md: 44 },
                  objectFit: 'contain',
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 900,
                  letterSpacing: { xs: '0.04em', sm: '0.07em' },
                  color: '#111111',
                  fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.45rem' },
                  textTransform: 'uppercase',
                  lineHeight: 1
                }}
              >
                ZYNVO STORE
              </Typography>
            </Box>
          </Box>

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

          {/* Mobile Right Icons */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              aria-label="Search catalog"
              onClick={() => navigate('/products')}
              sx={{ color: '#111111', p: 1 }}
            >
              <SearchIcon fontSize="medium" />
            </IconButton>
            <IconButton 
              aria-label="Admin panel"
              onClick={() => navigate('/admin')}
              sx={{ color: '#111111', p: 1 }}
            >
              <AdminIcon fontSize="medium" />
            </IconButton>
          </Box>

        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer with aria-hidden fix */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
          disableRestoreFocus: true
        }}
        PaperProps={{
          sx: { width: 290, p: 2.5, display: 'flex', flexDirection: 'column' }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ width: 34, height: 34, objectFit: 'contain', borderRadius: '6px' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.04em', fontSize: '1.1rem' }}>
              ZYNVO STORE
            </Typography>
          </Box>
          <IconButton 
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)} 
            size="small"
          >
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
            py: 0.8,
            mb: 2.5
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

        <List disablePadding>
          {navLinks.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                to={item.path} 
                onClick={() => setMobileOpen(false)}
                sx={{ 
                  borderRadius: '8px',
                  backgroundColor: location.pathname === item.path ? '#F3F4F6' : 'transparent',
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  py: 1.2
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', color: '#111111' }}>
                  {item.icon}
                </Box>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
