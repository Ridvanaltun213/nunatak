const { Country } = require('../models');

// Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      order: [['name', 'ASC']]
    });
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries', error: error.message });
  }
};

// Get active countries
exports.getActiveCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      where: { active: true },
      order: [['name', 'ASC']]
    });
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active countries', error: error.message });
  }
};

// Get country by ID
exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching country', error: error.message });
  }
};

// Create new country
exports.createCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    
    // Check if country code already exists
    const existingCountry = await Country.findOne({
      where: { code: code.toUpperCase() }
    });
    
    if (existingCountry) {
      return res.status(400).json({ message: 'Country with this code already exists' });
    }
    
    const newCountry = await Country.create({
      name,
      code: code.toUpperCase(),
      active: req.body.active !== undefined ? req.body.active : true
    });
    
    res.status(201).json(newCountry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating country', error: error.message });
  }
};

// Update country
exports.updateCountry = async (req, res) => {
  try {
    const { name, code, active } = req.body;
    
    // If code is being updated, check it doesn't conflict with existing
    if (code) {
      const existingCountry = await Country.findOne({
        where: {
          code: code.toUpperCase(),
          id: { [require('sequelize').Op.ne]: req.params.id }
        }
      });
      
      if (existingCountry) {
        return res.status(400).json({ message: 'Country with this code already exists' });
      }
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (code) updateData.code = code.toUpperCase();
    if (active !== undefined) updateData.active = active;
    
    const [updated] = await Country.update(updateData, {
      where: { id: req.params.id },
      returning: true
    });
    
    if (updated === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    const updatedCountry = await Country.findByPk(req.params.id);
    res.status(200).json(updatedCountry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating country', error: error.message });
  }
};

// Delete country
exports.deleteCountry = async (req, res) => {
  try {
    const deleted = await Country.destroy({
      where: { id: req.params.id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }
    
    res.status(200).json({ message: 'Country deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting country', error: error.message });
  }
}; 