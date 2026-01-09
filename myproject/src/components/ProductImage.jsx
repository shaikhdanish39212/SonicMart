import React, { useState } from 'react';
import { getCurrentImage, handleImageError } from '../utils/imageUtils';

/**
 * ProductImage component that handles missing images gracefully
 * Shows actual product images or a "No Image Available" placeholder
 */
const ProductImage = ({ 
  product, 
  hoveredProductId = null, 
  className = "", 
  alt = null,
  showPlaceholder = true 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const imageSrc = getCurrentImage(product, hoveredProductId);
  const shouldShowImage = imageSrc && !imageError;
  const altText = alt || product.name || 'Product Image';

  const handleError = (e) => {
    setImageError(true);
    handleImageError(e, product);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-50">
      {shouldShowImage ? (
        <img 
          src={imageSrc}
          alt={altText}
          className={`w-full h-full object-contain ${className}`}
          onError={handleError}
          data-tries="0"
        />
      ) : showPlaceholder ? (
        <div className="flex flex-col items-center justify-center text-gray-400 p-4">
          <svg 
            className="w-12 h-12 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs text-center font-medium">No Image Available</span>
        </div>
      ) : null}
    </div>
  );
};

export default ProductImage;