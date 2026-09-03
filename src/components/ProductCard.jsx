import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Rating, 
  Chip 
} from '@mui/material';
import { OpenInNew as BuyIcon } from '@mui/icons-material';

export default function ProductCard({ product, categoryName = '' }) {
  const handleCardClick = () => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price || 0);

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06)'
        }
      }}
    >
      {/* Popular Badge */}
      {product.isPopular && (
        <Chip
          label="POPULAR"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 2,
            backgroundColor: '#111111',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.68rem',
            letterSpacing: '0.05em',
            borderRadius: '6px'
          }}
        />
      )}

      {/* Product Image */}
      <Box sx={{ position: 'relative', pt: '75%', backgroundColor: '#F9FAFB', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          loading="lazy"
        />
      </Box>

      {/* Product Details */}
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {categoryName && (
          <Typography
            variant="caption"
            sx={{
              color: '#6B7280',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: { xs: '0.65rem', sm: '0.72rem' },
              mb: 0.25
            }}
          >
            {categoryName}
          </Typography>
        )}

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            color: '#111111',
            lineHeight: 1.3,
            mb: 0.75,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: { xs: '2.6em', sm: '2.7em' }
          }}
        >
          {product.title}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating
            value={Number(product.rating) || 0}
            precision={0.1}
            readOnly
            size="small"
            sx={{ color: '#F59E0B', fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
          />
          <Typography variant="caption" sx={{ color: '#4B5563', fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            ({Number(product.rating || 0).toFixed(1)})
          </Typography>
        </Box>

        {/* Price and Buy Now Button */}
        <Box sx={{ mt: 'auto', pt: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
              Price
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                color: '#10B981',
                lineHeight: 1.2
              }}
            >
              {formattedPrice}
            </Typography>
          </Box>

          {/* Buy Now CTA */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            endIcon={<BuyIcon sx={{ fontSize: 13 }} />}
            onClick={handleBuyNow}
            sx={{
              borderRadius: '6px',
              px: { xs: 1, sm: 1.5 },
              py: { xs: 0.6, sm: 0.7 },
              fontSize: { xs: '0.72rem', sm: '0.8rem' },
              fontWeight: 700,
              boxShadow: 'none',
              backgroundColor: '#111111',
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#262626'
              }
            }}
          >
            Buy Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
