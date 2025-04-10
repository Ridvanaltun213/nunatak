const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(express.json());

// Sample pricing rules data
const countryPricingRules = {
  'TR': [
    {
      id: 1,
      type: 'percentage',
      value: 5,
      productId: null,
      productCategory: 'all',
      priority: 10
    }
  ],
  'US': [
    {
      id: 2,
      type: 'percentage',
      value: 0,
      productId: null,
      productCategory: 'all',
      priority: 10
    }
  ],
  'DE': [
    {
      id: 3,
      type: 'percentage',
      value: 7,
      productId: null,
      productCategory: 'all',
      priority: 10
    }
  ]
};

// API endpoint for country-specific pricing
app.get('/api/prices/country-code/:countryCode', (req, res) => {
  const { countryCode } = req.params;
  const rules = countryPricingRules[countryCode] || [];
  res.json(rules);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 