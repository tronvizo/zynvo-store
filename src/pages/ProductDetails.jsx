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
  Divider,
  IconButton
} from '@mui/material';
import {
  NavigateNext as NextBreadcrumbIcon,
  OpenInNew as ExternalIcon,
  VerifiedUserOutlined as VerifiedIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextImageArrow
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      setError('');
      setSelectedImageIndex(0);
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

  const imageList = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : []);

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const minSwipeDistance = 45;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price || 0);

  const categoryName = categoriesMap[product.categoryId] || 'Gadgets';

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NextBreadcrumbIcon sx={{ fontSize: 14 }} />} sx={{ mb: 3 }}>
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
          p: { xs: 2, sm: 3, md: 5 },
          mb: { xs: 4, md: 8 }
        }}
      >
        <Grid container spacing={{ xs: 3, md: 6 }}>
          
          {/* Left Column: Responsive Interactive Multi-Image Gallery & Slider */}
          <Grid item xs={12} md={6}>
            <Box
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              sx={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: 260, sm: 380, md: 500 },
                maxHeight: { xs: 340, sm: 460, md: 560 },
                position: 'relative',
                userSelect: 'none'
              }}
            >
              <Box
                component="img"
                key={selectedImageIndex}
                src={imageList[selectedImageIndex] || product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
                alt={`${product.title} - Angle ${selectedImageIndex + 1}`}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  p: { xs: 1, md: 2 }
                }}
              />

              {/* Slider Controls (if multiple images) */}
              {imageList.length > 1 && (
                <>
                  <IconButton
                    size="small"
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      color: '#111111',
                      '&:hover': { backgroundColor: '#FFFFFF' }
                    }}
                    aria-label="Previous image"
                  >
                    <PrevIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      color: '#111111',
                      '&:hover': { backgroundColor: '#FFFFFF' }
                    }}
                    aria-label="Next image"
                  >
                    <NextImageArrow />
                  </IconButton>

                  {/* Image Counter Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      backgroundColor: 'rgba(17, 17, 17, 0.8)',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      px: 1.2,
                      py: 0.3,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em'
                    }}
                  >
                    {selectedImageIndex + 1} / {imageList.length}
                  </Box>
                </>
              )}
            </Box>

            {/* Thumbnail Strip (if multiple images) */}
            {imageList.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  mt: 2,
                  overflowX: 'auto',
                  py: 0.5,
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {imageList.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    sx={{
                      width: { xs: 62, sm: 72 },
                      height: { xs: 62, sm: 72 },
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: selectedImageIndex === idx ? '2px solid #111111' : '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      p: 0.5,
                      transition: 'all 0.2s',
                      boxShadow: selectedImageIndex === idx ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                      '&:hover': {
                        borderColor: '#111111'
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
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
                  label="POPULAR PICK"
                  size="small"
                  sx={{
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    borderRadius: '6px'
                  }}
                />
              )}
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
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
                {Number(product.rating || 0).toFixed(1)}{product.reviewsCount ? ` (${product.reviewsCount})` : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Product Rating
              </Typography>
            </Box>

            {/* Formatted Price */}
            <Box sx={{ mb: 3.5, p: 2, backgroundColor: '#F9FAFB', borderRadius: '10px', display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                PRODUCT PRICE:
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
                Buy Now
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
