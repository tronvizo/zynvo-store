import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Rating,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  OpenInNew as ExternalIcon,
  VerifiedUserOutlined as VerifiedIcon,
  LocalShippingOutlined as ShippingIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import { useCategories } from '../hooks/useCategories';
import ProductScrollSection from '../components/ProductScrollSection';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categoriesMap } = useCategories();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      setError('');
      try {
        const prod = await getProductById(id);
        if (!prod) {
          setError('The requested product could not be found.');
          return;
        }
        setProduct(prod);

        // Fetch related products in the same category
        if (prod.categoryId) {
          const related = await getProducts({ categoryId: prod.categoryId });
          setRelatedProducts(related.filter((p) => p.id !== id).slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleBuyNow = () => {
    if (product?.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={44} sx={{ color: '#111111' }} />
        <Typography variant="body2" color="text.secondary">
          Loading product specifications...
        </Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
            Product Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {error || 'This product does not exist or has been removed from the catalog.'}
          </Typography>
          <Button
            component={Link}
            to="/products"
            startIcon={<BackIcon />}
            variant="contained"
            sx={{ backgroundColor: '#111111', borderRadius: '8px' }}
          >
            Back to Products
          </Button>
        </Paper>
      </Container>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price || 0);

  const categoryName = categoriesMap[product.categoryId] || 'Gadgets';

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit" sx={{ fontSize: '0.875rem' }}>
          Home
        </MuiLink>
        <MuiLink
          component={Link}
          to={`/products?category=${product.categoryId}`}
          color="inherit"
          sx={{ fontSize: '0.875rem' }}
        >
          {categoryName}
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.title}
        </Typography>
      </Breadcrumbs>

      {/* Main Product Showcase Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          p: { xs: 2.5, md: 5 },
          mb: 8
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }}>
          
          {/* Left Column: Responsive Hero Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: 320, sm: 440, md: 500 },
                maxHeight: 560
              }}
            >
              <Box
                component="img"
                src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
                alt={product.title}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  p: { xs: 1, md: 2 }
                }}
              />
            </Box>
          </Grid>

          {/* Right Column: Specifications & Exclusive Buy CTA */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Category badge & tags */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip
                label={categoryName}
                size="small"
                sx={{
                  backgroundColor: '#F3F4F6',
                  color: '#1F2937',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  borderRadius: '6px'
                }}
              />
              {product.isPopular && (
                <Chip
                  label="POPULAR"
                  size="small"
                  sx={{
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    borderRadius: '6px'
                  }}
                />
              )}
            </Box>

            {/* H1 Title per PRD §5.3 */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.6rem', sm: '2.1rem', md: '2.4rem' },
                color: '#111111',
                lineHeight: 1.25,
                mb: 2
              }}
            >
              {product.title}
            </Typography>

            {/* Read-Only Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Rating
                value={Number(product.rating) || 0}
                precision={0.1}
                readOnly
                sx={{ color: '#F59E0B' }}
              />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#111111' }}>
                {Number(product.rating || 0).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Verified Affiliate Partner Rating
              </Typography>
            </Box>

            {/* Formatted Price */}
            <Box sx={{ mb: 3.5, p: 2, backgroundColor: '#F9FAFB', borderRadius: '10px', display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Direct Partner Price:
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.8rem', sm: '2.2rem' },
                  color: '#10B981' // Green accent
                }}
              >
                {formattedPrice}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                (Tax & shipping computed at seller checkout)
              </Typography>
            </Box>

            {/* Description (multiline text) */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111111', mb: 1 }}>
                Overview & Details
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#4B5563',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  fontSize: '0.98rem'
                }}
              >
                {product.description}
              </Typography>
            </Box>

            {/* ONLY CTA ON PAGE: Buy Now Button (PRD §5.3) */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                endIcon={<ExternalIcon />}
                onClick={handleBuyNow}
                sx={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  py: 1.8,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    backgroundColor: '#262626'
                  }
                }}
              >
                Buy Now on Partner Site
              </Button>

              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#6B7280', mt: 1.5 }}>
                Securely redirects to external affiliate link. No cart or account required on ZYNVO STORE.
              </Typography>
            </Box>

            {/* Transparency Trust Badges */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckIcon sx={{ color: '#10B981', fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151' }}>
                  Authentic Product Guarantee
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedIcon sx={{ color: '#10B981', fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151' }}>
                  Direct Retailer Checkout
                </Typography>
              </Box>
            </Box>

          </Grid>
        </Grid>
      </Paper>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <ProductScrollSection
          title="Similar Products in This Category"
          subtitle="Explore related hardware and accessories"
          products={relatedProducts}
          viewAllLink={`/products?category=${product.categoryId}`}
          categoriesMap={categoriesMap}
        />
      )}
    </Container>
  );
}
