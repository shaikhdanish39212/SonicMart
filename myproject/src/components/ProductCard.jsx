
import React, { useContext, useState, memo } from 'react';
import { Link } from 'react-router-dom';
// removed: import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import ProductImage from './ProductImage';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaEye, 
  FaExchangeAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSpinner
} from 'react-icons/fa';

const ProductCard = memo(({ product }) => {
  const { addToCart, isAddingToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, isInComparison, getComparisonCount } = useProductComparison();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleMouseEnter = () => {
    setHoveredProduct(product._id || product.id);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToWishlist(true);
    try {
      if (isInWishlist(product._id || product.id)) {
        await removeFromWishlist(product._id || product.id);
      } else {
        await addToWishlist(product);
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToComparison = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToComparison(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div 
      className="group transform transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setHoveredProduct(product._id || product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <div className="product-card bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col">
        {/* Product Image with Hover Effect */}
        <Link to={`/product/${product._id || product.id}`} className="block relative">
          <div className="aspect-square rounded-lg bg-brand-cream/20 mb-3 md:mb-4 overflow-hidden">
            <ProductImage
              product={product}
              hoveredProductId={hoveredProduct}
              className="p-4 transition-transform duration-500 group-hover:scale-110"
              alt={product.name}
            />
          </div>
          
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-brand-coral text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
              {product.discount}% OFF
            </div>
          )}
          
          {/* Featured Badge - Only show if product is featured and no discount */}
          {product.featured && !product.discount && (
            <div className="absolute top-2 right-2 bg-brand-blue text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
              Featured
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="product-content p-4 md:p-6 flex-1 flex flex-col">
          {/* Product Title */}
          <h3 className="font-bold text-lg md:text-xl text-brand-dark mb-2 group-hover:text-brand-coral transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-brand-dark/60 text-sm mb-4 line-clamp-2">
            {product.description || 'High quality headphones with exceptional performance and reliability.'}
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-brand-dark">
              ₹{Math.round(product.discountedPrice || product.price).toLocaleString('en-IN')}
            </span>
            {product.discount && (
              <span className="text-sm text-brand-dark/50 line-through">
                ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="product-actions mt-auto space-y-3">
            {/* Wishlist and Compare Row */}
            <div className="flex gap-2">
              {/* Wishlist Button */}
              <button 
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isInWishlist(product._id || product.id)
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isAddingToWishlist ? (
                  <FaSpinner className="animate-spin" />
                ) : isInWishlist(product._id || product.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              
              {/* Compare Button */}
              <button 
                onClick={handleAddToComparison}
                disabled={isInComparison(product._id || product.id) || getComparisonCount() >= 4}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isInComparison(product._id || product.id)
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : getComparisonCount() >= 4
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaExchangeAlt className={isInComparison(product._id || product.id) ? 'text-blue-500' : ''} />
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart(product._id || product.id) || product.stock === 0}
              className={`w-full px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                isAddingToCart(product._id || product.id) 
                  ? 'bg-green-500 text-white scale-105' 
                  : product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-brand-coral hover:bg-brand-coral/90 text-white'
              }`}
            >
              {isAddingToCart(product._id || product.id) ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                product.stock === 0 ? 'Out of Stock' : 'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Custom comparison function for React.memo
ProductCard.displayName = 'ProductCard';

export default ProductCard;
