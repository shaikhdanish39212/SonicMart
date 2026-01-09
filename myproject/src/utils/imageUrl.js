/**
 * Utility to construct proper image URLs from relative paths
 * Images are served from the Vite frontend public folder, not the backend
 */

/**
 * Get the proper URL for an image path
 * @param {string} imagePath - The image path (e.g., 'Speaker1.png' or '/images/Speaker1.png')
 * @returns {string} - The proper URL (e.g., '/images/Speaker1.png')
 */
export const getImageUrl = (imagePath) => {
  // Since all products now have real images, use a default product image instead of placeholder
  if (!imagePath) return '/images/DJSpeaker1.png';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Handle internal components paths specifically - they already have the full path
  if (imagePath.includes('/internal_components/images/')) {
    return imagePath; // Already in correct format: /images/internal_components/images/filename.png
  }
  
  // If it's already a proper relative path starting with /images/, use it as-is
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  
  // Handle internal components paths specifically (legacy support)
  if (imagePath.startsWith('internal_components/')) {
    return `/images/${imagePath}`;
  }
  
  // If it starts with /, but not /images/, fix it
  if (imagePath.startsWith('/')) {
    return `/images${imagePath}`;
  }
  
  // Otherwise, assume it's just the filename and prepend /images/
  return `/images/${imagePath}`;
};

export default getImageUrl;