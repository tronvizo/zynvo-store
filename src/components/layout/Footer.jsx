import React from 'react';
import { Box, Container, Typography, Grid, Link as MuiLink, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto', 
        backgroundColor: '#FFFFFF', 
        borderTop: '1px solid #E5E7EB', 
        pt: 6, 
        pb: 4 
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} justifyContent="space-between">
          
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="ZYNVO STORE Logo"
                sx={{ width: 36, height: 36, objectFit: 'contain', borderRadius: '8px' }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                ZYNVO STORE
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, lineHeight: 1.6, mb: 2 }}>
              A curated catalog of premier tech gadgets, audio gear, desk setups, and everyday essentials. Discover hand-picked products with verified specifications and direct partner access.
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', lineHeight: 1.5 }}>
              Affiliate Disclosure: ZYNVO STORE is a participant in affiliate advertising programs. When you purchase products through our links, we may earn a commission at no additional expense to you.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', color: '#111111' }}>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: '#111111' } }}>
                Home
              </MuiLink>
              <MuiLink component={Link} to="/products" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: '#111111' } }}>
                All Products
              </MuiLink>
              <MuiLink component={Link} to="/products?sort=popular" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: '#111111' } }}>
                Most Popular
              </MuiLink>
              <MuiLink component={Link} to="/products?sort=new" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: '#111111' } }}>
                New Arrivals
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', color: '#111111' }}>
              Management
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/admin" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: '#111111' } }}>
                Admin Portal
              </MuiLink>
              <MuiLink component={Link} to="/admin/categories" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: '#111111' } }}>
                Categories
              </MuiLink>
              <MuiLink component={Link} to="/admin/products" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: '#111111' } }}>
                Product Inventory
              </MuiLink>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} ZYNVO STORE. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Built with React, Vite & Firebase. Static cPanel deployment ready.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
