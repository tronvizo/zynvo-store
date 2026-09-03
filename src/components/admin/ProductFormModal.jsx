import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  Rating
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
  const [reviewsCount, setReviewsCount] = useState('');
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
      setReviewsCount(product.reviewsCount !== undefined ? String(product.reviewsCount) : '');
      setCategoryId(product.categoryId || (categories[0]?.id || ''));
      setImageUrl(product.imageUrl || '');
      setAffiliateLink(product.affiliateLink || '');
      setIsPopular(Boolean(product.isPopular));
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setRating(4.5);
      setReviewsCount('');
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

    const numericRating = parseFloat(rating);
    const finalRating = isNaN(numericRating) ? 4.5 : Math.min(5, Math.max(0, numericRating));

    onSave({
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      rating: finalRating,
      reviewsCount: reviewsCount.trim(),
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

          {/* Description */}
          <TextField
            label="Description & Specifications"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            disabled={loading}
            placeholder="Detailed features, specifications, and warranty information..."
          />

          {/* Category & Price */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth required disabled={loading}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
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

          {/* Review Rating & Popularity Box */}
          <Box sx={{ p: 2, backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#111111' }}>
              Review Rating & Reviews Count
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
              {/* Direct Numeric Rating Input */}
              <Box>
                <TextField
                  label="Rating (0.0 to 5.0)"
                  type="number"
                  inputProps={{ min: 0, max: 5, step: "0.1" }}
                  value={rating}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setRating(isNaN(val) ? 0 : Math.min(5, Math.max(0, val)));
                  }}
                  fullWidth
                  size="small"
                  disabled={loading}
                  helperText="Enter rating score from 0.0 to 5.0"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Rating
                    value={Number(rating) || 0}
                    precision={0.1}
                    onChange={(e, val) => setRating(val || 0)}
                    sx={{ color: '#F59E0B' }}
                  />
                  <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700 }}>
                    {Number(rating || 0).toFixed(1)} ★
                  </Typography>
                </Box>
              </Box>

              {/* Reviews Count */}
              <TextField
                label="Reviews Count (Optional)"
                value={reviewsCount}
                onChange={(e) => setReviewsCount(e.target.value)}
                fullWidth
                size="small"
                disabled={loading}
                placeholder="e.g. 142 or 2.4k"
                helperText="Displayed next to star rating (e.g. (4.5 • 142 reviews))"
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  color="primary"
                />
              }
              label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Feature as "Most Popular" on Homepage</Typography>}
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
            placeholder="https://amazon.in/dp/... or https://partner.link/..."
            helperText="The destination URL shopper is redirected to when clicking 'Buy Now'."
          />

          {/* Image URL with Live Preview */}
          <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Product Image (Direct URL)
            </Typography>

            <TextField
              label="Direct Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              required
              disabled={loading}
              placeholder="https://images.unsplash.com/... or https://m.media-amazon.com/..."
              helperText="Paste direct image link (Amazon, Unsplash, CDN)."
              sx={{ mb: 2 }}
            />

            {imageUrl.trim() && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Image preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                  }}
                  sx={{
                    width: 90,
                    height: 90,
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    p: 0.5
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Live image preview.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#111111', '&:hover': { backgroundColor: '#262626' } }}
          >
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
