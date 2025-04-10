const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Country = require('./Country');

const PriceRule = sequelize.define('PriceRule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Country,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['percentage', 'fixed']]
    }
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  productCategory: {
    type: DataTypes.STRING,
    defaultValue: 'all'
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  minOrderValue: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'price_rules',
  timestamps: true
});

// Define associations
PriceRule.belongsTo(Country, { 
  foreignKey: 'countryId',
  as: 'country'
});

Country.hasMany(PriceRule, {
  foreignKey: 'countryId',
  as: 'priceRules'
});

module.exports = PriceRule; 