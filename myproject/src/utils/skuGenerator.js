/**
 * Frontend SKU Generator Utility
 * Client-side SKU generation and validation functions
 */

/**
 * Generate a random alphanumeric SKU
 * @param {number} length - Length of SKU (between 8-12)
 * @param {string} prefix - Optional prefix (will be truncated if needed)
 * @returns {string} - Generated SKU
 */
export const generateAlphanumericSKU = (length = 10, prefix = '') => {
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
export const generateSKUFromProduct = (brand = '', productName = '', length = 10) => {
  // Create prefix from brand (2-3 chars) and product (1-2 chars)
  const brandChars = brand.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 3);
  const productChars = productName.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 2);
  
  const prefix = brandChars + productChars;
  
  return generateAlphanumericSKU(length, prefix);
};

/**
 * Validate SKU format (8-12 alphanumeric characters)
 * @param {string} sku - SKU to validate
 * @returns {boolean} - True if valid
 */
export const validateSKUFormat = (sku) => {
  if (!sku || typeof sku !== 'string') return false;
  
  const cleanSKU = sku.trim().toUpperCase();
  
  // Check length (8-12 characters)
  if (cleanSKU.length < 8 || cleanSKU.length > 12) return false;
  
  // Check if alphanumeric only
  return /^[A-Z0-9]+$/.test(cleanSKU);
};

/**
 * Auto-generate SKU button component helper
 * @param {string} brand - Brand name
 * @param {string} productName - Product name
 * @param {Function} onGenerate - Callback function to set the generated SKU
 * @returns {Object} - Button props and handler
 */
export const createSKUGenerator = (brand, productName, onGenerate) => {
  const handleGenerate = () => {
    const newSKU = generateSKUFromProduct(brand, productName);
    if (onGenerate) {
      onGenerate(newSKU);
    }
    return newSKU;
  };

  return {
    onClick: handleGenerate,
    disabled: !brand && !productName,
    title: brand || productName 
      ? `Generate SKU from ${[brand, productName].filter(Boolean).join(' + ')}`
      : 'Enter brand or product name first'
  };
};

/**
 * Format SKU for display (uppercase, consistent formatting)
 * @param {string} sku - SKU to format
 * @returns {string} - Formatted SKU
 */
export const formatSKU = (sku) => {
  if (!sku) return '';
  return sku.toString().toUpperCase().trim();
};

/**
 * Check if two SKUs are the same (case-insensitive comparison)
 * @param {string} sku1 - First SKU
 * @param {string} sku2 - Second SKU
 * @returns {boolean} - True if same
 */
export const compareSKUs = (sku1, sku2) => {
  if (!sku1 && !sku2) return true;
  if (!sku1 || !sku2) return false;
  
  return formatSKU(sku1) === formatSKU(sku2);
};

/**
 * Generate multiple unique SKUs (client-side)
 * Note: This doesn't check database uniqueness, only local uniqueness
 * @param {number} count - Number of SKUs to generate
 * @param {number} length - Length of each SKU
 * @returns {Array} - Array of unique SKUs
 */
export const generateMultipleSKUs = (count, length = 10) => {
  const skus = new Set();
  
  while (skus.size < count) {
    const newSKU = generateAlphanumericSKU(length);
    skus.add(newSKU);
  }
  
  return Array.from(skus);
};

/**
 * SKU validation error messages
 */
export const SKU_VALIDATION_MESSAGES = {
  required: 'SKU is required',
  invalid: 'SKU must be 8-12 alphanumeric characters (letters and numbers only)',
  tooShort: 'SKU must be at least 8 characters long',
  tooLong: 'SKU cannot be more than 12 characters long',
  invalidChars: 'SKU can only contain letters and numbers',
  duplicate: 'This SKU already exists'
};

/**
 * Get specific validation error message
 * @param {string} sku - SKU to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getSKUValidationMessage = (sku) => {
  if (!sku || !sku.toString().trim()) {
    return SKU_VALIDATION_MESSAGES.required;
  }
  
  const cleanSKU = sku.toString().trim();
  
  if (cleanSKU.length < 8) {
    return SKU_VALIDATION_MESSAGES.tooShort;
  }
  
  if (cleanSKU.length > 12) {
    return SKU_VALIDATION_MESSAGES.tooLong;
  }
  
  if (!/^[A-Z0-9]+$/i.test(cleanSKU)) {
    return SKU_VALIDATION_MESSAGES.invalidChars;
  }
  
  return null; // Valid
};

export default {
  generateAlphanumericSKU,
  generateSKUFromProduct,
  validateSKUFormat,
  createSKUGenerator,
  formatSKU,
  compareSKUs,
  generateMultipleSKUs,
  SKU_VALIDATION_MESSAGES,
  getSKUValidationMessage
};