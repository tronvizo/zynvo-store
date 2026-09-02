import React from 'react';
import { Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Apps as AllIcon } from '@mui/icons-material';
import MuiIconHelper from './MuiIconHelper';

export default function CategoryChips({ categories = [], selectedCategoryId = null, onSelectCategory }) {
  const navigate = useNavigate();

  const handleChipClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      if (!catId || catId === 'all') {
        navigate('/products');
      } else {
        navigate(`/products?category=${catId}`);
      }
    }
  };

  const isAllSelected = !selectedCategoryId || selectedCategoryId === 'all';

  return (
    <Box
      className="hide-scrollbar"
      sx={{
        display: 'flex',
        gap: 1.25,
        overflowX: 'auto',
        py: 1,
        px: 0.5,
        width: '100%',
        WebkitOverflowScrolling: 'touch',
        alignItems: 'center'
      }}
    >
      {/* All Categories Chip */}
      <Chip
        icon={<AllIcon sx={{ fontSize: 18, color: isAllSelected ? '#FFFFFF !important' : '#4B5563 !important' }} />}
        label="All Categories"
        clickable
        onClick={() => handleChipClick('all')}
        sx={{
          fontWeight: 600,
          fontSize: '0.85rem',
          px: 1,
          py: 2.2,
          borderRadius: '20px',
          border: '1px solid',
          borderColor: isAllSelected ? '#111111' : '#E5E7EB',
          backgroundColor: isAllSelected ? '#111111' : '#FFFFFF',
          color: isAllSelected ? '#FFFFFF' : '#374151',
          '&:hover': {
            backgroundColor: isAllSelected ? '#262626' : '#F3F4F6'
          }
        }}
      />

      {/* Dynamic Categories Chips */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <Chip
            key={cat.id}
            icon={
              <MuiIconHelper 
                iconKey={cat.iconKey} 
                sx={{ fontSize: 18, color: isSelected ? '#FFFFFF !important' : '#4B5563 !important' }} 
              />
            }
            label={cat.name}
            clickable
            onClick={() => handleChipClick(cat.id)}
            sx={{
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 1,
              py: 2.2,
              borderRadius: '20px',
              border: '1px solid',
              borderColor: isSelected ? '#111111' : '#E5E7EB',
              backgroundColor: isSelected ? '#111111' : '#FFFFFF',
              color: isSelected ? '#FFFFFF' : '#374151',
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: isSelected ? '#262626' : '#F3F4F6'
              }
            }}
          />
        );
      })}
    </Box>
  );
}
