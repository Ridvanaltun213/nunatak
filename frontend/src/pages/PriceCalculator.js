import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import CalculateIcon from '@mui/icons-material/Calculate';

const PriceCalculator = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    countryCode: '',
    productId: '',
    productCategory: '',
    originalPrice: ''
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries/active');
      setCountries(response.data);
      
      if (response.data.length > 0) {
        setFormData(prevState => ({
          ...prevState,
          countryCode: response.data[0].code
        }));
      }
    } catch (error) {
      setError('Error fetching countries');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.originalPrice || !formData.countryCode) {
      setError('Country and original price are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post('/api/prices/calculate', {
        countryCode: formData.countryCode,
        productId: formData.productId || null,
        productCategory: formData.productCategory || null,
        originalPrice: parseFloat(formData.originalPrice)
      });
      
      setResult(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error calculating price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Price Calculator
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Calculate Price
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  name="countryCode"
                  value={formData.countryCode}
                  label="Country"
                  onChange={handleInputChange}
                  required
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.code}>
                      {country.name} ({country.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                margin="normal"
                name="originalPrice"
                label="Original Price"
                type="number"
                fullWidth
                required
                value={formData.originalPrice}
                onChange={handleInputChange}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
              
              <TextField
                margin="normal"
                name="productId"
                label="Product ID (optional)"
                type="text"
                fullWidth
                value={formData.productId}
                onChange={handleInputChange}
              />
              
              <TextField
                margin="normal"
                name="productCategory"
                label="Product Category (optional)"
                type="text"
                fullWidth
                value={formData.productCategory}
                onChange={handleInputChange}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<CalculateIcon />}
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Calculate Price'}
              </Button>
            </form>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Result
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {result ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Price for {result.countryName} ({result.countryCode})
                  </Typography>
                  
                  <Box sx={{ mt: 3, mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography color="text.secondary">Original Price:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" fontWeight="bold">
                          ${result.originalPrice.toFixed(2)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography color="text.secondary">Adjusted Price:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" fontWeight="bold" color="primary.main">
                          ${parseFloat(result.adjustedPrice).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {result.appliedRule && (
                    <>
                      <Divider sx={{ mt: 2, mb: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Applied Rule:
                      </Typography>
                      <Typography variant="body2">
                        Type: {result.appliedRule.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                      </Typography>
                      <Typography variant="body2">
                        Value: {result.appliedRule.type === 'percentage' ? `${result.appliedRule.value}%` : `$${result.appliedRule.value}`}
                      </Typography>
                      {result.appliedRule.description && (
                        <Typography variant="body2">
                          Description: {result.appliedRule.description}
                        </Typography>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {loading ? 'Calculating...' : 'Enter values and click Calculate to see results'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PriceCalculator;
