import React from 'react';
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
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  RestartAlt as ResetIcon
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
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        mb: 4
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ color: '#111111', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
            Filter Catalog
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<ResetIcon fontSize="small" />}
          onClick={onResetFilters}
          sx={{
            color: '#6B7280',
            fontSize: '0.8rem',
            '&:hover': { color: '#EF4444' }
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Row 1: Search & Sorting */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2, mb: 2.5 }}>
        {/* Search Input */}
        <TextField
          placeholder="Search by title or description..."
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
            }
          }}
        />

        {/* Sort Dropdown */}
        <FormControl size="small" fullWidth>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            label="Sort By"
            onChange={(e) => onSortByChange(e.target.value)}
            sx={{ borderRadius: '8px', backgroundColor: '#FAFAFA' }}
          >
            <MenuItem value="newest">Newest Arrivals</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Category Pills */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, display: 'block', mb: 1 }}>
          Category
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All Categories"
            clickable
            size="small"
            onClick={() => onCategoryChange('all')}
            sx={{
              borderRadius: '6px',
              fontWeight: (!selectedCategory || selectedCategory === 'all') ? 700 : 500,
              backgroundColor: (!selectedCategory || selectedCategory === 'all') ? '#111111' : '#F3F4F6',
              color: (!selectedCategory || selectedCategory === 'all') ? '#FFFFFF' : '#374151',
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
                '&:hover': {
                  backgroundColor: selectedCategory === cat.id ? '#262626' : '#E5E7EB'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Row 2: Price Range & Rating */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        
        {/* Price Slider */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
              Price Range
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#111111' }}>
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
          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, display: 'block', mb: 1 }}>
            Minimum Rating
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[0, 3, 4, 4.5].map((val) => (
              <Chip
                key={val}
                label={val === 0 ? "Any" : `${val}★ +`}
                clickable
                size="small"
                onClick={() => onMinRatingChange(val)}
                sx={{
                  borderRadius: '6px',
                  fontWeight: minRating === val ? 700 : 500,
                  backgroundColor: minRating === val ? '#10B981' : '#F3F4F6',
                  color: minRating === val ? '#FFFFFF' : '#374151',
                  '&:hover': {
                    backgroundColor: minRating === val ? '#059669' : '#E5E7EB'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

      </Box>
    </Paper>
  );
}
