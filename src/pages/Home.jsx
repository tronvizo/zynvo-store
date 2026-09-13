import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Skeleton,
  Paper,
  Button,
  Grid
} from '@mui/material';
import {
  ShoppingBagOutlined as BagIcon,
  RestartAlt as ResetIcon
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

  // Filter products by selected category
  const categoryFilteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      return allProducts;
    }
    const targetCat = categories.find(c => c.id === selectedCategory);
    const targetName = targetCat?.name?.toLowerCase().trim();

    return allProducts.filter(p => {
      if (p.categoryId === selectedCategory) return true;
      if (targetName) {
        const prodCatName = (categoriesMap[p.categoryId] || p.categoryName || p.categoryId || '').toLowerCase().trim();
        return prodCatName === targetName;
      }
      return false;
    });
  }, [allProducts, selectedCategory, categories, categoriesMap]);

  const activeCategoryObj = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return null;
    return categories.find(c => c.id === selectedCategory);
  }, [selectedCategory, categories]);

  return (
    <Box sx={{ pb: 8, pt: 3 }}>
      <Container maxWidth="xl">
        
        {/* Category Chips Bar */}
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

        {/* Loading Skeletons */}
        {loading && (
          <Box sx={{ my: 2 }}>
            <Skeleton width={200} height={36} sx={{ mb: 2 }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: { xs: 2, sm: 2.5, md: 3 }
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} variant="rounded" height={360} sx={{ borderRadius: '12px' }} />
              ))}
            </Box>
          </Box>
        )}

        {/* Empty Catalog Notice (No products at all in store) */}
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
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
              Catalog is currently empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
              No products have been added to ZYNVO STORE yet. You can sign in to the Admin Panel to populate or add items.
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
        {!loading && allProducts.length > 0 && categoryFilteredProducts.length === 0 && (
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
              No products found in "{activeCategoryObj ? activeCategoryObj.name : 'Selected Category'}"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: 'auto', mb: 3 }}>
              There are no products assigned to this category yet. Try selecting another category or view all items.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setSelectedCategory('all')}
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

        {/* Products Grid Section */}
        {!loading && categoryFilteredProducts.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                mb: 3
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.35rem', sm: '1.65rem' },
                    color: '#111111'
                  }}
                >
                  {activeCategoryObj ? activeCategoryObj.name : 'All Products'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCategory === 'all'
                    ? `Explore our verified affiliate collection (${categoryFilteredProducts.length} items)`
                    : `Showing ${categoryFilteredProducts.length} ${categoryFilteredProducts.length === 1 ? 'product' : 'products'} in ${activeCategoryObj?.name || 'category'}`}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: { xs: 2, sm: 2.5, md: 3 }
              }}
            >
              {categoryFilteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  categoryName={categoriesMap[prod.categoryId] || prod.categoryName}
                />
              ))}
            </Box>
          </Box>
        )}

      </Container>
    </Box>
  );
}
