/**
 * Ideasoft Country-Specific Pricing Integration
 * 
 * This script integrates with Ideasoft to provide country-specific pricing based on the user's location.
 * It fetches the appropriate pricing rules from the backend API and applies them to the product prices displayed on the site.
 */

(function() {
  // Configuration
  const API_BASE_URL = 'http://138.199.158.118:5000/api'; // Replace with your actual API URL in production
  
  // Cache for price rules and country data
  let priceRulesCache = null;
  let userCountry = null;
  let originalPrices = {};
  
  /**
   * Detect user's country
   * This uses the browser's navigator.language as a fallback,
   * but should preferably be replaced with a proper geolocation service in production
   */
  async function detectUserCountry() {
    try {
      // Try to get country from IP geolocation service (replace with your preferred service)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_code;
    } catch (error) {
      console.error('Error detecting country:', error);
      
      // Fallback to browser language
      const language = navigator.language || navigator.userLanguage;
      if (language && language.includes('-')) {
        return language.split('-')[1];
      }
      
      // Default fallback
      return 'US';
    }
  }
  
  /**
   * Fetch price rules for a specific country
   */
  async function fetchPriceRules(countryCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/prices/country-code/${countryCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rules = await response.json();
      return rules;
    } catch (error) {
      console.error('Error fetching price rules:', error);
      return [];
    }
  }
  
  /**
   * Calculate adjusted price for a product
   */
  function calculateAdjustedPrice(originalPrice, productId, productCategory) {
    if (!priceRulesCache || priceRulesCache.length === 0) {
      return originalPrice;
    }
    
    let adjustedPrice = parseFloat(originalPrice);
    
    // Find the most specific matching rule with highest priority
    // Sort by priority descending (already done by the API, but just to be safe)
    const sortedRules = [...priceRulesCache].sort((a, b) => b.priority - a.priority);
    
    for (const rule of sortedRules) {
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
        
        // Apply only the highest priority rule that matches
        break;
      }
    }
    
    return adjustedPrice.toFixed(2);
  }
  
  /**
   * Get product information from the current page
   * This function should be customized to match Ideasoft's HTML structure
   */
  function getProductInfo() {
    // Get product information from the current element or page
    // For a product page, get the single product ID
    const productElement = document.querySelector('[data-product-id]');
    if (productElement) {
      const productId = productElement.getAttribute('data-product-id');
      const productCategory = productElement.getAttribute('data-category-id');
      return { productId, productCategory };
    }
    
    // For category or listing pages, we'll return null values to apply general rules
    return { productId: null, productCategory: 'all' };
  }
  
  /**
   * Update prices on the page
   * This function should be customized to match Ideasoft's HTML structure
   */
  function updatePrices() {
    if (!priceRulesCache) return;
    
    const { productId, productCategory } = getProductInfo();
    
    // Update product price elements (customize selectors based on Ideasoft's structure)
    const priceElements = document.querySelectorAll('.product-price, .price-value, [data-product-price]');
    
    priceElements.forEach(el => {
      // Store original price if not already stored
      const originalPrice = originalPrices[el.id] || el.getAttribute('data-original-price') || el.textContent.trim().replace(/[^0-9.,]/g, '');
      
      if (!originalPrices[el.id]) {
        originalPrices[el.id] = originalPrice;
        // Store original price as data attribute too
        el.setAttribute('data-original-price', originalPrice);
      }
      
      // Calculate and display adjusted price
      const adjustedPrice = calculateAdjustedPrice(originalPrice, productId, productCategory);
      
      // Update element with new price
      // Format according to Ideasoft's currency format (this is a basic example)
      const currencySymbol = el.textContent.trim().replace(/[0-9.,]/g, '')[0] || '$';
      el.textContent = `${currencySymbol}${adjustedPrice}`;
      
      // Mark price as adjusted
      el.setAttribute('data-price-adjusted', 'true');
      el.setAttribute('data-country', userCountry);
    });
    
    // Add a visual indicator for country-specific pricing
    if (!document.querySelector('.country-price-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'country-price-indicator';
      indicator.style.padding = '5px 10px';
      indicator.style.background = '#f8f9fa';
      indicator.style.borderRadius = '4px';
      indicator.style.margin = '10px 0';
      indicator.style.fontSize = '0.85em';
      indicator.style.color = '#666';
      indicator.textContent = `Prices shown for ${userCountry}`;
      
      // Insert indicator near the price (customize based on Ideasoft's structure)
      const priceContainer = document.querySelector('.product-price-container, .price-container');
      if (priceContainer) {
        priceContainer.appendChild(indicator);
      }
    }
  }
  
  /**
   * Initialize the country pricing integration
   */
  async function init() {
    try {
      // Detect user's country
      userCountry = await detectUserCountry();
      console.log('Detected country:', userCountry);
      
      // Fetch price rules for this country
      priceRulesCache = await fetchPriceRules(userCountry);
      console.log('Loaded price rules:', priceRulesCache);
      
      // Update prices on the page
      updatePrices();
      
      // Watch for dynamic content changes (useful for single-page apps)
      const observer = new MutationObserver((mutations) => {
        // If price elements change, update prices again
        const priceChanged = mutations.some(mutation => 
          [...mutation.addedNodes].some(node => 
            node.querySelector && node.querySelector('.product-price, .price-value, [data-product-price]')
          )
        );
        
        if (priceChanged) {
          updatePrices();
        }
      });
      
      // Start observing the document
      observer.observe(document.body, { childList: true, subtree: true });
      
    } catch (error) {
      console.error('Error initializing country pricing:', error);
    }
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 