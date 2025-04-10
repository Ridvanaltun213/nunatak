# Country-specific Pricing Backend for Ideasoft

This is the backend service for managing country-specific pricing for Ideasoft e-commerce platform.

## Features

- RESTful API for country management
- Price rule management (percentage or fixed amount adjustments)
- Price calculation endpoint
- MySQL database storage with Sequelize ORM

## Prerequisites

- Node.js 14.x or higher
- MySQL 5.7 or higher

## Installation

1. Clone this repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Copy .env.example to .env and configure your database connection:
   ```
   cp .env.example .env
   ```
   Edit the .env file to set your MySQL connection details:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=country_pricing
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   ```
5. Create a MySQL database named `country_pricing`
6. Start the development server:
   ```
   npm run dev
   ```
   The server will automatically create the necessary tables.

## API Endpoints

### Countries

- `GET /api/countries` - Get all countries
- `GET /api/countries/active` - Get active countries
- `GET /api/countries/:id` - Get country by ID
- `POST /api/countries` - Create a new country
- `PUT /api/countries/:id` - Update a country
- `DELETE /api/countries/:id` - Delete a country

### Price Rules

- `GET /api/prices` - Get all price rules
- `GET /api/prices/:id` - Get price rule by ID
- `GET /api/prices/country/:countryId` - Get price rules by country ID
- `GET /api/prices/country-code/:countryCode` - Get active price rules by country code
- `POST /api/prices` - Create a new price rule
- `PUT /api/prices/:id` - Update a price rule
- `DELETE /api/prices/:id` - Delete a price rule
- `POST /api/prices/calculate` - Calculate adjusted price for a product

## Price Calculation

To calculate a price for a product in a specific country, send a POST request to `/api/prices/calculate` with the following JSON structure:

```json
{
  "countryCode": "US",
  "productId": "123456",
  "productCategory": "electronics",
  "originalPrice": 100
}
```

The response will contain the adjusted price based on the applicable price rules for that country. 