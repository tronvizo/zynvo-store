import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Skeleton,
  Paper,
  Button,
  Chip
} from '@mui/material';
import {
  ArrowForward as ArrowIcon,
  ShoppingBagOutlined as BagIcon,
  RestartAlt as ResetIcon,
  LocalFireDepartment as HotIcon,
  FiberNew as NewIcon,
  Apps as AllIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import CategoryChips from '../components/CategoryChips';
import ProductCard from '../components/ProductCard';
import { useCategories } from '../hooks/useCategories';
import { getProducts } from '../services/productService';

export default function Home() {
  const { categories, categoriesMap, loading: categoriesLoading } = useCategories();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'popular' | 'newest'

  useEffect(() => {
    async function loadHomeProducts() {
      setLoading(true);
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeProducts();
  }, []);

  // Filter products by selected category and filter tab without any duplicates
  const displayedProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      const targetCat = categories.find(c => c.id === selectedCategory);
      const targetName = targetCat?.name?.toLowerCase().trim();

      result = result.filter(p => {
        if (p.categoryId === selectedCategory) return true;
        if (targetName) {
          const prodCatName = (categoriesMap[p.categoryId] || p.categoryName || p.categoryId || '').toLowerCase().trim();
          return prodCatName === targetName;
        }
        return false;
      });
    }

    // 2. Filter by type (Popular or Newest)
    if (filterType === 'popular') {
      result = result.filter(p => p.isPopular || (Number(p.rating) || 0) >= 4.7);
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (filterType === 'newest') {
      result.sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (new Date(a.createdAt || 0)).getTime();
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (new Date(b.createdAt || 0)).getTime();
        return dateB - dateA;
      });
    }

    return result;
  }, [allProducts, selectedCategory, filterType, categories, categoriesMap]);

  // Selected category object
  const activeCategoryObj = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return null;
    return categories.find(c => c.id === selectedCategory);
  }, [selectedCategory, categories]);

  const activeCategoryTitle = activeCategoryObj ? activeCategoryObj.name : 'Curated Tech Showcase';

  return (
    <Box sx={{ pb: 8, pt: 3 }}>
      <Container maxWidth="xl">
        
        {/* Category Chips Navigation Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#6B7280',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.75rem'
              }}
            >
              Categories
            </Typography>
            {selectedCategory !== 'all' && (
              <Button
                size="small"
                startIcon={<ResetIcon sx={{ fontSize: 15 }} />}
                onClick={() => setSelectedCategory('all')}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  py: 0.2
                }}
              >
                Clear Filter
              </Button>
            )}
          </Box>

          {categoriesLoading ? (
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'hidden' }}>
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <Skeleton key={k} variant="rounded" width={140} height={42} sx={{ borderRadius: '20px' }} />
              ))}
            </Box>
          ) : (
            <CategoryChips
              categories={categories}
              selectedCategoryId={selectedCategory}
              onSelectCategory={(catId) => setSelectedCategory(catId)}
            />
          )}
        </Box>

        {/* Section Header with Sort Tabs */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
            pt: 1,
            borderTop: '1px solid #F3F4F6'
          }}
        >
          {/* Title & Count */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: '#111111',
                  letterSpacing: '-0.02em'
                }}
              >
                {activeCategoryTitle}
              </Typography>
              {!loading && (
                <Chip
                  label={`${displayedProducts.length} ${displayedProducts.length === 1 ? 'Item' : 'Items'}`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    backgroundColor: '#F3F4F6',
                    color: '#374151'
                  }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              {selectedCategory === 'all'
                ? 'Handpicked gadgets & verified tech essentials with direct partner checkout'
                : `Showing verified products available in ${activeCategoryTitle}`}
            </Typography>
          </Box>

          {/* Quick Filter Tabs: All, Popular, Newest */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<AllIcon sx={{ fontSize: 16 }} />}
              label="All"
              clickable
              onClick={() => setFilterType('all')}
              sx={{
                fontWeight: 600,
                fontSize: '0.78rem',
                backgroundColor: filterType === 'all' ? '#111111' : '#F9FAFB',
                color: filterType === 'all' ? '#FFFFFF' : '#4B5563',
                border: '1px solid',
                borderColor: filterType === 'all' ? '#111111' : '#E5E7EB',
                '&:hover': {
                  backgroundColor: filterType === 'all' ? '#262626' : '#F3F4F6'
                }
              }}
            />
            <Chip
              icon={<HotIcon sx={{ fontSize: 16, color: filterType === 'popular' ? '#FFFFFF !important' : '#EF4444 !important' }} />}
              label="Most Popular"
              clickable
              onClick={() => setFilterType('popular')}
              sx={{
                fontWeight: 600,
                fontSize: '0.78rem',
                backgroundColor: filterType === 'popular' ? '#111111' : '#F9FAFB',
                color: filterType === 'popular' ? '#FFFFFF' : '#4B5563',
                border: '1px solid',
                borderColor: filterType === 'popular' ? '#111111' : '#E5E7EB',
                '&:hover': {
                  backgroundColor: filterType === 'popular' ? '#262626' : '#F3F4F6'
                }
              }}
            />
            <Chip
              icon={<NewIcon sx={{ fontSize: 16, color: filterType === 'newest' ? '#FFFFFF !important' : '#10B981 !important' }} />}
              label="Newest"
              clickable
              onClick={() => setFilterType('newest')}
              sx={{
                fontWeight: 600,
                fontSize: '0.78rem',
                backgroundColor: filterType === 'newest' ? '#111111' : '#F9FAFB',
                color: filterType === 'newest' ? '#FFFFFF' : '#4B5563',
                border: '1px solid',
                borderColor: filterType === 'newest' ? '#111111' : '#E5E7EB',
                '&:hover': {
                  backgroundColor: filterType === 'newest' ? '#262626' : '#F3F4F6'
                }
              }}
            />

            <Button
              component={Link}
              to={selectedCategory === 'all' ? '/products' : `/products?category=${selectedCategory}`}
              endIcon={<ArrowIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#111111',
                ml: { xs: 0, sm: 1 },
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Catalog View
            </Button>
          </Box>
        </Box>

        {/* Loading Skeletons */}
        {loading && (
          <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3 }} sx={{ my: 1 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <Skeleton variant="rounded" height={360} sx={{ borderRadius: '12px' }} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty Catalog Notice (No products exist at all) */}
        {!loading && allProducts.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: '16px',
              border: '1px dashed #D1D5DB',
              backgroundColor: '#FFFFFF',
              my: 6
            }}
          >
            <BagIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 1.5 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Catalog is currently empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
              No products have been added to ZYNVO STORE yet. You can sign in to the Admin Panel to add new products or categories.
            </Typography>
            <Button
              component={Link}
              to="/admin"
              variant="contained"
              sx={{ backgroundColor: '#111111', borderRadius: '8px' }}
            >
              Go to Admin Panel
            </Button>
          </Paper>
        )}

        {/* No Products in this Category */}
        {!loading && allProducts.length > 0 && displayedProducts.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: 'center',
              borderRadius: '16px',
              border: '1px dashed #D1D5DB',
              backgroundColor: '#FAFAFA',
              my: 4
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              No products found in "{activeCategoryTitle}"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: 'auto', mb: 3 }}>
              There are no products listed under this category yet. Try selecting another category or view all items.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedCategory('all');
                setFilterType('all');
              }}
              sx={{
                backgroundColor: '#111111',
                borderRadius: '8px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#262626' }
              }}
            >
              View All Products
            </Button>
          </Paper>
        )}

        {/* Unified, Single Product Grid (Every product appears ONCE) */}
        {!loading && displayedProducts.length > 0 && (
          <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3 }}>
            {displayedProducts.map((p) => (
              <Grid item xs={6} sm={4} md={3} key={p.id}>
                <ProductCard
                  product={p}
                  categoryName={categoriesMap[p.categoryId] || p.categoryName || ''}
                />
              </Grid>
            ))}
          </Grid>
        )}

      </Container>
    </Box>
  );
}
