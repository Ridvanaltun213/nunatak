import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const PriceRules = () => {
  const [priceRules, setPriceRules] = useState([]);
  const [countries, setCountries] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [formData, setFormData] = useState({
    countryId: '',
    type: 'percentage',
    value: 0,
    productCategory: 'all',
    productId: '',
    minOrderValue: 0,
    active: true,
    description: '',
    priority: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchPriceRules = async () => {
    try {
      const response = await axios.get('/api/prices');
      setPriceRules(response.data);
    } catch (error) {
      showSnackbar('Error fetching price rules', 'error');
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries');
      setCountries(response.data);
    } catch (error) {
      showSnackbar('Error fetching countries', 'error');
    }
  };

  useEffect(() => {
    fetchPriceRules();
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (rule = null) => {
    if (rule) {
      setCurrentRule(rule);
      setFormData({
        countryId: rule.countryId,
        type: rule.type,
        value: rule.value,
        productCategory: rule.productCategory || 'all',
        productId: rule.productId || '',
        minOrderValue: rule.minOrderValue || 0,
        active: rule.active,
        description: rule.description || '',
        priority: rule.priority || 0
      });
    } else {
      setCurrentRule(null);
      setFormData({
        countryId: countries.length > 0 ? countries[0].id : '',
        type: 'percentage',
        value: 0,
        productCategory: 'all',
        productId: '',
        minOrderValue: 0,
        active: true,
        description: '',
        priority: 0
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentRule) {
        // Update existing rule
        await axios.put(`/api/prices/${currentRule.id}`, formData);
        showSnackbar('Price rule updated successfully');
      } else {
        // Create new rule
        await axios.post('/api/prices', formData);
        showSnackbar('Price rule added successfully');
      }
      fetchPriceRules();
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving price rule', 'error');
    }
  };

  const openDeleteConfirm = (rule) => {
    setCurrentRule(rule);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/prices/${currentRule.id}`);
      showSnackbar('Price rule deleted successfully');
      fetchPriceRules();
      setDeleteConfirmOpen(false);
    } catch (error) {
      showSnackbar('Error deleting price rule', 'error');
    }
  };

  const getCountryNameById = (id) => {
    const country = countries.find(c => c.id === id);
    return country ? country.name : 'Unknown';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Price Rules</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Price Rule
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Country</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {priceRules.length > 0 ? (
              priceRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.country ? rule.country.name : getCountryNameById(rule.countryId)}</TableCell>
                  <TableCell>
                    <Chip
                      label={rule.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                      color={rule.type === 'percentage' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{rule.type === 'percentage' ? `${rule.value}%` : `$${rule.value}`}</TableCell>
                  <TableCell>{rule.productCategory === 'all' ? 'All Products' : rule.productCategory}</TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <Chip
                      label={rule.active ? 'Active' : 'Inactive'}
                      color={rule.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(rule)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteConfirm(rule)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No price rules found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Price Rule Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentRule ? 'Edit Price Rule' : 'Add New Price Rule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                name="countryId"
                value={formData.countryId}
                label="Country"
                onChange={handleInputChange}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name} ({country.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel id="type-label">Adjustment Type</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={formData.type}
                label="Adjustment Type"
                onChange={handleInputChange}
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="value"
              label={formData.type === 'percentage' ? 'Percentage Value' : 'Fixed Amount Value'}
              type="number"
              fullWidth
              value={formData.value}
              onChange={handleInputChange}
              InputProps={{ 
                inputProps: { min: 0 },
                endAdornment: formData.type === 'percentage' ? '%' : '$'
              }}
            />

            <TextField
              margin="dense"
              name="productCategory"
              label="Product Category (leave 'all' for all categories)"
              type="text"
              fullWidth
              value={formData.productCategory}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="productId"
              label="Product ID (leave empty for all products)"
              type="text"
              fullWidth
              value={formData.productId}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="minOrderValue"
              label="Minimum Order Value"
              type="number"
              fullWidth
              value={formData.minOrderValue}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 0 } }}
            />

            <TextField
              margin="dense"
              name="priority"
              label="Priority (higher number = higher priority)"
              type="number"
              fullWidth
              value={formData.priority}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 0 } }}
            />

            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={2}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleInputChange}
                  name="active"
                  color="primary"
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            disabled={formData.countryId === '' || formData.value === ''}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this price rule? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PriceRules;
