const { PriceRule, Country } = require('../models');
const { Op } = require('sequelize');

// Get all price rules
exports.getAllPriceRules = async (req, res) => {
  try {
    const priceRules = await PriceRule.findAll({
      include: [{
        model: Country,
        as: 'country',
        attributes: ['id', 'name', 'code']
      }],
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });
      
    res.status(200).json(priceRules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price rules', error: error.message });
  }
};

// Get price rules by country
exports.getPriceRulesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    
    const country = await Country.findByPk(countryId);
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    const priceRules = await PriceRule.findAll({
      where: { countryId },
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });
      
    res.status(200).json(priceRules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price rules', error: error.message });
  }
};

// Get active price rules by country code
exports.getActivePriceRulesByCountryCode = async (req, res) => {
  try {
    const { countryCode } = req.params;
    
    const country = await Country.findOne({
      where: { code: countryCode.toUpperCase() }
    });
    
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    const priceRules = await PriceRule.findAll({ 
      where: { 
        countryId: country.id,
        active: true
      },
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });
      
    res.status(200).json(priceRules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price rules', error: error.message });
  }
};

// Get price rule by ID
exports.getPriceRuleById = async (req, res) => {
  try {
    const priceRule = await PriceRule.findByPk(req.params.id, {
      include: [{
        model: Country,
        as: 'country',
        attributes: ['id', 'name', 'code']
      }]
    });
      
    if (!priceRule) {
      return res.status(404).json({ message: 'Price rule not found' });
    }
    
    res.status(200).json(priceRule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price rule', error: error.message });
  }
};

// Create new price rule
exports.createPriceRule = async (req, res) => {
  try {
    const {
      countryId,
      type,
      value,
      productCategory,
      productId,
      minOrderValue,
      active,
      description,
      priority
    } = req.body;
    
    // Validate country exists
    const countryExists = await Country.findByPk(countryId);
    if (!countryExists) {
      return res.status(400).json({ message: 'Invalid country ID' });
    }
    
    const newPriceRule = await PriceRule.create({
      countryId,
      type,
      value,
      productCategory: productCategory || 'all',
      productId: productId || null,
      minOrderValue: minOrderValue || 0,
      active: active !== undefined ? active : true,
      description: description || '',
      priority: priority || 0
    });
    
    // Fetch the created price rule with country relation
    const savedPriceRule = await PriceRule.findByPk(newPriceRule.id, {
      include: [{
        model: Country,
        as: 'country',
        attributes: ['id', 'name', 'code']
      }]
    });
    
    res.status(201).json(savedPriceRule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating price rule', error: error.message });
  }
};

// Update price rule
exports.updatePriceRule = async (req, res) => {
  try {
    const {
      countryId,
      type,
      value,
      productCategory,
      productId,
      minOrderValue,
      active,
      description,
      priority
    } = req.body;
    
    // If country is being updated, validate it exists
    if (countryId) {
      const countryExists = await Country.findByPk(countryId);
      if (!countryExists) {
        return res.status(400).json({ message: 'Invalid country ID' });
      }
    }
    
    const updateData = {};
    if (countryId) updateData.countryId = countryId;
    if (type) updateData.type = type;
    if (value !== undefined) updateData.value = value;
    if (productCategory) updateData.productCategory = productCategory;
    if (productId !== undefined) updateData.productId = productId;
    if (minOrderValue !== undefined) updateData.minOrderValue = minOrderValue;
    if (active !== undefined) updateData.active = active;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    
    const [updated] = await PriceRule.update(
      updateData,
      { where: { id: req.params.id } }
    );
    
    if (updated === 0) {
      return res.status(404).json({ message: 'Price rule not found' });
    }
    
    const updatedPriceRule = await PriceRule.findByPk(req.params.id, {
      include: [{
        model: Country,
        as: 'country',
        attributes: ['id', 'name', 'code']
      }]
    });
    
    res.status(200).json(updatedPriceRule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating price rule', error: error.message });
  }
};

// Delete price rule
exports.deletePriceRule = async (req, res) => {
  try {
    const deleted = await PriceRule.destroy({
      where: { id: req.params.id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: 'Price rule not found' });
    }
    
    res.status(200).json({ message: 'Price rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting price rule', error: error.message });
  }
};

// Calculate adjusted price
exports.calculatePrice = async (req, res) => {
  try {
    const { countryCode, productId, productCategory, originalPrice } = req.body;
    
    if (!countryCode || originalPrice === undefined) {
      return res.status(400).json({ message: 'Country code and original price are required' });
    }
    
    // Find country by code
    const country = await Country.findOne({
      where: { code: countryCode.toUpperCase() }
    });
    
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    // Get active price rules for this country
    const priceRules = await PriceRule.findAll({
      where: {
        countryId: country.id,
        active: true
      },
      order: [['priority', 'DESC']]
    });
    
    // Apply the most specific matching rule
    let adjustedPrice = parseFloat(originalPrice);
    let appliedRule = null;
    
    for (const rule of priceRules) {
      // Check if rule applies to this product
      const matchesProduct = rule.productId === null || 
                           rule.productId === productId;
                           
      const matchesCategory = rule.productCategory === 'all' || 
                            rule.productCategory === productCategory;
      
      if (matchesProduct && matchesCategory) {
        if (rule.type === 'percentage') {
          adjustedPrice = adjustedPrice * (1 + rule.value / 100);
        } else if (rule.type === 'fixed') {
          adjustedPrice = adjustedPrice + rule.value;
        }
        
        appliedRule = rule;
        break; // Apply only the highest priority rule
      }
    }
    
    res.status(200).json({
      originalPrice: parseFloat(originalPrice),
      adjustedPrice,
      countryCode: country.code,
      countryName: country.name,
      appliedRule
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating price', error: error.message });
  }
}; 