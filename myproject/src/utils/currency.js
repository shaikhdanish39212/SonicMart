// Currency formatting utility for Indian Rupees
export const formatPrice = (price) => {
  // Use explicit rupee symbol to ensure consistency across all systems
  return `₹${Math.round(price).toLocaleString('en-IN')}`;
};

// Alternative simple format without currency symbol
export const formatPriceNumber = (price) => {
  return Math.round(price).toLocaleString('en-IN');
};

// Format price with custom currency symbol
export const formatPriceWithSymbol = (price, symbol = '₹') => {
  return `${symbol}${Math.round(price).toLocaleString('en-IN')}`;
};

// Parse price from formatted string
export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  return parseFloat(priceString.replace(/[^\d.-]/g, '')) || 0;
};

// Default export
export default formatPrice;
 