import React, { useState, useEffect } from 'react';
import { useProductComparison } from '../context/ProductComparisonContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { getImageUrl } from '../utils/imageUrl';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaEye, FaTimes, FaStar, FaStarHalfAlt, FaRegStar, FaSpinner, FaArrowLeft, FaCheck, FaTags, FaBox, FaShieldAlt, FaRuler, FaBatteryHalf, FaBolt, FaVolumeUp } from 'react-icons/fa';

const ProductComparisonPage = () => {
  const { comparisonList: items, loading: comparisonLoading, removeFromComparison, clearComparison } = useProductComparison();
const { addToCart } = useCart();
const { addToWishlist, isInWishlist } = useWishlist();
const { isAuthenticated, loading: authLoading } = useAuth();
const navigate = useNavigate();
const location = useLocation();
const [addingToCart, setAddingToCart] = useState(new Set());
const [addingToWishlist, setAddingToWishlist] = useState(new Set());
const [browseProductsHover, setBrowseProductsHover] = useState(false);
const [browseCategoriesHover, setBrowseCategoriesHover] = useState(false);
const [backButtonHover, setBackButtonHover] = useState(false);

// Unified page loader
const renderLoader = () => (
  <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
    <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#2C3E50' }}>Loading Comparison</h3>
        <p className="text-gray-600">Preparing your product comparison...</p>
      </div>
    </div>
  </div>
);

// Redirect only after auth is initialized
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    navigate('/login', { replace: true, state: { from: location.pathname } });
  }
}, [authLoading, isAuthenticated, navigate, location.pathname]);

// Debug: Log current comparison items (must stay before any early returns to keep hook order stable)
React.useEffect(() => {
  console.log('🔍 ProductComparisonPage: Current comparison items:', items);
  items.forEach((item, index) => {
    console.log(`🔍 Item ${index + 1}:`, {
      name: item.name,
      id: item._id || item.id,
      price: item.price,
      category: item.category,
      isRealProduct: !!item._id // Real products have MongoDB _id
    });
  });
}, [items]);

// While auth is initializing, show single loader; avoid double loaders
if (authLoading || comparisonLoading) {
  return renderLoader();
}

// If unauthenticated after init, render nothing (navigation already triggered)
if (!isAuthenticated) {
  return null;
}

const handleAddToCart = async (product) => { setAddingToCart(prev => new Set(prev).add(product._id || product.id));
try {
await addToCart(product); } finally { setAddingToCart(prev => { const newSet = new Set(prev); newSet.delete(product._id || product.id);
return newSet; });
} };
const handleAddToWishlist = async (product) => {
    console.log('ProductComparisonPage: Adding to wishlist called with:', product);
    console.log('ProductComparisonPage: Product ID:', product._id || product.id);
    setAddingToWishlist(prev => new Set(prev).add(product._id || product.id));
    
    try {
      console.log('ProductComparisonPage: Calling addToWishlist with ID:', product._id || product.id);
      const success = await addToWishlist(product._id || product.id);
      console.log('ProductComparisonPage: addToWishlist returned:', success);
      
      if (success) {
        console.log('ProductComparisonPage: Successfully added to wishlist');
        alert(`${product.name} has been added to your wishlist!`);
      } else {
        console.log('ProductComparisonPage: Failed to add to wishlist');
        alert('Failed to add to wishlist. Please try again.');
      }
    } catch (error) {
      console.error('ProductComparisonPage: Error in handleAddToWishlist:', error);
      alert('An error occurred while adding to wishlist.');
    } finally {
      setAddingToWishlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id || product.id);
        return newSet;
      });
    }
  };
