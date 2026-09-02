import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Inventory2Outlined as ProductIcon,
  CategoryOutlined as CategoryIcon,
  Star as StarIcon,
  LogoutOutlined as LogoutIcon,
  Add as AddIcon,
  DatasetOutlined as SeedIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { getProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { seedInitialData } from '../../services/seedData';

export default function AdminDashboard() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [popularCount, setPopularCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Seed state
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProductCount(prods.length);
      setCategoryCount(cats.length);
      setPopularCount(prods.filter(p => p.isPopular).length);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const handleSeedCatalog = async () => {
    if (!window.confirm('Seed demo categories and products into Firestore?')) return;

    setSeeding(true);
    setSeedStatus('Starting catalog seed...');
    try {
      await seedInitialData((msg) => setSeedStatus(msg));
      setSnackbarMessage('Demo catalog seeded successfully!');
      await loadMetrics();
    } catch (err) {
      console.error('Seed error:', err);
      setSnackbarMessage(`Seeding error: ${err.message}`);
    } finally {
      setSeeding(false);
      setSeedStatus('');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
      {/* Header & Logout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', sm: '2rem' } }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Logged in as <strong>{user?.email || 'Administrator'}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderColor: '#D1D5DB',
              color: '#EF4444',
              borderRadius: '8px',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#EF4444',
                backgroundColor: '#FEF2F2'
              }
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: '#F3F4F6', color: '#111111' }}>
              <ProductIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Products
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#111111' }}>
                {loading ? <CircularProgress size={24} /> : productCount}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: '#F3F4F6', color: '#111111' }}>
              <CategoryIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                Categories
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#111111' }}>
                {loading ? <CircularProgress size={24} /> : categoryCount}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ p: 1.5, borderRadius: '10px', backgroundColor: '#F3F4F6', color: '#10B981' }}>
              <StarIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                Popular Features
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>
                {loading ? <CircularProgress size={24} /> : popularCount}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Navigation & Management Action Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Manage Products Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <ProductIcon sx={{ color: '#111111' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Manage Products
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add new items, upload product photos to Firebase Storage, update prices, ratings, and configure affiliate destination links.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
              <Button
                component={Link}
                to="/admin/products"
                variant="contained"
                endIcon={<ArrowIcon />}
                sx={{ backgroundColor: '#111111', borderRadius: '8px' }}
              >
                Open Products ({productCount})
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Manage Categories Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <CategoryIcon sx={{ color: '#111111' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Manage Categories
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Organize your catalog by creating and editing product categories with matching MUI icons.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
              <Button
                component={Link}
                to="/admin/categories"
                variant="contained"
                endIcon={<ArrowIcon />}
                sx={{ backgroundColor: '#111111', borderRadius: '8px' }}
              >
                Open Categories ({categoryCount})
              </Button>
            </CardActions>
          </Card>
        </Grid>

      </Grid>

      {/* Demo Data Seeder Utility Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <SeedIcon sx={{ color: '#10B981' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Quick Catalog Seeder (Demo Data)
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
            Quickly populate Firestore with curated tech items (Audio, Wearables, Keyboards, Cameras) complete with high-res Unsplash photos, ratings, and verified affiliate link structures.
          </Typography>
          {seeding && (
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, mt: 1, display: 'block' }}>
              {seedStatus}
            </Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          startIcon={seeding ? <CircularProgress size={18} /> : <SeedIcon />}
          onClick={handleSeedCatalog}
          disabled={seeding}
          sx={{
            borderColor: '#10B981',
            color: '#059669',
            fontWeight: 600,
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: '#059669',
              backgroundColor: '#ECFDF5'
            }
          }}
        >
          {seeding ? 'Seeding Catalog...' : 'Seed Demo Catalog'}
        </Button>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Container>
  );
}
