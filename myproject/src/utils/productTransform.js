/**
 * Transform product data to ensure consistent structure across the application
 */

/**
 * Transform a single product object
 * @param {Object} product - Raw product data from API
 * @returns {Object} - Transformed product with consistent fields
 */
export const transformProduct = (product) => {
  if (!product) return null;

  return {
    ...product,
    // Ensure imageUrl field exists for backward compatibility - now using default product image
    imageUrl: product.imageUrl || product.image || '/images/DJSpeaker1.png',
    // Ensure proper discount calculation
    discountedPrice: product.discountedPrice || product.price,
    // Ensure rating exists
    rating: product.rating || product.averageRating || 0,
    // Ensure reviews count exists
    reviews: product.reviews || product.totalReviews || 0,
    // Ensure stock exists
    stock: product.stock !== undefined ? product.stock : 10,
    // Add any missing fields with defaults
    brand: product.brand || 'Generic',
    category: product.category || 'uncategorized',
  };
};

/**
 * Transform an array of products
 * @param {Array} products - Array of raw product data
 * @returns {Array} - Array of transformed products
 */
export const transformProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(transformProduct).filter(Boolean);
};

/**
 * Transform API response containing products
 * @param {Object} response - API response object
 * @returns {Object} - Transformed response
 */
export const transformProductResponse = (response) => {
  if (!response || !response.data) return response;

  // Handle single product response
  if (response.data.product) {
    return {
      ...response,
      data: {
        ...response.data,
        product: transformProduct(response.data.product),
      },
    };
  }

  // Handle multiple products response
  if (response.data.products) {
    return {
      ...response,
      data: {
        ...response.data,
        products: transformProducts(response.data.products),
      },
    };
  }

  return response;
};

export default {
  transformProduct,
  transformProducts,
  transformProductResponse,
}; 