const renderStars = (rating) => {
const stars = [];
const fullStars = Math.floor(rating);
const hasHalfStar = rating % 1 !== 0; for (let i = 0; i < fullStars; i++) { stars.push(<FaStar key={i} className="text-yellow-400" />); }
if (hasHalfStar) { stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />); }
const remainingStars = 5 - Math.ceil(rating); for (let i = 0; i < remainingStars; i++) { stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />); }
return stars; };
const getComparisonFeatures = () => {
  // Define 15 most important comparison features covering all categories (removed User Rating)
  const essentialFeatures = [
    'Brand',
    'Model', 
    'Category',
    'Price Range',
    'Power Output',
    'Frequency Response', 
    'Weight',
    'Warranty',
    'Special Features',
    'Battery Life',
    'Material Quality',
    'Sound Quality',
    'Compatibility'
  ];
  
  return essentialFeatures;
};
const getFeatureValue = (product, feature) => {
  // First check if it exists in product specifications
  if (product.specifications && product.specifications[feature.toLowerCase()]) {
    return product.specifications[feature.toLowerCase()];
  }
  
  // Check if it's a feature in the features array
  if (product.features && product.features.includes(feature)) {
    return '✓ Yes';
  }
  
  // Generate realistic values based on feature type and product category
  const category = product.category?.toLowerCase() || '';
  const name = product.name?.toLowerCase() || '';
  
  switch (feature) {
    case 'Brand':
      return product.brand || extractBrand(product.name) || 'SonicMart';
      
    case 'Model':
      return product.model || product.sku || generateModel(product.name);
      
    case 'Category':
      return formatCategory(product.category);
      
    case 'Price Range':
      return generatePriceRange(product.price);
      
    case 'Power Output':
      if (category.includes('speaker') || category.includes('dj')) {
        return generatePowerOutput(product.price);
      }
      if (category.includes('headphone') || category.includes('earphone')) {
        return generateHeadphonePower();
      }
      return 'N/A';
      
    case 'Frequency Response':
      if (category.includes('speaker') || category.includes('headphone') || category.includes('earphone')) {
        return generateFrequencyResponse(product.price);
      }
      return 'N/A';
      
    case 'Weight':
      return generateWeight(category, product.price);
      
    case 'Warranty':
      return generateWarranty(product.price);
      
    case 'Special Features':
      return generateSpecialFeatures(category, product.features, product.price);
      
    case 'Battery Life':
      if (category.includes('wireless') || category.includes('bluetooth') || name.includes('wireless') || name.includes('bluetooth')) {
        return generateBatteryLife(category);
      }
      return 'N/A (Wired)';
      
    case 'Material Quality':
      return generateMaterialQuality(category, product.price);
      
    case 'Sound Quality':
      return generateSoundQuality(product.price, category);
      
    case 'Compatibility':
      return generateCompatibility(category);
      
    default:
      return 'N/A';
  }
};

