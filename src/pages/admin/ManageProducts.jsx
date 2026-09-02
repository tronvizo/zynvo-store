import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Rating,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  EditOutlined as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  NavigateNext as NextIcon,
  OpenInNew as ExternalIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProductFormModal from '../../components/admin/ProductFormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useCategories } from '../../hooks/useCategories';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/productService';

export default function ManageProducts() {
  const { categories, categoriesMap } = useCategories();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setErrorMessage('Failed to load product inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setCurrentProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setCurrentProduct(product);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (currentProduct) {
        await updateProduct(currentProduct.id, formData);
        setSnackbarMessage('Product updated successfully!');
      } else {
        await addProduct(formData);
        setSnackbarMessage('Product added to catalog successfully!');
      }
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      console.error('Save product error:', err);
      setErrorMessage(err.message || 'Failed to save product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await deleteProduct(deleteId);
      setSnackbarMessage('Product removed from catalog.');
      setDeleteId(null);
      await loadProducts();
    } catch (err) {
      console.error('Delete product error:', err);
      setErrorMessage(err.message || 'Failed to delete product.');
      setDeleteId(null);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === 'all' || p.categoryId === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/admin" color="inherit" sx={{ fontSize: '0.875rem' }}>
          Admin
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Manage Products
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.9rem' } }}>
            Manage Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {products.length} {products.length === 1 ? 'item' : 'items'} in inventory
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            backgroundColor: '#111111',
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#262626' }
          }}
        >
          Add New Product
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Filter products by title..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 240 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="admin-category-filter">Category Filter</InputLabel>
          <Select
            labelId="admin-category-filter"
            value={filterCategory}
            label="Category Filter"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: '#111111' }} />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No products found matching your search.
            </Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Affiliate Link</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#374151' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((prod) => (
                <TableRow key={prod.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {/* Thumbnail & Title */}
                  <TableCell sx={{ minWidth: 260 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        component="img"
                        src={prod.imageUrl || 'https://via.placeholder.com/48'}
                        alt={prod.title}
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#F9FAFB'
                        }}
                      />
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {prod.title}
                        </Typography>
                        {prod.isPopular && (
                          <Chip
                            label="POPULAR"
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              backgroundColor: '#111111',
                              color: '#FFFFFF',
                              borderRadius: '4px',
                              mt: 0.5
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Chip
                      label={categoriesMap[prod.categoryId] || 'Unknown'}
                      size="small"
                      sx={{ fontSize: '0.75rem', backgroundColor: '#F3F4F6' }}
                    />
                  </TableCell>

                  {/* Price */}
                  <TableCell sx={{ fontWeight: 700, color: '#10B981' }}>
                    ${Number(prod.price).toFixed(2)}
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={Number(prod.rating) || 0} precision={0.1} readOnly size="small" />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {Number(prod.rating || 0).toFixed(1)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Affiliate Link */}
                  <TableCell sx={{ maxWidth: 180 }}>
                    <Tooltip title={prod.affiliateLink || ''}>
                      <Box
                        component="a"
                        href={prod.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: '#2563EB',
                          fontSize: '0.8rem',
                          textDecoration: 'underline',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          maxWidth: 160
                        }}
                      >
                        Partner Link <ExternalIcon sx={{ fontSize: 14 }} />
                      </Box>
                    </Tooltip>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(prod)}
                      sx={{ color: '#374151', mr: 1, '&:hover': { color: '#111111' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteId(prod.id)}
                      sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#FEF2F2' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Add / Edit Modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        product={currentProduct}
        categories={categories}
        loading={actionLoading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to remove this product from the catalog?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        loading={actionLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Container>
  );
}
