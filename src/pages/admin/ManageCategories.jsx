import React, { useState, useEffect } from 'react';
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
  Link as MuiLink
} from '@mui/material';
import {
  Add as AddIcon,
  EditOutlined as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import MuiIconHelper from '../../components/MuiIconHelper';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/categoryService';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setErrorMessage('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setCurrentCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setCurrentCategory(category);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (currentCategory) {
        await updateCategory(currentCategory.id, formData);
        setSnackbarMessage('Category updated successfully!');
      } else {
        await addCategory(formData);
        setSnackbarMessage('Category created successfully!');
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      console.error('Save error:', err);
      setErrorMessage(err.message || 'Failed to save category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await deleteCategory(deleteId);
      setSnackbarMessage('Category deleted successfully.');
      setDeleteId(null);
      await loadCategories();
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMessage(err.message || 'Failed to delete category.');
      setDeleteId(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 10 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/admin" color="inherit" sx={{ fontSize: '0.875rem' }}>
          Admin
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Manage Categories
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.9rem' } }}>
            Manage Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} configured
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
          Add New Category
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: '#111111' }} />
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No categories found. Click "Add New Category" to create one.
            </Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 500 }}>
            <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Icon</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Category Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>MUI Icon Key</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#374151' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ width: 60 }}>
                    <Box sx={{ p: 1, borderRadius: '8px', backgroundColor: '#F3F4F6', display: 'inline-flex', color: '#111111' }}>
                      <MuiIconHelper iconKey={cat.iconKey} fontSize="small" />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                  <TableCell sx={{ color: '#6B7280', fontSize: '0.85rem' }}>{cat.iconKey || 'None'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(cat)}
                      sx={{ color: '#374151', mr: 1, '&:hover': { color: '#111111' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteId(cat.id)}
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
      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={currentCategory}
        loading={actionLoading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Category"
        message="Are you sure you want to delete this category? Make sure no products are assigned to it before deleting."
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
