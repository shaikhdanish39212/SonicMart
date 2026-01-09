import React, { useState, useEffect, useMemo, useCallback, useContext, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import EnhancedFilters from '../components/EnhancedFilters';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import { useProductCache } from '../context/ProductCacheContext';
import { getCurrentImage, handleImageError } from '../utils/imageUtils';
import { FaHeart, FaExchangeAlt, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ProductCardModern from '../components/ProductCardModern';

const CategoryProductsPage = () => {
  // Scroll to top when component mounts or category changes
  const { categoryId } = useParams();

  // Redirect internal-components to dedicated page
  if (categoryId === 'internal-components') {
    return <Navigate to="/internal-components" replace />;
  }

  useEffect(() => {
    // Force scroll to top when category changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [categoryId]);

  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { comparisonList, addToComparison, removeFromComparison } = useProductComparison();
  const { getCategoryProductsWithDeals } = useProductCache();
  const [sortBy, setSortBy] = useState('name');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);
  const [clearFiltersFlag, setClearFiltersFlag] = useState(false);
  // Add filters state to track current filter values
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 10000],
    rating: 0,
    features: [],
    discount: '',
    sortBy: 'featured',
    inStock: false
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allCategoryProducts, setAllCategoryProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });
  const paginationRef = useRef(pagination);
  paginationRef.current = pagination;
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');






  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        ;
        const response = await productsAPI.getCategories();
        const backendCategories = response.data.categories;
        setCategories(backendCategories);

        // Find current category and set name
        const foundCategory = backendCategories.find(cat => cat.id === categoryId);
        setCurrentCategory(foundCategory);
        setCategoryName(foundCategory?.name || 'Products');
      } catch (err) {
        console.error('Error loading categories:', err);
        // Fallback category name
        setCategoryName('Products');
      }
    };

    loadCategories();
  }, [categoryId]);

  // Load category products
  const loadCategoryProducts = useCallback(async (page = 1, append = false) => {
    if (!categoryId) return;

    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 24,
        sort: sortBy
      };

      const result = await getCategoryProductsWithDeals(categoryId, params);
      console.log(`Category ${categoryId}: Loaded ${result.data.length} products with deals ${result.fromCache ? '(from cache)' : '(fresh data)'}`);

      const { data: products = [], pagination: paginationData = {} } = result;
      const { hasNextPage = false, currentPage = 1, totalPages = 1, totalProducts = 0 } = paginationData;

      setHasMoreProducts(hasNextPage);
      setPagination({ currentPage, totalPages, totalProducts });
      if (append) {
        // Remove duplicates when appending
        setDisplayedProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id || p.id));
          const uniqueProducts = products.filter(p => !existingIds.has(p._id || p.id));
          return [...prev, ...uniqueProducts];
        });
        setAllCategoryProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id || p.id));
          const uniqueProducts = products.filter(p => !existingIds.has(p._id || p.id));
          return [...prev, ...uniqueProducts];
        });
      } else {
        setDisplayedProducts(products);
        setAllCategoryProducts(products);
      }

      setFilteredProducts(products);
      setEmpty(products.length === 0 && !append);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      console.error('Error loading category products:', err);
      if (!append) {
        setAllCategoryProducts([]);
        setDisplayedProducts([]);
        setFilteredProducts([]);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, sortBy]); // Only depend on stable values, not function references



  // Load products when category or sort changes
  useEffect(() => {
    loadCategoryProducts(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, sortBy]); // Only re-fetch when category or sort changes

  // Create filter options from category products - simplified
  const filterOptions = useMemo(() => {
    if (!allCategoryProducts.length) {
      return {
        maxPrice: 10000,
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
    const brands = [...new Set(allCategoryProducts.map(p => p.brand).filter(Boolean))];
    const maxPrice = Math.ceil(Math.max(...allCategoryProducts.map(p => p.price)) / 100) * 100;

    return {
      maxPrice,
      brands: brands.sort(),
      features: [
        'Wireless', 'Bluetooth', 'Noise Cancelling', 'Waterproof', 'Fast Charging',
        'Bass Boost', 'Touch Controls', 'Voice Assistant', 'Foldable', 'Sweat Resistant'
      ],
      discountRanges: [
        { label: '10% and above', value: '10+' },
        { label: '20% and above', value: '20+' },
        { label: '30% and above', value: '30+' },
        { label: '50% and above', value: '50+' }
      ],
      categories: [currentCategory].filter(Boolean)
    };
  }, [allCategoryProducts, currentCategory]);

  // Handle filter changes with simplified filtering logic
  const handleFiltersChange = useCallback((newFilters) => {
    // Scroll to top when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let filtered = allCategoryProducts.filter(product => {
      // Category filter
      if (newFilters.categories.length > 0) {
        const categoryIds = newFilters.categories.map(cat => typeof cat === 'string' ? cat : cat.id);
        if (!categoryIds.includes(product.category)) {
          return false;
        }
      }

      // Brand filter
      if (newFilters.brands.length > 0) {
        if (!newFilters.brands.includes(product.brand)) return false;
      }

      // Price filter
      const [minPrice, maxPrice] = newFilters.priceRange || [0, 10000];
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

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
  }, [allCategoryProducts]);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(allCategoryProducts);
  }, [allCategoryProducts]);

  // Products are already sorted by the server, so we use displayedProducts directly

  // Image hover effect functions
  const handleProductHover = useCallback((productId) => {
    setHoveredProduct(productId);
  }, []);
  const handleProductLeave = useCallback(() => {
    setHoveredProduct(null);
  }, []);

  // Using the imported getCurrentImage function from imageUtils

  // Clear all filters function - simplified
  const handleClearFilters = useCallback(() => {
    // Scroll to top when clearing filters
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const clearedFilters = {
      categories: [],
      brands: [],
      priceRange: [0, filterOptions.maxPrice || 10000],
      rating: 0,
      features: [],
      discount: '',
      sortBy: 'featured',
      inStock: false
    };

    setFilters(clearedFilters);
    setFilteredProducts(allCategoryProducts);
    setDisplayedProducts(allCategoryProducts);
    // Trigger clear filters in EnhancedFilters component
    setClearFiltersFlag(true);
    // Reset flag after component has processed it
    setTimeout(() => setClearFiltersFlag(false), 100);
  }, [allCategoryProducts, filterOptions.maxPrice]);

  // Early returns for loading and empty states
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-coral mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading {categoryName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading {categoryName}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-brand-coral text-white rounded-lg hover:bg-brand-coral/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-brand-coral/10 via-brand-blue/10 to-brand-cream/30 py-12 md:py-16">
          <div className="content-container text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mb-3 md:mb-4">
              {categoryName} <span className="text-brand-coral">Collection</span>
            </h1>
          </div>
        </div>
        <div className="content-container py-16 text-center">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No products in {categoryName}</h2>
          <p className="text-gray-600">Try another category or check back later.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white sm:bg-[#FEFCF3]">
      {/* Mobile-First Hero Section */}
      <div className="bg-gradient-to-br from-brand-coral/10 via-brand-blue/10 to-brand-cream/30 py-1 sm:py-2 lg:py-3 border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          {/* Mobile: Smaller badge, desktop: larger */}
          <span className="inline-block bg-brand-coral/20 text-brand-coral px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold mb-1 sm:mb-2 lg:mb-3">
            PREMIUM COLLECTION
          </span>

          {/* Mobile: Compact title, desktop: large */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 lg:mb-3 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {categoryName} <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Collection</span>
            </span>
          </h1>

          {/* Mobile: Compact description, Desktop: Larger */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mb-1 sm:mb-2 lg:mb-3 px-2 sm:px-0">
            Discover our complete range of premium {categoryName.toLowerCase()} designed for every music enthusiast
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters - Sidebar */}
          <div className={`hidden ${isDesktopFiltersOpen ? 'lg:block' : 'lg:hidden'} lg:w-80 transition-all duration-300`}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-6">
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-md transition-colors duration-200"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsDesktopFiltersOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <EnhancedFilters
                  filters={filters}
                  products={allCategoryProducts}
                  filteredProducts={filteredProducts}
                  onFiltersChange={handleFiltersChange}
                  categories={categories}
                  filterOptions={filterOptions}
                  clearFilters={clearFiltersFlag}
                />
              </div>
            </div>
          </div>

          {/* Mobile Filters - Collapsible */}
          {isMobileFiltersOpen && (
            <div className="lg:hidden mb-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-md transition-colors duration-200"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-96">
                  <EnhancedFilters
                    filters={filters}
                    products={allCategoryProducts}
                    filteredProducts={filteredProducts}
                    onFiltersChange={handleFiltersChange}
                    categories={categories}
                    filterOptions={filterOptions}
                    clearFilters={clearFiltersFlag}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Area */}
          <div className="flex-1">
            {/* Products Count and Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                {/* Filter Button - Desktop Only */}
                <button
                  type="button"
                  onClick={() => setIsDesktopFiltersOpen(prev => !prev)}
                  className={`hidden lg:flex items-center px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none shadow-sm ${isDesktopFiltersOpen
                      ? 'bg-blue-50 border-2 border-blue-300 text-blue-700'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="font-medium">Filter</span>
                  <svg className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isDesktopFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 min-w-[150px] shadow-sm text-gray-900"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>



              <div className="text-brand-dark/70 text-sm">
                Showing <span className="font-semibold text-brand-dark">{displayedProducts.length}</span> of <span className="font-semibold text-brand-dark">{pagination.totalProducts}</span> {categoryName.toLowerCase()}</div>
            </div>

            {/* Products Grid */}
            <div className="products-page-grid">
              {displayedProducts.map((product, index) => (
                <div key={product._id || product.id} className="h-full">
                  <ProductCardModern product={product} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    loadCategoryProducts(pagination.currentPage - 1, false);
                  }}
                  disabled={pagination.currentPage === 1 || loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          loadCategoryProducts(pageNum, false);
                        }}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg transition-colors ${pagination.currentPage === pageNum
                            ? 'bg-brand-orange text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >{pageNum}</button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    loadCategoryProducts(pagination.currentPage + 1, false);
                  }}
                  disabled={pagination.currentPage === pagination.totalPages || loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsPage;