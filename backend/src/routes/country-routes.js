const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country-controller');

// GET routes
router.get('/', countryController.getAllCountries);
router.get('/active', countryController.getActiveCountries);
router.get('/:id', countryController.getCountryById);

// POST routes
router.post('/', countryController.createCountry);

// PUT routes
router.put('/:id', countryController.updateCountry);

// DELETE routes
router.delete('/:id', countryController.deleteCountry);

module.exports = router; 