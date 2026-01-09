/**
 * SKU Generator Utility
 * Generates alphanumeric SKU values with 8-12 characters
 */

/**
 * Generate a random alphanumeric SKU
 * @param {number} length - Length of SKU (between 8-12)
 * @param {string} prefix - Optional prefix (will be truncated if needed)
 * @returns {string} - Generated SKU
 */
const generateAlphanumericSKU = (length = 10, prefix = '') => {
  // Validate length
  if (length < 8 || length > 12) {
    length = 10; // Default to 10 if invalid
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  // If prefix is provided, use first few characters
  if (prefix) {
    const cleanPrefix = prefix.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const prefixLength = Math.min(cleanPrefix.length, Math.floor(length / 2));
    result = cleanPrefix.substring(0, prefixLength);
  }

  // Generate remaining characters
  const remainingLength = length - result.length;
  for (let i = 0; i < remainingLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

/**
 * Generate SKU from brand and product name
 * @param {string} brand - Brand name
 * @param {string} productName - Product name
 * @param {number} length - Desired length (8-12)
 * @returns {string} - Generated SKU
 */
const generateSKUFromProduct = (brand = '', productName = '', length = 10) => {
  // Create prefix from brand (2-3 chars) and product (1-2 chars)
  const brandChars = brand.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 3);
  const productChars = productName.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 2);
  
  const prefix = brandChars + productChars;
  
  return generateAlphanumericSKU(length, prefix);
};

/**
 * Generate a batch of unique SKUs
 * @param {number} count - Number of SKUs to generate
 * @param {number} length - Length of each SKU
 * @param {Array} existingSKUs - Array of existing SKUs to avoid duplicates
 * @returns {Array} - Array of unique SKUs
 */
const generateUniqueSKUs = (count, length = 10, existingSKUs = []) => {
  const skus = new Set();
  const existingSet = new Set(existingSKUs.map(sku => sku.toUpperCase()));

  while (skus.size < count) {
    const newSKU = generateAlphanumericSKU(length);
    if (!existingSet.has(newSKU) && !skus.has(newSKU)) {
      skus.add(newSKU);
    }
  }

  return Array.from(skus);
};

/**
 * Validate SKU format (8-12 alphanumeric characters)
 * @param {string} sku - SKU to validate
 * @returns {boolean} - True if valid
 */
const validateSKU = (sku) => {
  if (!sku || typeof sku !== 'string') return false;
  
  const cleanSKU = sku.trim().toUpperCase();
  
  // Check length (8-12 characters)
  if (cleanSKU.length < 8 || cleanSKU.length > 12) return false;
  
  // Check if alphanumeric only
  return /^[A-Z0-9]+$/.test(cleanSKU);
};

/**
 * Generate SKU with retry logic to ensure uniqueness
 * @param {Function} checkUnique - Function to check if SKU is unique (should return boolean)
 * @param {Object} options - Options object
 * @param {string} options.brand - Brand name
 * @param {string} options.productName - Product name  
 * @param {number} options.length - SKU length
 * @param {number} options.maxRetries - Maximum retry attempts
 * @returns {Promise<string>} - Unique SKU
 */
const generateUniqueSKU = async (checkUnique, options = {}) => {
  const {
    brand = '',
    productName = '',
    length = 10,
    maxRetries = 10
  } = options;

  let attempts = 0;
  
  while (attempts < maxRetries) {
    const sku = brand || productName 
      ? generateSKUFromProduct(brand, productName, length)
      : generateAlphanumericSKU(length);
    
    const isUnique = await checkUnique(sku);
    if (isUnique) {
      return sku;
    }
    
    attempts++;
  }
  
  // If all attempts failed, generate a timestamp-based SKU as fallback
  const timestamp = Date.now().toString().slice(-6);
  return generateAlphanumericSKU(length - timestamp.length) + timestamp;
};

module.exports = {
  generateAlphanumericSKU,
  generateSKUFromProduct,
  generateUniqueSKUs,
  validateSKU,
  generateUniqueSKU
};