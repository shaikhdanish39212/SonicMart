import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaStar, FaTags, FaRupeeSign, FaAward, FaCog } from 'react-icons/fa';

const EnhancedFilters = ({ 
  filters = {}, 
  onFiltersChange, 
  brands = [], 
  className = '',
  brandCounts = {},
  maxPrice = 50000,
  filterOptions = {},
  products = []
}) => {
  // Extract filter options with fallbacks
  const availableBrands = filterOptions?.brands || brands || [];
  const availableMaxPrice = filterOptions?.maxPrice || maxPrice || 50000;
  const availableFeatures = filterOptions?.features || ['Wireless', 'Bluetooth', 'Noise Cancelling', 'Waterproof', 'Fast Charging', 'Bass Boost'];

  // Debug logging
  console.log('Filter Debug:', {
    filterOptions,
    brands,
    availableBrands,
    products: products?.length || 0
  });

  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: false,
    rating: false,
    features: false,
    discount: false
  });

  // Sync with parent filters
  useEffect(() => {
    setLocalFilters(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
  }, [filters]);

  // Debounce filter changes to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onFiltersChange) {
        onFiltersChange(localFilters);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localFilters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const handleArrayFilterChange = (key, value) => {
    setLocalFilters(prevFilters => {
      const currentArray = prevFilters[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prevFilters,
        [key]: newArray
      };
    });
  };

  const handlePriceChange = (priceRange) => {
    setLocalFilters(prevFilters => ({
      ...prevFilters,
      priceRange: priceRange
    }));
  };

  const handleClearAll = () => {
    const clearedFilters = {
      categories: [],
      brands: [],
      priceRange: null,
      rating: 0,
      features: [],
      discount: '',
      inStock: false
    };
    setLocalFilters(clearedFilters);
    setExpandedSections({
      price: false,
      brand: false,
      rating: false,
      features: false,
      discount: false
    });
  };

  const hasActiveFilters = () => {
    return Object.values(localFilters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value;
      return value !== null && value !== undefined && value !== '' && value !== 0;
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(localFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) count += value.length;
      else if (typeof value === 'boolean' && value) count++;
      else if (value && value !== '' && value !== 0) count++;
    });
    return count;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Simplified Header - No duplicate title */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getActiveFilterCount() > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-brand-coral text-white rounded-full">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          {hasActiveFilters() && (
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <FaTimes className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Filter Sections Container */}
      <div 
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50 hover:scrollbar-thumb-orange-400"
        style={{ maxHeight: 'calc(100vh - 250px)', minHeight: '400px' }}
      >
        <div className="divide-y divide-gray-100">
        
        {/* Price Range Filter */}
        <div>
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, price: !prev.price }))}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FaRupeeSign className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900 text-left">Price Range</span>
              {(localFilters.priceRange && localFilters.priceRange[0] > 0 || localFilters.priceRange && localFilters.priceRange[1] < maxPrice) && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  1
                </span>
              )}
            </div>
            <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.price && (
            <div className="px-4 pb-4 bg-gray-50 space-y-4">
              {/* Current Range Display */}
              <div className="flex items-center justify-between text-sm font-medium text-gray-600">
                <span>₹{localFilters.priceRange?.[0] || 0}</span>
                <span className="text-gray-400">-</span>
                <span>₹{localFilters.priceRange?.[1] || availableMaxPrice}</span>
              </div>
              
              {/* Price Input Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={localFilters.priceRange?.[0] || ''}
                    onChange={(e) => {
                      const min = parseInt(e.target.value) || 0;
                      const max = localFilters.priceRange?.[1] || availableMaxPrice;
                      handlePriceChange([min, max]);
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder={availableMaxPrice.toString()}
                    value={localFilters.priceRange?.[1] || ''}
                    onChange={(e) => {
                      const max = parseInt(e.target.value) || availableMaxPrice;
                      const min = localFilters.priceRange?.[0] || 0;
                      handlePriceChange([min, max]);
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>
              
              {/* Quick Price Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Quick Select</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Under ₹1K', range: [0, 1000] },
                    { label: '₹1K - ₹2.5K', range: [1000, 2500] },
                    { label: '₹2.5K - ₹5K', range: [2500, 5000] },
                    { label: '₹5K & Above', range: [5000, availableMaxPrice] }
                  ].map((priceOption) => (
                    <button
                      key={priceOption.label}
                      onClick={() => handlePriceChange(priceOption.range)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        localFilters.priceRange?.[0] === priceOption.range[0] && 
                        localFilters.priceRange?.[1] === priceOption.range[1]
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {priceOption.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Filter */}
        <div>
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, brand: !prev.brand }))}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FaTags className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900 text-left">Brand</span>
              {localFilters.brands?.length > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {localFilters.brands.length}
                </span>
              )}
            </div>
            <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.brand && (
            <div className="px-4 pb-4 bg-gray-50">
              <div className="max-h-64 overflow-y-auto space-y-2">
                {availableBrands && availableBrands.length > 0 ? (
                  availableBrands.slice(0, 10).map((brand) => (
                    <label
                      key={brand}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-white cursor-pointer transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={localFilters.brands?.includes(brand) || false}
                          onChange={() => handleArrayFilterChange('brands', brand)}
                          className="w-4 h-4 text-orange-600 bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                        <span className={`text-sm ${localFilters.brands?.includes(brand) ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                          {brand}
                        </span>
                      </div>
                      {brandCounts && brandCounts[brand] && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {brandCounts[brand]}
                        </span>
                      )}
                    </label>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No brands available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div>
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, rating: !prev.rating }))}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FaAward className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900 text-left">Customer Rating</span>
              {localFilters.rating > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  1
                </span>
              )}
            </div>
            <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.rating && (
            <div className="px-4 pb-4 bg-gray-50 space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('rating', localFilters.rating === rating ? 0 : rating)}
                  className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-white transition-all w-full text-left border border-transparent hover:border-gray-200 hover:shadow-sm ${
                    localFilters.rating >= rating ? 'bg-orange-50 text-orange-700 border-orange-200' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm">& Up</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Features Filter */}
        <div>
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, features: !prev.features }))}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FaCog className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900 text-left">Features</span>
              {localFilters.features?.length > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {localFilters.features.length}
                </span>
              )}
            </div>
            <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expandedSections.features ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.features && (
            <div className="px-4 pb-4 bg-gray-50 space-y-2">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className="group flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={localFilters.features?.includes(feature) || false}
                      onChange={() => handleArrayFilterChange('features', feature)}
                      className="w-4 h-4 text-orange-600 bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                    <span className={`text-sm ${localFilters.features?.includes(feature) ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Discount Filter */}
        <div>
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, discount: !prev.discount }))}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FaTags className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900 text-left">Discount</span>
              {localFilters.discount && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  1
                </span>
              )}
            </div>
            <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expandedSections.discount ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.discount && (
            <div className="px-4 pb-4 bg-gray-50 space-y-2">
              {[
                { label: '10% and above', value: '10+' },
                { label: '20% and above', value: '20+' },
                { label: '30% and above', value: '30+' },
                { label: '50% and above', value: '50+' }
              ].map((discount) => (
                <label
                  key={discount.value}
                  className="group flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="discount"
                      value={discount.value}
                      checked={localFilters.discount === discount.value}
                      onChange={() => handleFilterChange('discount', 
                        localFilters.discount === discount.value ? '' : discount.value
                      )}
                      className="w-4 h-4 text-orange-600 bg-white border-2 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <span className={`text-sm ${localFilters.discount === discount.value ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {discount.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Stock Availability */}
        <div className="px-4 py-4 bg-gray-50">
          <label className="group flex items-center p-3 rounded-lg hover:bg-white cursor-pointer transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={localFilters.inStock || false}
                onChange={() => handleFilterChange('inStock', !localFilters.inStock)}
                className="w-4 h-4 text-orange-600 bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
              <span className={`text-sm font-medium ${localFilters.inStock ? 'text-gray-900' : 'text-gray-700'}`}>
                In Stock Only
              </span>
            </div>
          </label>
        </div>

        </div>
      </div>
    </div>
  );
};

export default EnhancedFilters;