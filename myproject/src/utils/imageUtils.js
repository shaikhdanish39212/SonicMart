// Utility functions for handling image paths and fallbacks

/**
 * Normalize image path - return null if no valid image
 * @param {string} imagePath - Original image path from API
 * @returns {string|null} - Normalized image path or null if no image
 */
export const normalizeImagePath = (imagePath) => {
  // Return null if no image path - don't show fallback images
  if (!imagePath) return null;
  
  // If already a valid path, return as is
  if (imagePath.startsWith('/images/') && !imagePath.includes('processed')) {
    return imagePath;
  }
  
  // Remove processed path if present
  if (imagePath.includes('/images/processed/')) {
    return imagePath.replace('/images/processed/', '/images/');
  }
  
  // Return the path as-is or null if empty
  return imagePath || null;
};

/**
 * Get current image for a product with hover effect
 * @param {Object} product - Product object
 * @param {string|null} hoveredProductId - ID of currently hovered product
 * @returns {string|null} - Image path to display or null if no image
 */
export const getCurrentImage = (product, hoveredProductId = null) => {
  const productId = product._id || product.id;
  
  // Show gallery image on hover if available
  if (hoveredProductId === productId && product.galleryImages && product.galleryImages.length > 0) {
    const hoverImage = normalizeImagePath(product.galleryImages[0]);
    if (hoverImage) return hoverImage;
  }
  
  // Return main product image or null if none exists
  return normalizeImagePath(product.image);
};

/**
 * Handle image error - hide the image instead of showing fallbacks
 * @param {Event} e - Image error event
 * @param {Object} product - Product object (optional)
 */
export const handleImageError = (e, product = null) => {
  const img = e.target;
  if (!img) return;
  
  // Instead of showing fallback images, hide the broken image
  // and let the component show a "No Image Available" placeholder
  img.style.display = 'none';
  
  // Dispatch a custom event to notify the component that image failed
  const imageErrorEvent = new CustomEvent('imageLoadError', {
    detail: { product, originalSrc: img.src }
  });
  img.dispatchEvent(imageErrorEvent);
};

/**
 * Get all valid images for a product (main + gallery)
 * @param {Object} product - Product object
 * @returns {Array} - Array of valid normalized image paths (no fallbacks)
 */
export const getAllProductImages = (product) => {
  const images = [];
  
  // Add main image only if it exists
  if (product.image) {
    const normalizedImg = normalizeImagePath(product.image);
    if (normalizedImg) {
      images.push(normalizedImg);
    }
  }
  
  // Add gallery images only if they exist
  if (product.galleryImages && Array.isArray(product.galleryImages)) {
    product.galleryImages.forEach(img => {
      const normalizedImg = normalizeImagePath(img);
      if (normalizedImg && !images.includes(normalizedImg)) {
        images.push(normalizedImg);
      }
    });
  }
  
  // Return only actual images - no fallbacks
  return images;
};

/**
 * Check if an image path is provided and properly formatted
 * @param {string} imagePath - Image path to check
 * @returns {boolean} - Whether the path looks valid
 */
export const isValidImagePath = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return false;
  
  // Check for basic image path patterns (but don't guarantee the file exists)
  const validPatterns = [
    /\/images\/[A-Za-z0-9_-]+\.(png|jpg|jpeg|webp)$/i,
    /^https?:\/\/.*\.(png|jpg|jpeg|webp)$/i
  ];
  
  return validPatterns.some(pattern => pattern.test(imagePath));
};

export default {
  normalizeImagePath,
  getCurrentImage,
  handleImageError,
  getAllProductImages,
  isValidImagePath
};