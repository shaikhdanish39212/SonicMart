import React from 'react';
import ProductCardModern from './ProductCardModern';
import { Link } from 'react-router-dom';
const FeaturedProducts = ({ products }) => {
  // Extract unique categories from products dynamically, prioritizing internal components first
  const rawCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
  
  // Sort categories with internal-components first, then others alphabetically
  const allCategories = rawCategories.sort((a, b) => {
    if (a === 'internal-components') return -1;
    if (b === 'internal-components') return 1;
    return a.localeCompare(b);
  });
  
  // Get up to 8 products from each category for home display (2x4 layout)
  const getProductsByCategory = () => {
    const categorizedProducts = {};
    allCategories.forEach(category => {
      const categoryProducts = products.filter(p => p.category === category);
      // Display the first 8 products from each category (2 rows of 4)
      categorizedProducts[category] = categoryProducts.slice(0, 8);
    });
    
    return categorizedProducts;
  };
const categorizedProducts = getProductsByCategory();
const totalDisplayedProducts = Object.values(categorizedProducts).reduce(
    (total, categoryProducts) => total + categoryProducts.length, 0
  );
  return (
    <div className="relative py-3 sm:py-4">
      {/* Header with product count - Mobile Optimized */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-responsive-2xl font-bold text-gray-900 mb-2">Featured Products</h2>
        <p className="text-responsive-sm text-gray-600 px-2">
          Showing {totalDisplayedProducts} products from {allCategories.length} categories
          {products.length > totalDisplayedProducts && (
            <span className="text-brand-coral ml-1 block sm:inline">
              ({products.length - totalDisplayedProducts} more available)
            </span>
          )}
        </p>
      </div>
      
      {/* Display each category with mobile-first grid */}
      {allCategories.map((category, categoryIndex) => {
        const categoryProducts = categorizedProducts[category];
        if (!categoryProducts || categoryProducts.length === 0) return null;
        return (
          <div key={category} className="category-section mb-6 sm:mb-8">
            {/* Category Header - Mobile Optimized */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 px-2 sm:px-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-lg sm:text-2xl">{getCategoryIcon(category)}</div>
                <div>
                  <h3 className="text-responsive-lg font-bold text-gray-900 capitalize">{formatCategoryName(category)}</h3>
                </div>
              </div>
              <Link 
                to={`/category/${category}`}
                className="text-xs sm:text-sm text-brand-coral hover:text-pink-600 font-medium flex items-center space-x-1 group transition-colors touch-target"
              >
                <span>View All</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Products Grid - Fixed 4-column layout */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-3 sm:mb-4">
              {categoryProducts.map((product, index) => (
                <div key={`${category}-${product.id || product._id || index}`} className="h-full">
                  <ProductCardModern product={product} />
                </div>
              ))}
            </div>
            
            {/* Category Divider */}
            {categoryIndex < allCategories.length - 1 && (
              <div key={`divider-${category}-${categoryIndex}`} className="border-b border-gray-100 mb-4 sm:mb-6"></div>
            )}
          </div>
        );
    }
  )}
    </div>
  );
};


// Helper function to get category icon based on category name
const getCategoryIcon = (category) => {
  ;
const iconMap = {
    headphones: '',
    'dj-speakers': '',
    'loud-speakers': '',
    microphones: '',
    'home-theater': '',
    'neckband-earphones': '',
    earbuds: '',
    earphones: '',
    speakers: '',
    'guitars-basses': '',
    'keyboards-pianos': '',
    'drums-percussion': '',
    'studio-equipment': ''
  };
  
  return iconMap[category] || '';
};

// Helper function to format category names
const formatCategoryName = (category) => {
  ;
const nameMap = {
    'dj-speakers': 'DJ Speakers',
    'loud-speakers': 'Loud Speakers',
    'home-theater': 'Home Theater',
    'neckband-earphones': 'Neckband Earphones',
    'guitars-basses': 'Guitars & Basses',
    'keyboards-pianos': 'Keyboards & Pianos',
    'drums-percussion': 'Drums & Percussion',
    'studio-equipment': 'Studio Equipment'
  };
  
  return nameMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

export default FeaturedProducts;

