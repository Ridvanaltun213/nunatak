const sequelize = require('../config/database');
const Country = require('./Country');
const PriceRule = require('./PriceRule');

// Models are already associated in their respective files

const db = {
  sequelize,
  Country,
  PriceRule
};

module.exports = db; 