import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Rating,
  FormControlLabel,
  Switch
} from '@mui/material';

export default function ProductFormModal({
  open,
  onClose,
  onSave,
  product = null,
  categories = [],
  loading = false
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState(4.5);
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setPrice(product.price !== undefined ? String(product.price) : '');
      setRating(product.rating !== undefined ? Number(product.rating) : 4.5);
      setCategoryId(product.categoryId || (categories[0]?.id || ''));
      setImageUrl(product.imageUrl || '');
      setAffiliateLink(product.affiliateLink || '');
      setIsPopular(Boolean(product.isPopular));
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setRating(4.5);
      setCategoryId(categories[0]?.id || '');
      setImageUrl('');
      setAffiliateLink('');
      setIsPopular(false);
    }
    setError('');
  }, [product, open, categories]);

  const validateUrl = (urlStr) => {
    try {
      const url = new URL(urlStr);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Product title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Product description is required.');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('Please provide a valid non-negative price.');
      return;
    }

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    if (!imageUrl.trim()) {
      setError('Product image URL is required.');
      return;
    }

    if (!affiliateLink.trim()) {
      setError('Affiliate Buy Now link is required.');
      return;
    }

    if (!validateUrl(affiliateLink.trim())) {
      setError('Please enter a valid affiliate URL starting with http:// or https://');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      rating: Number(rating) || 0,
      categoryId,
      imageUrl: imageUrl.trim(),
      affiliateLink: affiliateLink.trim(),
      isPopular
    });
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {product ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Title */}
          <TextField
            label="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            disabled={loading}
            placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
          />

          {/* Category & Price */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth required disabled={loading}>
              <InputLabel id="product-category-label">Category</InputLabel>
              <Select
                labelId="product-category-label"
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Price (₹ INR)"
              type="number"
              inputProps={{ min: 0, step: "1" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
              disabled={loading}
              placeholder="e.g. 14999"
            />
          </Box>

          {/* Rating & Is Popular */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 1.5, backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Rating (0–5):
              </Typography>
              <Rating
                value={rating}
                precision={0.1}
                onChange={(e, val) => setRating(val || 0)}
                sx={{ color: '#F59E0B' }}
              />
              <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 600 }}>
                {rating.toFixed(1)}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  color="primary"
                />
              }
              label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Feature as "Most Popular"</Typography>}
            />
          </Box>

          {/* Affiliate Link */}
          <TextField
            label="Affiliate Buy Now Link (URL)"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            fullWidth
            required
            disabled={loading}
            placeholder="https://amazon.com/dp/... or https://partner.link/..."
            helperText="The destination URL shopper is redirected to when clicking 'Buy Now'."
          />

          {/* Image URL with Live Preview */}
          <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Product Image (Direct URL)
            </Typography>

            <TextField
              label="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              size="small"
              required
              disabled={loading}
              placeholder="https://images.unsplash.com/... or any product image link"
              helperText="Paste direct URL of the product photo (from Amazon, manufacturer CDN, Unsplash, etc.)"
            />

            {/* Live Image Preview */}
            {imageUrl && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, p: 1.5, backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Preview"
                  sx={{
                    width: 70,
                    height: 70,
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/70?text=Invalid';
                  }}
                />
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, display: 'block' }}>
                    Image link active (Preview above)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 420 }}>
                    {imageUrl}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Description */}
          <TextField
            label="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
            rows={4}
            disabled={loading}
            placeholder="Detailed features, specifications, ergonomics, battery life, warranties, etc."
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={loading} sx={{ color: '#4B5563' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#111111',
              '&:hover': { backgroundColor: '#262626' }
            }}
          >
            {loading ? 'Saving Product...' : product ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
