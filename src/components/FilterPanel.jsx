import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Button,
  Divider,
  Paper,
  Chip,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  RestartAlt as ResetIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon
} from '@mui/icons-material';

export default function FilterPanel({
  search,
  onSearchChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxAvailablePrice = 100000,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
  onResetFilters
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    minRating > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < maxAvailablePrice ||
    sortBy !== 'newest' ||
    search.trim() !== '';

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        mb: 3
      }}
    >
      {/* Header bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ color: '#111111', fontSize: { xs: 18, sm: 20 } }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
            Filter Catalog
          </Typography>
          {hasActiveFilters && (
            <Chip 
              label="Active" 
              size="small" 
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#10B981', color: '#FFFFFF' }} 
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            startIcon={<ResetIcon fontSize="small" />}
            onClick={onResetFilters}
            sx={{
              color: '#6B7280',
              fontSize: '0.75rem',
              p: '2px 6px',
              '&:hover': { color: '#EF4444' }
            }}
          >
            Reset
          </Button>

          {/* Mobile Toggle Button */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            endIcon={mobileExpanded ? <ArrowUpIcon sx={{ fontSize: 16 }} /> : <ArrowDownIcon sx={{ fontSize: 16 }} />}
            sx={{
              display: { xs: 'flex', md: 'none' },
              borderColor: '#E5E7EB',
              color: '#111111',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '6px',
              p: '3px 8px'
            }}
          >
            {mobileExpanded ? 'Less' : 'More Filters'}
          </Button>
        </Box>
      </Box>

      {/* Quick Search Bar (Always visible on mobile & desktop) */}
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by title, specs, gear..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#FAFAFA',
              fontSize: '0.9rem'
            }
          }}
        />
      </Box>

      {/* Category Pills (Horizontal scrolling on mobile) */}
      <Box sx={{ mb: 2 }}>
        <Box 
          className="hide-scrollbar"
          sx={{ 
            display: 'flex', 
            gap: 1, 
            overflowX: 'auto', 
            py: 0.5, 
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          <Chip
            label="All"
            clickable
            size="small"
            onClick={() => onCategoryChange('all')}
            sx={{
              borderRadius: '6px',
              fontWeight: (!selectedCategory || selectedCategory === 'all') ? 700 : 500,
              backgroundColor: (!selectedCategory || selectedCategory === 'all') ? '#111111' : '#F3F4F6',
              color: (!selectedCategory || selectedCategory === 'all') ? '#FFFFFF' : '#374151',
              fontSize: '0.75rem',
              '&:hover': {
                backgroundColor: (!selectedCategory || selectedCategory === 'all') ? '#262626' : '#E5E7EB'
              }
            }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              clickable
              size="small"
              onClick={() => onCategoryChange(cat.id)}
              sx={{
                borderRadius: '6px',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                backgroundColor: selectedCategory === cat.id ? '#111111' : '#F3F4F6',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#374151',
                fontSize: '0.75rem',
                flexShrink: 0,
                '&:hover': {
                  backgroundColor: selectedCategory === cat.id ? '#262626' : '#E5E7EB'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Detailed Filters (Collapsible on mobile, always visible on desktop) */}
      <Box sx={{ display: { xs: mobileExpanded ? 'block' : 'none', md: 'block' } }}>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr 1fr' }, gap: 3, alignItems: 'center' }}>
          
          {/* Sort Dropdown */}
          <FormControl size="small" fullWidth>
            <InputLabel id="sort-select-label" sx={{ fontSize: '0.85rem' }}>Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => onSortByChange(e.target.value)}
              sx={{ borderRadius: '8px', backgroundColor: '#FAFAFA', fontSize: '0.85rem' }}
            >
              <MenuItem value="newest">Newest Arrivals</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>

          {/* Price Slider */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, fontSize: '0.72rem' }}>
                Price Range
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#111111', fontSize: '0.72rem' }}>
                ₹{Number(priceRange[0]).toLocaleString('en-IN')} - ₹{Number(priceRange[1]).toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Slider
              value={priceRange}
              onChange={(e, val) => onPriceRangeChange(val)}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
              min={0}
              max={maxAvailablePrice}
              step={500}
              size="small"
              sx={{
                color: '#111111',
                py: 0.5,
                '& .MuiSlider-thumb': {
                  width: 14,
                  height: 14,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 6px rgba(17,17,17,0.1)'
                  }
                }
              }}
            />
          </Box>

          {/* Rating Filter */}
          <Box>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, display: 'block', mb: 0.75, fontSize: '0.72rem' }}>
              Minimum Rating
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[0, 4, 4.5].map((star) => (
                <Chip
                  key={star}
                  label={star === 0 ? 'Any' : `${star}★+`}
                  size="small"
                  clickable
                  onClick={() => onMinRatingChange(star)}
                  sx={{
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: minRating === star ? 700 : 500,
                    backgroundColor: minRating === star ? '#111111' : '#F3F4F6',
                    color: minRating === star ? '#FFFFFF' : '#374151',
                    flex: 1
                  }}
                />
              ))}
            </Box>
          </Box>

        </Box>
      </Box>
    </Paper>
  );
}
