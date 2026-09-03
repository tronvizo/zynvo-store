import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Skeleton
} from '@mui/material';
import { Link } from 'react-router-dom';
import CategoryChips from '../components/CategoryChips';
import ProductScrollSection from '../components/ProductScrollSection';
import { useCategories } from '../hooks/useCategories';
import { getNewProducts, getPopularProducts, getAllProducts } from '../services/productService';

export default function Home() {
  const { categories, categoriesMap, loading: categoriesLoading } = useCategories();
  const [newProducts, setNewProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        const [news, popular, all] = await Promise.all([
          getNewProducts(10),
          getPopularProducts(10),
          getAllProducts(10)
        ]);
        setNewProducts(news);
        setPopularProducts(popular);
        setAllProducts(all);
      } catch (err) {
        console.error('Failed to load homepage sections:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const hasAnyProducts = newProducts.length > 0 || popularProducts.length > 0 || allProducts.length > 0;

  return (
    <Box sx={{ pb: 8, pt: 3 }}>
      {/* Main Container */}
      <Container maxWidth="xl">
        
        {/* Category Chips Bar */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#6B7280',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '0.75rem',
              mb: 1.5
            }}
          >
            Categories
          </Typography>
          {categoriesLoading ? (
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'hidden' }}>
              {[1, 2, 3, 4, 5].map((k) => (
                <Skeleton key={k} variant="rounded" width={140} height={42} sx={{ borderRadius: '20px' }} />
              ))}
            </Box>
          ) : (
            <CategoryChips categories={categories} />
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

        {/* Empty Catalog Notice */}
        {!loading && !hasAnyProducts && (
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
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
              Catalog is currently empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
              No products have been added to ZYNVO STORE yet. You can sign in to the Admin Panel to populate or seed demo items.
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

        {/* 1. New Products Section */}
        {!loading && (
          <ProductScrollSection
            title="New Arrivals"
            subtitle="Latest handpicked gadgets and peripherals added to the store"
            products={newProducts}
            viewAllLink="/products?sort=new"
            categoriesMap={categoriesMap}
          />
        )}

        {/* 2. Most Popular Section */}
        {!loading && (
          <ProductScrollSection
            title="Most Popular"
            subtitle="Top-rated tech and community favorite picks"
            products={popularProducts}
            viewAllLink="/products?sort=popular"
            categoriesMap={categoriesMap}
          />
        )}

        {/* 3. All Products Section */}
        {!loading && (
          <ProductScrollSection
            title="Trending Catalog"
            subtitle="Explore our complete collection across all tech categories"
            products={allProducts}
            viewAllLink="/products"
            categoriesMap={categoriesMap}
          />
        )}

      </Container>
    </Box>
  );
}
