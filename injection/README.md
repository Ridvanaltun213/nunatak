# Country-specific Pricing Injection for Ideasoft

This module contains the injection scripts that integrate the country-specific pricing functionality into an Ideasoft e-commerce website.

## How It Works

The script:
1. Detects the user's country based on IP geolocation 
2. Fetches the appropriate pricing rules from the backend API
3. Modifies the prices displayed on the website in real-time
4. Adds a visual indicator showing which country's pricing is being displayed

## Project Structure

```
/injection
  /src
    countryPricing.js    - Main injection script for Ideasoft integration
  /server
    server.js            - Demo API server for country pricing rules
    package.json         - Server dependencies
  index.html             - Demo page for testing
  package.json           - Project dependencies
  .gitignore             - Git ignore file
  README.md              - This file
```

## Local Development Setup

1. Install dependencies:
   ```
   npm install
   cd server
   npm install
   ```

2. Start the API server:
   ```
   npm run dev
   ```

3. Open `index.html` in your browser to test the country pricing functionality.

## Installation in Ideasoft

### Method 1: JavaScript Injection

Add the following script tag to your Ideasoft template files, typically in the footer section:

```html
<script src="https://your-domain.com/path/to/countryPricing.js"></script>
```

### Method 2: Admin Panel Integration

If your Ideasoft installation supports custom JavaScript in the admin panel:

1. Go to the Ideasoft admin panel
2. Navigate to Design/Customization settings
3. Find the section for Custom JavaScript
4. Copy the entire contents of the `src/countryPricing.js` file and paste it there
5. Save your changes

## Configuration

Edit the `src/countryPricing.js` file to adjust these settings:

```javascript
// Configuration
const API_BASE_URL = 'http://138.199.158.118:5000/api'; // Change to your production API URL
```

## Customization

The script uses some generic CSS selectors to find price elements. You may need to adjust these selectors in the script to match your specific Ideasoft theme:

```javascript
// Update product price elements (customize selectors based on Ideasoft's structure)
const priceElements = document.querySelectorAll('.product-price, .price-value, [data-product-price]');
```

## Troubleshooting

If prices aren't updating correctly:

1. Open your browser's developer console
2. Check for any JavaScript errors
3. Look for the "Detected country" and "Loaded price rules" log messages
4. Ensure the API_BASE_URL is correct
5. Verify that your price selectors match the DOM structure of your Ideasoft site

## Security Considerations

- The script accesses your pricing API, so ensure proper CORS settings and API security
- Consider using HTTPS for both your Ideasoft site and API
- Implement rate limiting on your API to prevent abuse 