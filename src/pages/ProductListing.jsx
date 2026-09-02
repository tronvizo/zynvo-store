import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Chip
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  SearchOff as NoResultIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import { useCategories } from '../hooks/useCategories';
import { getProducts } from '../services/productService';

const PAGE_SIZE = 8;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, categoriesMap } = useCategories();

  // URL state extraction
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';
  const searchParam = searchParams.get('search') || '';

  // Filter states
  const [search, setSearch] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState(
    sortParam === 'new' ? 'newest' : sortParam === 'popular' ? 'rating' : sortParam
  );
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);

  // Data states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Sync state when URL searchParams change
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('sort')) {
      const s = searchParams.get('sort');
      setSortBy(s === 'new' ? 'newest' : s === 'popular' ? 'rating' : s);
    }
    if (searchParams.get('search')) {
      setSearch(searchParams.get('search'));
    }
  }, [searchParams]);

  // Load products based on filters
  useEffect(() => {
    let isMounted = true;
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const data = await getProducts({
          categoryId: selectedCategory === 'all' ? null : selectedCategory,
          sortBy,
          search,
          minRating,
          minPrice: priceRange[0],
          maxPrice: priceRange[1]
        });
        if (isMounted) {
          setProducts(data);
          setVisibleCount(PAGE_SIZE);
        }
      } catch (err) {
        console.error('Error fetching product listing:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Debounce search/price filter requests slightly
    const timer = setTimeout(() => {
      fetchFilteredProducts();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, sortBy, search, minRating, priceRange]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (catId === 'all') {
        p.delete('category');
      } else {
        p.set('category', catId);
      }
      return p;
    });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('sort', newSort);
      return p;
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('newest');
    setPriceRange([0, 100000]);
    setMinRating(0);
    setSearchParams({});
  };

  const displayedProducts = useMemo(() => {
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  const hasMore = visibleCount < products.length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/" color="inherit" sx={{ fontSize: '0.875rem' }}>
          Home
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Products
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, mb: 3 }}>
        <Box>
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2.2rem' } }}>
            Product Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Showing {products.length} {products.length === 1 ? 'item' : 'items'} matching your criteria
          </Typography>
        </Box>
      </Box>

      {/* Filter Panel */}
      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        sortBy={sortBy}
        onSortByChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12, gap: 2 }}>
          <CircularProgress size={40} sx={{ color: '#111111' }} />
          <Typography variant="body2" color="text.secondary">
            Loading products...
          </Typography>
        </Box>
      ) : products.length === 0 ? (
        /* Empty State (PRD §5.2: minimal message, no emoji) */
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            my: 4
          }}
        >
          <NoResultIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 1.5 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
            We could not find any items matching your selected filters. Try widening your price range, searching for another keyword, or resetting filters.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={handleResetFilters}
            sx={{ borderRadius: '8px', color: '#111111', borderColor: '#D1D5DB' }}
          >
            Clear All Filters
          </Button>
        </Paper>
      ) : (
        /* Responsive Product Grid: 2 columns mobile -> 3 tablet -> 4-5 desktop */
        <>
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
            {displayedProducts.map((product) => (
              <Grid item key={product.id} xs={6} sm={4} md={3} lg={2.4}>
                <ProductCard
                  product={product}
                  categoryName={categoriesMap[product.categoryId] || ''}
                />
              </Grid>
            ))}
          </Grid>

          {/* Load More Button */}
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                sx={{
                  borderRadius: '8px',
                  px: 4,
                  py: 1.2,
                  borderColor: '#111111',
                  color: '#111111',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#111111',
                    color: '#FFFFFF'
                  }
                }}
              >
                Load More Products ({products.length - visibleCount} remaining)
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
