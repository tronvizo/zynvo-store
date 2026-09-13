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
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, categoryName = '' }) {
  const navigate = useNavigate();

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

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
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
      {/* Product Highlight Badges on Top of Card */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 6, sm: 10 },
          left: { xs: 6, sm: 10 },
          zIndex: 2,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 0.5,
          maxWidth: '85%'
        }}
      >
        {product.isNewArrival && (
          <Chip
            label="NEW ARRIVAL"
            size="small"
            sx={{
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: { xs: '0.58rem', sm: '0.65rem' },
              letterSpacing: '0.04em',
              borderRadius: '5px',
              height: { xs: '19px', sm: '22px' },
              px: 0.25
            }}
          />
        )}
        {product.isPopular && (
          <Chip
            label="POPULAR"
            size="small"
            sx={{
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: { xs: '0.58rem', sm: '0.65rem' },
              letterSpacing: '0.04em',
              borderRadius: '5px',
              height: { xs: '19px', sm: '22px' },
              px: 0.25
            }}
          />
        )}
        {product.isTrending && (
          <Chip
            label="TRENDING"
            size="small"
            sx={{
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: { xs: '0.58rem', sm: '0.65rem' },
              letterSpacing: '0.04em',
              borderRadius: '5px',
              height: { xs: '19px', sm: '22px' },
              px: 0.25
            }}
          />
        )}
      </Box>

      {/* Product Image - Full & Proper 1:1 Aspect Ratio with contain */}
      <Box
        sx={{
          position: 'relative',
          pt: '100%', // 1:1 square ratio - standard e-commerce framing
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          borderBottom: '1px solid #F3F4F6'
        }}
      >
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
            objectFit: 'contain', // Pura aur proper image dikhega, bina kate
            p: { xs: 1, sm: 1.5 },
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.04)'
            }
          }}
          loading="lazy"
        />
      </Box>

      {/* Product Details */}
      <CardContent sx={{ p: { xs: 1, sm: 1.75 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {categoryName && (
          <Typography
            variant="caption"
            sx={{
              color: '#6B7280',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              mb: 0.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {categoryName}
          </Typography>
        )}

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.78rem', sm: '0.9rem' },
            color: '#111111',
            lineHeight: 1.25,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: { xs: '2.5em', sm: '2.5em' }
          }}
        >
          {product.title}
        </Typography>

        {/* Rating & Reviews */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
          <Rating
            value={Number(product.rating) || 0}
            precision={0.1}
            readOnly
            size="small"
            sx={{ color: '#F59E0B', fontSize: { xs: '0.82rem', sm: '1rem' } }}
          />
          <Typography variant="caption" sx={{ color: '#4B5563', fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.72rem' } }}>
            ({Number(product.rating || 0).toFixed(1)})
          </Typography>
        </Box>

        {/* Price and Buy Now CTA */}
        <Box sx={{ mt: 'auto', pt: 0.75, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: { xs: 0.75, sm: 1 } }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', fontSize: { xs: '0.6rem', sm: '0.68rem' } }}>
              Price
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.88rem', sm: '1.05rem' },
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
            endIcon={<BuyIcon sx={{ fontSize: { xs: 11, sm: 13 } }} />}
            onClick={handleBuyNow}
            sx={{
              borderRadius: '6px',
              px: { xs: 0.75, sm: 1.5 },
              py: { xs: 0.45, sm: 0.6 },
              fontSize: { xs: '0.68rem', sm: '0.78rem' },
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

        {/* View Details Option (PRD & User Request) */}
        <Button
          variant="outlined"
          size="small"
          onClick={handleViewDetails}
          sx={{
            mt: 0.75,
            py: { xs: 0.35, sm: 0.5 },
            fontSize: { xs: '0.68rem', sm: '0.74rem' },
            fontWeight: 600,
            textTransform: 'none',
            color: '#374151',
            borderColor: '#E5E7EB',
            backgroundColor: '#F9FAFB',
            borderRadius: '6px',
            width: '100%',
            '&:hover': {
              backgroundColor: '#F3F4F6',
              borderColor: '#111111',
              color: '#111111'
            }
          }}
        >
          View Details →
        </Button>
      </CardContent>
    </Card>
  );
}
