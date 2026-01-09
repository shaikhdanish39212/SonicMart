import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCardModern from '../components/ProductCardModern';
import EnhancedFilters from '../components/EnhancedFilters';
import { useProductCache } from '../context/ProductCacheContext';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false); // Default closed on desktop
  const [clearFiltersFlag, setClearFiltersFlag] = useState(false);
  const { getProductsWithDeals, searchProductsInCache, isProductsCached } = useProductCache();

  // Mobile-first view mode
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Simplified filter state
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 15000],
    rating: 0,
    features: [],
    discount: '',
    sortBy: 'featured',
    inStock: false
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Starting to fetch products...');
        setLoading(true);

        const result = await getProductsWithDeals();
        console.log(`Products: Loaded ${result.data.length} products with deals ${result.fromCache ? '(from cache)' : '(fresh data)'}`);
        console.log('Debug: Sample product with deal info:', result.data.find(p => p.hasActiveDeal));

        let productList = result.data;

        // Apply initial search and category filters
        let filtered = productList.filter(product => {
          const matchesSearch = !searchQuery ||
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesCategory = !categoryQuery ||
            product.category?.toLowerCase() === categoryQuery.toLowerCase();

          return matchesSearch && matchesCategory;
        });

        console.log('Debug: After filtering by category:', categoryQuery);
        console.log('Debug: Filtered product with deal info:', filtered.find(p => p.hasActiveDeal));
        console.log('Debug: Total products after filtering:', filtered.length);

        setProducts(productList);
        setFilteredProducts(filtered);
        setDisplayedProducts(filtered);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryQuery]); // Only re-fetch when search/category params change

  // Create simplified filter options
  const filterOptions = useMemo(() => {
    if (!products.length) {
      return {
        maxPrice: 15000,
        brands: ['boAt', 'Sony', 'JBL', 'Sennheiser', 'Audio-Technica', 'Bose', 'Skullcandy', 'Beats'],
        features: ['Wireless', 'Bluetooth', 'Noise Cancelling', 'Waterproof', 'Fast Charging', 'Bass Boost'],
        discountRanges: [
          { label: '10% and above', value: '10+' },
          { label: '20% and above', value: '20+' },
          { label: '30% and above', value: '30+' },
          { label: '50% and above', value: '50+' }
        ]
      };
    }

    // Extract unique values from products
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
    const maxPrice = Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100;
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))].map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1)
    }));

    return {
      maxPrice,
      brands,
      categories,
      features: [
        'Wireless', 'Bluetooth', 'Noise Cancelling', 'Waterproof',
        'Fast Charging', 'Bass Boost', 'Touch Controls', 'Voice Assistant',
        'Foldable', 'Sweat Resistant'
      ],
      discountRanges: [
        { label: '10% and above', value: '10+' },
        { label: '20% and above', value: '20+' },
        { label: '30% and above', value: '30+' },
        { label: '50% and above', value: '50+' }
      ]
    };
  }, [products]);

  // Handle simplified filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let filtered = products.filter(product => {
      // Apply search and category filters first
      const matchesSearch = !searchQuery ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !categoryQuery ||
        product.category?.toLowerCase() === categoryQuery.toLowerCase();

      if (!matchesSearch || !matchesCategory) return false;

      // Category filter
      if (newFilters.categories.length > 0) {
        const categoryIds = newFilters.categories.map(cat => typeof cat === 'string' ? cat : cat.id);
        if (!categoryIds.includes(product.category)) return false;
      }

      // Brand filter
      if (newFilters.brands.length > 0) {
        if (!newFilters.brands.includes(product.brand)) return false;
      }

      // Price filter
      const [minPrice, maxPrice] = newFilters.priceRange || [0, 15000];
      if (product.price < minPrice || product.price > maxPrice) return false;

      // Rating filter
      if (newFilters.rating > 0) {
        if (product.averageRating < newFilters.rating) return false;
      }

      // Features filter
      if (newFilters.features.length > 0) {
        const hasMatchingFeature = newFilters.features.some(feature => {
          return product.name.toLowerCase().includes(feature.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(feature.toLowerCase())) ||
            (product.features && product.features.some(f => f.toLowerCase().includes(feature.toLowerCase())));
        });
        if (!hasMatchingFeature) return false;
      }

      // Stock filter
      if (newFilters.inStock) {
        if (product.stock <= 0) return false;
      }

      // Discount filter
      if (newFilters.discount) {
        const discountValue = parseInt(newFilters.discount.replace('+', ''));
        const productDiscount = product.discount || 0;
        if (productDiscount < discountValue) return false;
      }

      return true;
    });

    // Apply sorting
    const sortBy = newFilters.sortBy || 'featured';
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        case 'newest':
          return new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded);
        default:
          return 0;
      }
    });

    setFilters(newFilters);
    setFilteredProducts(filtered);
    setDisplayedProducts(filtered);
  }, [products, searchQuery, categoryQuery]);

  // Clear all filters - simplified
  const handleClearFilters = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const clearedFilters = {
      categories: [],
      brands: [],
      priceRange: [0, filterOptions.maxPrice || 15000],
      rating: 0,
      features: [],
      discount: '',
      sortBy: 'featured',
      inStock: false
    };

    setFilters(clearedFilters);

    // Apply search and category filters only
    let filtered = products.filter(product => {
      const matchesSearch = !searchQuery ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !categoryQuery ||
        product.category?.toLowerCase() === categoryQuery.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    setFilteredProducts(filtered);
    setDisplayedProducts(filtered);
    setClearFiltersFlag(true);
    setTimeout(() => setClearFiltersFlag(false), 100);
  }, [products, searchQuery, categoryQuery, filterOptions.maxPrice]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FEFCF3' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FEFCF3' }}>
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white sm:bg-[#FEFCF3]">
      {/* Mobile-First Hero Section - Extra Compact */}
      <div className="bg-gradient-to-br from-brand-coral/10 via-brand-blue/10 to-brand-cream/30 py-2 sm:py-3 lg:py-5 border-b border-gray-100">
        <div className="mobile-container sm:content-container text-center">
          {/* Mobile: Smaller badge, desktop: keep original */}
          <span className="inline-block bg-brand-coral/20 text-brand-coral px-3 py-1 sm:px-4 sm:py-1.5 lg:px-5 lg:py-2 rounded-full text-xs sm:text-sm lg:text-base font-semibold mb-1.5 sm:mb-3 lg:mb-4">
            PREMIUM COLLECTION
          </span>

          {/* Mobile: Compact title, desktop: large */}
          <h1 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1.5 sm:mb-3 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {searchQuery ? (
                <>
                  <span className="block sm:inline">Search Results for</span>
                  <br className="sm:hidden" />
                  "<span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>{searchQuery}</span>"
                </>
              ) : categoryQuery ? (
                <>
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>
                    {categoryQuery.charAt(0).toUpperCase() + categoryQuery.slice(1)}
                  </span>
                  <br className="sm:hidden" />
                  <span className="block sm:inline"> Products</span>
                </>
              ) : (
                <>
                  All <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Products</span>
                </>
              )}
            </span>
          </h1>

          {/* Mobile: Compact description, Desktop: Larger */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-4xl mx-auto mb-2 sm:mb-4 px-2 sm:px-0">
            {searchQuery
              ? `Found ${displayedProducts.length} products`
              : categoryQuery
                ? `${displayedProducts.length} premium ${categoryQuery.toLowerCase()} products`
                : `${displayedProducts.length} premium sound accessories`
            }
          </p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        {/* Mobile Filter Toggle - Prominent Button */}
        <div className="block lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-brand-coral transition-all duration-200 touch-target"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-brand-coral/10 rounded-lg flex items-center justify-center mr-3">
                <FaFilter className="w-4 h-4 text-brand-coral" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-gray-900 block">Filters & Sort</span>
                <span className="text-xs text-gray-500">Refine your search</span>
              </div>
            </div>
            <div className="flex items-center">
              {Object.values(filters).some(value =>
                Array.isArray(value) ? value.length > 0 : value && value !== 'featured'
              ) && (
                  <span className="bg-brand-coral text-white text-xs px-2 py-1 rounded-full mr-2">
                    Active
                  </span>
                )}
              {isMobileFiltersOpen ? (
                <FaChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <FaChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Desktop Filters - Sidebar */}
          <div className={`hidden ${isDesktopFiltersOpen ? 'lg:block' : 'lg:hidden'} lg:w-80 xl:w-96 transition-all duration-300`}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-6">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsDesktopFiltersOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors touch-target"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <EnhancedFilters
                  filters={filters}
                  products={products}
                  filteredProducts={displayedProducts}
                  onFiltersChange={handleFiltersChange}
                  filterOptions={filterOptions}
                  clearFilters={clearFiltersFlag}
                />
              </div>
            </div>
          </div>

          {/* Mobile Filters - Full-Screen Overlay Style */}
          {isMobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile Filter Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    <p className="text-sm text-gray-500">Refine your search</p>
                  </div>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors touch-target"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Filter Content */}
                <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-4">
                  <EnhancedFilters
                    filters={filters}
                    products={products}
                    filteredProducts={displayedProducts}
                    onFiltersChange={handleFiltersChange}
                    filterOptions={filterOptions}
                    clearFilters={clearFiltersFlag}
                  />
                </div>

                {/* Mobile Filter Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full py-3 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-xl font-semibold transition-colors touch-target"
                  >
                    Apply Filters ({displayedProducts.length} Products)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Area */}
          <div className="flex-1">
            {/* Mobile-First Products Count and Sort */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                {/* Filter Button - Desktop Only */}
                <button
                  type="button"
                  onClick={() => setIsDesktopFiltersOpen(prev => !prev)}
                  className={`hidden lg:flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none shadow-sm touch-target ${isDesktopFiltersOpen
                      ? 'bg-brand-coral/10 border-2 border-brand-coral text-brand-coral shadow-md'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                  <FaFilter className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Filter</span>
                  {isDesktopFiltersOpen ? (
                    <FaChevronUp className="w-4 h-4 ml-2" />
                  ) : (
                    <FaChevronDown className="w-4 h-4 ml-2" />
                  )}
                </button>

                {/* Sort Dropdown - Mobile Optimized */}
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFiltersChange({ ...filters, sortBy: e.target.value })}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-coral focus:border-brand-coral shadow-sm text-gray-900 font-medium touch-target appearance-none pr-10"
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="discount">Best Deals</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Product Count - Mobile Friendly */}
              <div className="text-brand-dark/70 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-semibold text-brand-dark">{displayedProducts.length}</span> of <span className="font-semibold text-brand-dark">{products.length}</span> products
              </div>
            </div>

            {/* Mobile-First Products Grid */}
            {displayedProducts.length > 0 ? (
              <div className="products-page-grid">
                {displayedProducts.map((product, index) => (
                  <div key={product._id || product.id} style={{ animationDelay: `${index * 50}ms` }} className="h-full opacity-0 animate-fadeInUp">
                    <ProductCardModern product={product} />
                  </div>
                ))}
              </div>
            ) : (
              /* Mobile-Optimized Empty State */
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                  No products found
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
                  {searchQuery
                    ? `No products match your search for "${searchQuery}".`
                    : categoryQuery
                      ? `No products found in the ${categoryQuery} category.`
                      : "No products match your current filters."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 text-white rounded-xl font-semibold touch-target"
                    style={{ background: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}
                  >
                    Clear Filters
                  </button>
                  {(searchQuery || categoryQuery) && (
                    <button
                      onClick={() => window.location.href = '/products'}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors touch-target"
                    >
                      View All Products
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;