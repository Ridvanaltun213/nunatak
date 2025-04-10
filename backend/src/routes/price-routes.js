const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price-controller');

// GET routes
router.get('/', priceController.getAllPriceRules);
router.get('/country/:countryId', priceController.getPriceRulesByCountry);
router.get('/country-code/:countryCode', priceController.getActivePriceRulesByCountryCode);
router.get('/:id', priceController.getPriceRuleById);

// POST routes
router.post('/', priceController.createPriceRule);
router.post('/calculate', priceController.calculatePrice);

// PUT routes
router.put('/:id', priceController.updatePriceRule);

// DELETE routes
router.delete('/:id', priceController.deletePriceRule);

module.exports = router; 