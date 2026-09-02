import React, { useRef } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function ProductScrollSection({
  title,
  subtitle,
  products = [],
  viewAllLink = '/products',
  categoriesMap = {}
}) {
  const scrollRef = useRef(null);

  if (!products || products.length === 0) {
    return null; // hide section if zero products per PRD §5.1
  }

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 2.5, px: { xs: 0.5, sm: 0 } }}>
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.3rem', sm: '1.6rem' },
              color: '#111111',
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Scroll Navigation Arrows (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleScroll('left')}
              sx={{
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                '&:hover': { backgroundColor: '#F3F4F6' }
              }}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleScroll('right')}
              sx={{
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                '&:hover': { backgroundColor: '#F3F4F6' }
              }}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          </Box>

          {/* View All Button */}
          <Button
            component={Link}
            to={viewAllLink}
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              color: '#111111',
              fontWeight: 600,
              fontSize: '0.85rem',
              p: '6px 12px',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: '#F3F4F6'
              }
            }}
          >
            View All
          </Button>
        </Box>
      </Box>

      {/* Horizontal Scroll Row */}
      <Box
        ref={scrollRef}
        className="hide-scrollbar"
        sx={{
          display: 'flex',
          gap: 2.5,
          overflowX: 'auto',
          py: 1,
          px: { xs: 0.5, sm: 0.5 },
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{
              flex: '0 0 auto',
              width: { xs: 230, sm: 260, md: 280 },
              scrollSnapAlign: 'start'
            }}
          >
            <ProductCard
              product={product}
              categoryName={categoriesMap[product.categoryId] || ''}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
