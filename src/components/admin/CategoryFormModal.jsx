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
  Alert
} from '@mui/material';
import MuiIconHelper, { AVAILABLE_ICON_KEYS } from '../MuiIconHelper';

export default function CategoryFormModal({
  open,
  onClose,
  onSave,
  category = null,
  loading = false
}) {
  const [name, setName] = useState('');
  const [iconKey, setIconKey] = useState('Category');
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setIconKey(category.iconKey || 'Category');
    } else {
      setName('');
      setIconKey('Category');
    }
    setError('');
  }, [category, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    onSave({
      name: name.trim(),
      iconKey: iconKey || 'Category'
    });
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {category ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
            disabled={loading}
            placeholder="e.g. Smart Wearables"
          />

          <FormControl fullWidth disabled={loading}>
            <InputLabel id="icon-select-label">Category Icon (MUI)</InputLabel>
            <Select
              labelId="icon-select-label"
              value={iconKey}
              label="Category Icon (MUI)"
              onChange={(e) => setIconKey(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MuiIconHelper iconKey={selected} fontSize="small" />
                  <Typography variant="body2">{selected}</Typography>
                </Box>
              )}
            >
              {AVAILABLE_ICON_KEYS.map((key) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <MuiIconHelper iconKey={key} fontSize="small" />
                    <Typography variant="body2">{key}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