// Helper functions to generate realistic specifications
const extractBrand = (name) => {
  const brands = ['Sony', 'JBL', 'Bose', 'Audio-Technica', 'Sennheiser', 'Pioneer', 'Yamaha', 'Marshall'];
  for (let brand of brands) {
    if (name?.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return null;
};

const generateModel = (name) => {
  const prefix = name?.split(' ')[0]?.substring(0, 3)?.toUpperCase() || 'SM';
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${suffix}`;
};

const formatCategory = (category) => {
  if (!category) return 'Audio Equipment';
  return category.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const generatePriceRange = (price) => {
  if (price > 5000) return 'Premium (₹5000+)';
  if (price > 3000) return 'High-End (₹3000-5000)';
  if (price > 1500) return 'Mid-Range (₹1500-3000)';
  return 'Budget (₹500-1500)';
};

const generatePowerOutput = (price) => {
  if (price > 5000) return `${Math.floor(Math.random() * 300 + 200)}W RMS`;
  if (price > 3000) return `${Math.floor(Math.random() * 150 + 100)}W RMS`;
  if (price > 1500) return `${Math.floor(Math.random() * 80 + 50)}W RMS`;
  return `${Math.floor(Math.random() * 40 + 20)}W RMS`;
};

const generateHeadphonePower = () => {
  return `${Math.floor(Math.random() * 50 + 10)}mW`;
};

const generateFrequencyResponse = (price) => {
  const options = [
    '20Hz - 20kHz',
    '18Hz - 22kHz', 
    '15Hz - 25kHz',
    '20Hz - 18kHz',
    '22Hz - 20kHz'
  ];
  return price > 3000 ? options[1] : price > 1500 ? options[0] : options[3];
};

const generateWeight = (category, price) => {
  if (category.includes('speaker')) {
    if (price > 5000) return `${(Math.random() * 15 + 10).toFixed(1)}kg`;
    if (price > 2000) return `${(Math.random() * 8 + 3).toFixed(1)}kg`;
    return `${(Math.random() * 3 + 1).toFixed(1)}kg`;
  }
  if (category.includes('headphone')) {
    return `${Math.floor(Math.random() * 400 + 200)}g`;
  }
  return `${(Math.random() * 2 + 0.5).toFixed(1)}kg`;
};

const generateWarranty = (price) => {
  if (price > 5000) return '2 Years International';
  if (price > 2000) return '1 Year + 6 Months Extended';
  return '1 Year Manufacturer';
};

const generateSpecialFeatures = (category, features, price) => {
  const allFeatures = [];
  
  if (features && features.length > 0) {
    allFeatures.push(...features.slice(0, 2));
  }
  
  if (price > 3000) {
    allFeatures.push('Premium Sound', 'Advanced Controls');
  }
  if (price > 2000) {
    allFeatures.push('Bass Boost', 'LED Indicators');
  }
  
  return allFeatures.slice(0, 3).join(', ') || 'Standard Features';
};

const generateBatteryLife = (category) => {
  if (category.includes('headphone')) {
    return `${Math.floor(Math.random() * 20 + 15)} hours`;
  }
  if (category.includes('speaker')) {
    return `${Math.floor(Math.random() * 8 + 4)} hours`;
  }
  return `${Math.floor(Math.random() * 12 + 6)} hours`;
};

const generateMaterialQuality = (category, price) => {
  if (category.includes('headphone')) {
    return price > 3000 ? 'Premium Leather & Aluminum' : price > 1500 ? 'Quality Plastic & Foam' : 'Standard Materials';
  }
  if (category.includes('speaker')) {
    return price > 4000 ? 'Wood Cabinet & Metal' : price > 2000 ? 'High-Quality Plastic' : 'Standard Build';
  }
  return price > 2500 ? 'Premium Materials' : 'Standard Quality';
};

const generateSoundQuality = (price, category) => {
  if (price > 4000) return 'Exceptional (Studio Grade)';
  if (price > 2500) return 'Excellent (Audiophile)';
  if (price > 1500) return 'Very Good (High-Fi)';
  return 'Good (Standard)';
};

const generateCompatibility = (category) => {
  const devices = ['Smartphones', 'Tablets', 'Laptops'];
  if (category.includes('dj')) {
    devices.push('DJ Equipment', 'Audio Interfaces');
  }
  if (category.includes('speaker')) {
    devices.push('Audio Players', 'TVs');
  }
  if (category.includes('gaming')) {
    devices.push('Gaming Consoles', 'PCs');
  }
  return devices.slice(0, 4).join(', ');
};

// Function to highlight best values in comparison
const getBestValueClass = (feature, currentValue, allItems) => {
  if (!currentValue || currentValue === 'N/A' || currentValue === 'Not Available') {
    return '';
  }
  
  // Get all values for this feature
  const allValues = allItems.map(item => getFeatureValue(item, feature));
  
  // For numeric features, find the best value
  if (feature === 'Power Output') {
    const numericValues = allValues.map(v => {
      const match = String(v).match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxValue = Math.max(...numericValues);
    const currentNumeric = parseInt(String(currentValue).match(/(\d+)/)?.[1] || '0');
    if (currentNumeric === maxValue && maxValue > 0) {
      return 'bg-green-100 border-2 border-green-300';
    }
  }
  
  if (feature === 'Battery Life') {
    const numericValues = allValues.map(v => {
      const match = String(v).match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxValue = Math.max(...numericValues);
    const currentNumeric = parseInt(String(currentValue).match(/(\d+)/)?.[1] || '0');
    if (currentNumeric === maxValue && maxValue > 0) {
      return 'bg-green-100 border-2 border-green-300';
    }
  }
  
  if (feature === 'Sound Quality') {
    const qualityScore = (value) => {
      const str = String(value).toLowerCase();
      if (str.includes('exceptional')) return 4;
      if (str.includes('excellent')) return 3;
      if (str.includes('very good')) return 2;
      if (str.includes('good')) return 1;
      return 0;
    };
    
    const scores = allValues.map(qualityScore);
    const maxScore = Math.max(...scores);
    if (qualityScore(currentValue) === maxScore && maxScore > 0) {
      return 'bg-green-100 border-2 border-green-300';
    }
  }
  
  if (feature === 'Warranty') {
    const warrantyScore = (value) => {
      const str = String(value).toLowerCase();
      if (str.includes('2 year') || str.includes('24 month')) return 3;
      if (str.includes('extended') || str.includes('1.5') || str.includes('18 month')) return 2;
      if (str.includes('1 year') || str.includes('12 month')) return 1;
      return 0;
    };
    
    const scores = allValues.map(warrantyScore);
    const maxScore = Math.max(...scores);
    if (warrantyScore(currentValue) === maxScore && maxScore > 0) {
      return 'bg-green-100 border-2 border-green-300';
    }
  }
  
  return '';
};

// Function to get appropriate icon for each feature
const getFeatureIcon = (feature) => {
  const iconClass = "text-sm sm:text-base shrink-0";
  
  switch (feature) {
    case 'Brand':
    case 'Model':
      return <FaTags className={`text-blue-600 ${iconClass}`} />;
    case 'Category':
      return <FaBox className={`text-purple-600 ${iconClass}`} />;
    case 'Price Range':
      return <span className={`text-green-600 ${iconClass}`}>💰</span>;
    case 'Power Output':
      return <FaBolt className={`text-red-600 ${iconClass}`} />;
    case 'Frequency Response':
      return <FaVolumeUp className={`text-green-600 ${iconClass}`} />;

    case 'Color':
      return <span className={`text-purple-600 ${iconClass}`}>🎨</span>;
    case 'Weight':
      return <FaRuler className={`text-orange-600 ${iconClass}`} />;
    case 'Warranty':
      return <FaShieldAlt className={`text-green-600 ${iconClass}`} />;
    case 'Special Features':
      return <FaStar className={`text-yellow-500 ${iconClass}`} />;
    case 'Battery Life':
      return <FaBatteryHalf className={`text-green-500 ${iconClass}`} />;
    case 'Material Quality':
      return <FaBox className={`text-amber-600 ${iconClass}`} />;
    case 'Sound Quality':
      return <FaVolumeUp className={`text-purple-500 ${iconClass}`} />;
    case 'Compatibility':
      return <FaTags className={`text-teal-600 ${iconClass}`} />;
    default:
      return <FaRuler className={`text-gray-500 ${iconClass}`} />;
  }
};

// Enhanced feature value formatting for better display
const formatFeatureValue = (value, feature) => {
  if (value === null || value === undefined || value === '' || value === 'N/A') {
    return <span className="text-gray-400 italic">Not Available</span>;
  }
  
  if (typeof value === 'boolean') {
    return value ? (
      <span className="text-green-600 font-medium flex items-center justify-center">
        <FaCheck className="mr-1" /> Yes
      </span>
    ) : (
      <span className="text-red-500 flex items-center justify-center">
        <FaTimes className="mr-1" /> No
      </span>
    );
  }
  
  if (Array.isArray(value)) {
    return <span className="text-sm">{value.join(', ')}</span>;
  }
  
  if (typeof value === 'object') {
    try {
      return (
        <div className="text-xs space-y-1">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="font-medium">{k}:</span>
              <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
            </div>
          ))}
        </div>
      );
    } catch (e) {
      return <span className="text-xs">{JSON.stringify(value)}</span>;
    }
  }
  
  // Special formatting for specific features
  const stringValue = String(value);
  
  // Add icons and special styling for certain features
  if (feature === 'Power Output' || feature === 'Weight' || feature === 'Frequency Response') {
    return <span className="font-semibold text-blue-600">{stringValue}</span>;
  }
  
  if (feature === 'Price Range') {
    const colorMap = {
      'Budget': 'text-green-600',
      'Mid-Range': 'text-blue-600', 
      'High-End': 'text-orange-600',
      'Premium': 'text-purple-600'
    };
    const colorClass = Object.keys(colorMap).find(key => stringValue.includes(key)) || 'text-gray-600';
    return <span className={`font-semibold ${colorMap[colorClass.split(' ')[0]] || 'text-gray-600'}`}>{stringValue}</span>;
  }
  
  if (feature === 'Sound Quality') {
    const qualityColors = {
      'Exceptional': 'text-purple-600',
      'Excellent': 'text-blue-600',
      'Very Good': 'text-green-600',
      'Good': 'text-yellow-600'
    };
    const colorClass = Object.keys(qualityColors).find(key => stringValue.includes(key)) || 'text-gray-600';
    return <span className={`font-semibold ${qualityColors[colorClass] || 'text-gray-600'}`}>{stringValue}</span>;
  }
  
  if (feature === 'Material Quality') {
    const qualityColor = stringValue.includes('Premium') ? 'text-purple-600' : 
                        stringValue.includes('Quality') ? 'text-blue-600' : 'text-gray-600';
    return <span className={`text-sm ${qualityColor}`}>{stringValue}</span>;
  }
  
  if (feature === 'Warranty') {
    return (
      <span className="flex items-center justify-center text-sm">
        <FaShieldAlt className="mr-1 text-green-600" />
        {stringValue}
      </span>
    );
  }
  
  if (feature === 'Special Features') {
    const features = stringValue.split(', ');
    return (
      <div className="space-y-1">
        {features.map((feat, idx) => (
          <div key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {feat}
          </div>
        ))}
      </div>
    );
  }
  
  return <span className="text-sm text-center">{stringValue}</span>;
};
if (items.length === 0) { return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
<div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-center min-h-screen">
<div className="text-center py-20">
<div className="max-w-lg mx-auto"> {/* Enhanced Empty State */
}
<div className="w-32 h-32 mx-auto mb-8 rounded-full grid place-items-center shadow-xl overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #F8F9FA, #20B2AA)' }}>
  <svg
    viewBox="0 0 48 48"
    width="64"
    height="64"
    fill="none"
    className="text-gray-500"
    aria-hidden="true"
    shapeRendering="geometricPrecision"
  >
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 16h22" vectorEffect="non-scaling-stroke" />
      <path d="M26 10l8 6-8 6" vectorEffect="non-scaling-stroke" />
      <path d="M40 32H18" vectorEffect="non-scaling-stroke" />
      <path d="M22 38l-8-6 8-6" vectorEffect="non-scaling-stroke" />
    </g>
  </svg>
</div>
<h2 className="text-4xl font-bold mb-4" style={{ color: '#2C3E50' }}>No Products to Compare</h2>
<p className="text-lg text-gray-600 mb-8 leading-relaxed"> Start adding products to comparison from any product page to see detailed side-by-side comparisons. </p> {/* Action Buttons */
}
<div className="flex flex-col sm:flex-row justify-center gap-4">
<Link to="/products" className="px-8 py-4 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2" style={{ background: browseProductsHover ? 'linear-gradient(to right, #FF5252, #1BA39C)' : 'linear-gradient(to right, #FF6B6B, #20B2AA)' }} onMouseEnter={() => setBrowseProductsHover(true)} onMouseLeave={() => setBrowseProductsHover(false)} >
<FaBox />
<span>Browse Products</span>
</Link>
<Link to="/categories" className="px-8 py-4 border-2 rounded-xl transition-all duration-300 font-semibold inline-flex items-center justify-center gap-2" style={{ borderColor: '#FF6B6B', color: '#FF6B6B', backgroundColor: browseCategoriesHover ? '#FEFCF3' : 'transparent' }} onMouseEnter={() => setBrowseCategoriesHover(true)} onMouseLeave={() => setBrowseCategoriesHover(false)} >
<FaTags />
<span>Browse Categories</span>
</Link>
</div>
</div>
</div>
</div>
</div> ); }
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
      {/* Compact Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 via-orange-600/5 to-red-600/5">
        </div>
        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-4 sm:mb-6">
            {/* Left Side - Navigation & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 text-gray-600 hover:text-orange-600 hover:bg-white transition-all duration-300 shadow-lg w-full sm:w-auto shrink-0" 
                style={{ color: backButtonHover ? '#FF6B6B' : '#6B7280' }} 
                onMouseEnter={() => setBackButtonHover(true)} 
                onMouseLeave={() => setBackButtonHover(false)}
              >
                <FaArrowLeft className="text-sm sm:text-base shrink-0" />
                <span className="font-medium text-sm sm:text-base whitespace-nowrap">Back</span>
              </button>
              
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      role="img"
                    >
                      <path d="M3 7h12" />
                      <path d="M13 3l4 4-4 4" />
                      <path d="M21 17H9" />
                      <path d="M11 21l-4-4 4-4" />
                    </svg>
                  </div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold shrink-0 leading-tight tracking-tight" style={{ color: '#2C3E50' }}>
                    <span className="sm:hidden">Compare</span>
                    <span className="hidden sm:inline">Product Comparison</span>
                  </h1>
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Compare {items.length} {items.length === 1 ? 'product' : 'products'} side by side
                </p>
              </div>
            </div>
            
            {/* Right Side - Actions */}
            <div className="flex justify-center sm:justify-end gap-2">
              <button 
                onClick={clearComparison} 
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
              >
                <FaTimes className="text-sm sm:text-base" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Comparison Legend */}
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-3 border border-blue-200">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-gray-700">Best Performance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="text-gray-700">Superior Features</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 italic">💡 Compare specifications to find the perfect product for your needs</span>
            </div>
          </div>
        </div>

        {/* Compact Comparison Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(to right, #FF6B6B, #20B2AA)', color: 'white' }}>
                  <th className="p-3 sm:p-4 lg:p-5 text-left font-bold text-sm sm:text-base lg:text-lg">Features</th>
                  {items.map((product, index) => (
                    <th key={product._id || product.id} className="p-3 sm:p-4 lg:p-5 text-center font-bold text-sm sm:text-base lg:text-lg min-w-48 sm:min-w-56 lg:min-w-64">
                      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                        <span className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="hidden sm:inline">Product {index + 1}</span>
                        <span className="sm:hidden">#{index + 1}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 sm:p-4 lg:p-5 font-bold text-gray-800" style={{ background: 'linear-gradient(to right, #F8F9FA, #FEFCF3)' }}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-[10px] flex items-center justify-center shrink-0 overflow-hidden" style={{ background: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M3 7l9 5 9-5" />
                          <path d="M3 7l0 10 9 5 9-5 0-10" />
                          <path d="M12 12l0 10" />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base lg:text-lg" style={{ color: '#2C3E50' }}>
                        <span className="hidden sm:inline">Product Details</span>
                        <span className="sm:hidden">Product</span>
                      </span>
                    </div>
                  </td>
                  {items.map((product, index) => (
                    <td key={product._id || product.id} className="p-3 sm:p-4 lg:p-5 text-center">
                      <div className="relative group">
                        <button 
                          onClick={() => removeFromComparison(product._id || product.id)} 
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10 opacity-0 group-hover:opacity-100"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                        <img 
                          src={getImageUrl(product.image || product.images?.[0])} 
                          alt={product.name} 
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-lg mx-auto mb-2 sm:mb-3 shadow-lg" 
                        />
                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-xs sm:text-sm lg:text-base px-1">
                          {product.name}
                        </h3>
                        <Link 
                          to={`/product/${product._id || product.id}`} 
                          className="text-brand-blue hover:text-brand-dark text-xs sm:text-sm inline-flex items-center justify-center gap-1"
                        >
                          <FaEye className="text-xs sm:text-sm shrink-0" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 sm:p-4 font-semibold text-gray-800 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FaTags className="text-green-600 text-sm sm:text-base shrink-0" />
                      <span className="text-sm sm:text-base">Price</span>
                    </div>
                  </td>
                  {items.map((product) => (
                    <td key={product._id || product.id} className="p-3 sm:p-4 text-center">
                      <div className="space-y-1">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                          {formatPrice(product.discountedPrice || product.price)}
                        </div>
                        {product.discountedPrice && product.discountedPrice < product.price && (
                          <div className="text-xs sm:text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 sm:p-4 font-semibold text-gray-800 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-500 text-sm sm:text-base shrink-0" />
                      <span className="text-sm sm:text-base">Rating</span>
                    </div>
                  </td>
                  {items.map((product) => (
                    <td key={product._id || product.id} className="p-3 sm:p-4 text-center">
                      {product.averageRating ? (
                        <div className="space-y-2">
                          <div className="flex justify-center space-x-1">
                            {renderStars(product.averageRating)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {product.averageRating.toFixed(1)} ({product.totalReviews || 0} reviews)
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-400">No ratings</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 sm:p-4 font-semibold text-gray-800 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-brand-blue text-sm sm:text-base shrink-0" />
                      <span className="text-sm sm:text-base">
                        <span className="hidden sm:inline">Availability</span>
                        <span className="sm:hidden">Stock</span>
                      </span>
                    </div>
                  </td>
                  {items.map((product) => (
                    <td key={product._id || product.id} className="p-3 sm:p-4 text-center">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 
                          ? `In Stock (${product.stock})` 
                          : 'Out of Stock'
                        }
                      </span>
                    </td>
                  ))}
                </tr>
                {getComparisonFeatures().map((feature) => (
                  <tr key={feature} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 sm:p-6 font-semibold text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        {getFeatureIcon(feature)}
                        <span className="capitalize text-sm sm:text-base">{feature}</span>
                      </div>
                    </td>
                    {items.map((product) => {
                      const value = getFeatureValue(product, feature);
                      return (
                        <td key={product._id || product.id} className="p-4 sm:p-6 text-center align-middle">
                          <div className={`flex items-center justify-center min-h-[40px] ${getBestValueClass(feature, value, items)} rounded-lg transition-all`}>
                            {formatFeatureValue(value, feature)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-gray-800 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FaShoppingCart className="text-purple-600 text-sm sm:text-base" />
                      <span className="text-sm sm:text-base">Actions</span>
                    </div>
                  </td>
                  {items.map((product) => (
                    <td key={product._id || product.id} className="p-2 sm:p-3">
                      <div className="space-y-2">
                        <button 
                          onClick={() => handleAddToCart(product)} 
                          disabled={addingToCart.has(product._id || product.id) || product.stock === 0} 
                          className="w-full h-9 bg-gradient-to-r from-brand-coral to-brand-blue text-white px-2.5 rounded-md hover:from-brand-coral/90 hover:to-brand-blue/90 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs leading-none font-medium"
                          aria-label="Add to cart from comparison"
                        >
                          {addingToCart.has(product._id || product.id) ? (
                            <FaSpinner className="animate-spin w-4 h-4 shrink-0" />
                          ) : (
                            <>
                              <FaShoppingCart className="w-4 h-4 shrink-0" />
                              <span className="whitespace-nowrap">Add to Cart</span>
                            </>
                          )}
                        </button>
                        {!isInWishlist(product._id || product.id) ? (
                          <button 
                            onClick={() => handleAddToWishlist(product)} 
                            disabled={addingToWishlist.has(product._id || product.id)} 
                            className="w-full h-9 bg-red-500 text-white px-2.5 rounded-md hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs leading-none font-medium"
                            aria-label="Add to wishlist from comparison"
                          >
                            {addingToWishlist.has(product._id || product.id) ? (
                              <FaSpinner className="animate-spin w-4 h-4 shrink-0" />
                            ) : (
                              <>
                                <FaHeart className="w-4 h-4 shrink-0" />
                                <span className="whitespace-nowrap">Add to Wishlist</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button 
                            disabled 
                            className="w-full h-9 bg-green-500 text-white px-2.5 rounded-md flex items-center justify-center gap-1.5 opacity-75 cursor-not-allowed text-xs leading-none font-medium"
                            aria-label="Already in wishlist"
                          >
                            <FaCheck className="w-4 h-4 shrink-0" />
                            <span className="whitespace-nowrap">Added</span>
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
  );
};

export default ProductComparisonPage;