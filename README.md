# Country-specific Pricing for Ideasoft

This project provides a complete solution for implementing country-specific pricing in an Ideasoft e-commerce platform. It includes a backend API, an admin panel, and an injection script to modify prices displayed to customers based on their country.

## Project Structure

The project consists of three main components:

1. **Backend** (`/backend`): Node.js/Express API with MySQL and Sequelize ORM for storing and managing country-specific pricing rules
2. **Frontend** (`/frontend`): React-based admin panel for managing countries and price rules
3. **Injection** (`/injection`): JavaScript module to be injected into the Ideasoft site to modify prices dynamically

## Features

- Country management (add, edit, delete)
- Price rule management with support for:
  - Percentage-based adjustments (e.g., +10%)
  - Fixed amount adjustments (e.g., +$5)
  - Product category-specific rules
  - Individual product-specific rules
  - Priority-based rule application
- Admin dashboard with statistics
- Real-time price modification on the Ideasoft storefront
- Country detection based on visitor's IP address

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- MySQL 5.7 or higher
- Ideasoft e-commerce platform with access to add custom JavaScript

### Installation

1. Clone this repository to your server
2. Set up the backend:
   ```
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MySQL connection details
   npm run dev
   ```

3. Set up the frontend admin panel:
   ```
   cd frontend
   npm install
   npm start
   ```

4. Follow the instructions in `/injection/README.md` to add the script to your Ideasoft site

## Usage

1. Use the admin panel to add countries and create pricing rules
2. The injection script will automatically detect a visitor's country and apply the appropriate pricing rules
3. Customers will see adjusted prices based on their location

## Customization

### Backend

- Add additional fields to price rules in `backend/src/models/PriceRule.js`
- Modify the calculation logic in `backend/src/controllers/price-controller.js`

### Frontend

- Customize the admin UI in the React components
- Add additional statistics or visualizations to the dashboard

### Injection Script

- Adjust the selectors in `injection/src/countryPricing.js` to match your Ideasoft theme
- Modify the price formatting to match your currency format

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support with installation or customization, please contact [your-email@example.com]. 