import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Skeleton,
  Paper,
  Button
} from '@mui/material';
import {
  ShoppingBagOutlined as BagIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import CategoryChips from '../components/CategoryChips';
import ProductScrollSection from '../components/ProductScrollSection';
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

  // Section 1: New Arrivals (admin selected isNewArrival)
  const newArrivals = useMemo(() => {
    return categoryFilteredProducts.filter(p => Boolean(p.isNewArrival));
  }, [categoryFilteredProducts]);

  // Section 2: Most Popular (admin selected isPopular)
  const popularProducts = useMemo(() => {
    return categoryFilteredProducts.filter(p => Boolean(p.isPopular));
  }, [categoryFilteredProducts]);

  // Section 3: Trending Catalog (admin selected isTrending, or fallback if not categorized in others)
  const trendingProducts = useMemo(() => {
    return categoryFilteredProducts.filter(p => Boolean(p.isTrending) || (!p.isNewArrival && !p.isPopular));
  }, [categoryFilteredProducts]);

  const hasAnyProductsInSections = newArrivals.length > 0 || popularProducts.length > 0 || trendingProducts.length > 0;

  const activeCategoryObj = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return null;
    return categories.find(c => c.id === selectedCategory);
  }, [selectedCategory, categories]);

  return (
    <Box sx={{ pb: 8, pt: 3 }}>
      <Container maxWidth="xl">
        
        {/* Category Chips Bar */}
        <Box sx={{ mb: 5 }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, my: 4 }}>
            {[1, 2].map((s) => (
              <Box key={s}>
                <Skeleton width={200} height={32} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'hidden' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} variant="rounded" width={260} height={340} sx={{ borderRadius: '12px' }} />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Empty Catalog Notice (No products at all) */}
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
        {!loading && allProducts.length > 0 && !hasAnyProductsInSections && (
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

        {/* 1. New Arrivals Section (Admin controlled: isNewArrival) */}
        {!loading && newArrivals.length > 0 && (
          <ProductScrollSection
            title="New Arrivals"
            subtitle="Latest handpicked gadgets and peripherals added to the store"
            products={newArrivals}
            viewAllLink="/products?sort=new"
            categoriesMap={categoriesMap}
          />
        )}

        {/* 2. Most Popular Section (Admin controlled: isPopular) */}
        {!loading && popularProducts.length > 0 && (
          <ProductScrollSection
            title="Most Popular"
            subtitle="Top-rated tech and community favorite picks"
            products={popularProducts}
            viewAllLink="/products?sort=popular"
            categoriesMap={categoriesMap}
          />
        )}

        {/* 3. Trending Catalog Section (Admin controlled: isTrending) */}
        {!loading && trendingProducts.length > 0 && (
          <ProductScrollSection
            title="Trending Catalog"
            subtitle="Explore our complete collection across all tech categories"
            products={trendingProducts}
            viewAllLink="/products"
            categoriesMap={categoriesMap}
          />
        )}

      </Container>
    </Box>
  );
}
