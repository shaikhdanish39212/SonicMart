import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import ProductCardModern from '../components/ProductCardModern';

const InternalComponents = () => {
  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { comparisonList, addToComparison, removeFromComparison } = useProductComparison();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [categories, setCategories] = useState(['All']);
  const [types, setTypes] = useState(['All']);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const typeQuery = searchParams.get('type') || '';

  // Load products from database
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsAPI.getProductsByCategory("internal-components", {
        page: 1,
        limit: 300
      });
      
      // Check if response has the expected structure
      if (!response.data || !response.data.products) {
        throw new Error('Invalid API response structure');
      }
      
      const normalizedProducts = response.data.products.map(product => {
        // For internal components, use the existing images array directly
        // The seeder already sets up: images: [main, variant1, variant2, variant3]
        const allImages = product.images || [];
        const mainImage = allImages[0] || "placeholder.png";
        
        return {
          ...product,
          rating: product.averageRating || product.rating || 0,
          totalReviews: product.totalReviews || 0,
          image: mainImage,
          images: allImages.length > 0 ? allImages : ["placeholder.png"]
        };
      });
      
      setProducts(normalizedProducts);
      
      // Extract unique categories and types for filtering
      const uniqueCategories = [...new Set(normalizedProducts.map(p => p.subcategory || p.subCategory || 'General').filter(Boolean))];
      const uniqueTypes = [...new Set(normalizedProducts.map(p => p.type || 'Component').filter(Boolean))];
      
      setCategories(['All', ...uniqueCategories]);
      setTypes(['All', ...uniqueTypes]);
      
    } catch (error) {
      console.error("Error loading internal components:", error);
      setError("Failed to load internal components. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        (product.subcategory || product.subCategory || '').toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(product => 
        (product.type || '').toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.subcategory || product.subCategory || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popular':
          return (b.salesCount || 0) - (a.salesCount || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedType, searchQuery, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleWishlistToggle = (product) => {
    const isInWishlist = wishlist.some(item => item._id === product._id);
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompareToggle = (product) => {
    const isInComparison = comparisonList.some(item => item._id === product._id);
    if (isInComparison) {
      removeFromComparison(product._id);
    } else {
      addToComparison(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-brand-coral/10 via-brand-blue/10 to-brand-cream/30 py-1 sm:py-2 lg:py-3 border-b" style={{ borderColor: '#F8F9FA' }}>
          <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
            <span className="inline-block bg-brand-coral/20 text-brand-coral px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold mb-1 sm:mb-2 lg:mb-3">
              PROFESSIONAL COMPONENTS
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 lg:mb-3 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Internal <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Components</span>
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 px-2 sm:px-0">
              Discover our complete collection of premium internal components for professional audio equipment
            </p>
          </div>
        </div>

        {/* Loading */}
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-16">
          <div className="flex flex-col justify-center items-center py-12 sm:py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-transparent border-t-brand-coral absolute inset-0"></div>
            </div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">Loading components...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-brand-coral/10 via-brand-blue/10 to-brand-cream/30 py-1 sm:py-2 lg:py-3 border-b" style={{ borderColor: '#F8F9FA' }}>
          <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
            <span className="inline-block bg-brand-coral/20 text-brand-coral px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold mb-1 sm:mb-2 lg:mb-3">
              PROFESSIONAL COMPONENTS
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 lg:mb-3 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Internal <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Components</span>
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 px-2 sm:px-0">
              Discover our complete collection of premium internal components for professional audio equipment
            </p>
          </div>
        </div>

        {/* Error */}
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center shadow-lg max-w-md mx-auto">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⚠️</div>
            <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
            <button 
              onClick={loadProducts}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 bg-brand-coral text-white rounded-lg hover:bg-brand-coral/90 transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-coral/10 via-brand-blue/10 to-brand-cream/30 py-1 sm:py-2 lg:py-3 border-b" style={{ borderColor: '#F8F9FA' }}>
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <span className="inline-block bg-brand-coral/20 text-brand-coral px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold mb-1 sm:mb-2 lg:mb-3">
            PROFESSIONAL COMPONENTS
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 lg:mb-3 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {searchQuery ? (
                <>Search Results for "<span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>{searchQuery}</span>"</>
              ) : (
                <>Internal <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Components</span></>
              )}
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 px-2 sm:px-0">
            {searchQuery 
              ? `Found ${filteredProducts.length} components matching your search`
              : `Discover our complete collection of ${filteredProducts.length} premium internal components for professional audio equipment`
            }
          </p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        {/* Enhanced Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-2 sm:p-3 lg:p-4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
          {/* Mobile-First Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value) {
                    newParams.set('search', e.target.value);
                  } else {
                    newParams.delete('search');
                  }
                  setSearchParams(newParams);
                }}
                className="w-full pl-8 pr-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand-coral focus:border-brand-coral transition-colors text-sm sm:text-base"
              />
              <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort Options and Results Count - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium text-sm">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-2 py-2 sm:px-3 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand-coral focus:border-brand-coral bg-white transition-colors text-sm"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            
            {/* Results Count - Mobile Optimized */}
            <div className="text-gray-600 text-xs sm:text-sm whitespace-nowrap">
              <span className="font-semibold text-gray-800">{filteredProducts.length}</span> of{' '}
              <span className="font-semibold text-gray-800">{products.length}</span> components
            </div>
          </div>
        </div>

        {/* Products Grid - Mobile First Responsive */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
            {filteredProducts.map((product) => (
              <ProductCardModern
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onToggleWishlist={() => handleWishlistToggle(product)}
                onToggleCompare={() => handleCompareToggle(product)}
                isInWishlist={wishlist.some(item => item._id === product._id)}
                isInComparison={comparisonList.some(item => item._id === product._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No components found</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams());
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalComponents;
