import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import SafeSearchInput from './SafeSearchInput';
const EnhancedSearchBar = ({ onClose, isMobile = false, searchId }) => {
  ;
const [searchQuery, setSearchQuery] = useState('');
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(-1);
const [recentSearches, setRecentSearches] = useState([]);
const [popularSearches] = useState([
    'Bluetooth headphones', 'Wireless earbuds', 'Gaming headset', 
    'Noise cancelling', 'Sports earbuds', 'DJ speakers', 'Microphone'
  ]);
const [searchResults, setSearchResults] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [categories, setCategories] = useState([]);
const searchRef = useRef(null);
const dropdownRef = useRef(null);
const navigate = useNavigate();
const searchTimeoutRef = useRef(null);

  // Clear any browser-autofilled values on mount
  useEffect(() => {
    // Force clear search query to prevent browser autocomplete interference
    setSearchQuery('');
    
    // Multiple attempts to clear browser autofill
    const clearInput = () => {
      const searchInput = document.getElementById(searchId || (isMobile ? "mobile-product-search" : "desktop-product-search"));
      if (searchInput) {
        searchInput.value = '';
        setSearchQuery('');
      }
    };
    
    // Clear immediately
    clearInput();
    
    // Clear after small delays to catch browser autofill
    const timers = [50, 100, 200, 500].map(delay => 
      setTimeout(clearInput, delay)
    );
    
    return () => timers.forEach(clearTimeout);
  }, [searchId, isMobile]);

  // Additional effect to monitor and clear unwanted values
  useEffect(() => {
    const searchInput = document.getElementById(searchId || (isMobile ? "mobile-product-search" : "desktop-product-search"));
    
    if (searchInput) {
      const observer = new MutationObserver(() => {
        if (searchInput.value && searchInput.value.includes('@')) {
          searchInput.value = '';
          setSearchQuery('');
        }
      });
      
      observer.observe(searchInput, { 
        attributes: true, 
        attributeFilter: ['value'] 
      });
      
      // Also check periodically
      const interval = setInterval(() => {
        if (searchInput.value && searchInput.value.includes('@')) {
          searchInput.value = '';
          setSearchQuery('');
        }
      }, 100);
      
      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, [searchId, isMobile]);

  // Load recent searches and categories on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    // Load categories from API
const loadCategories = async () => {
    try {
    ;
const response = await productsAPI.getCategories();
    const categoriesData = response.data?.categories || response.categories || response;
const categoryMap = {
           'headphones': { icon: '' },
           'earbuds': { icon: '' },
           'speakers': { icon: '' },
           'microphones': { icon: '' },
           'neckband-earphones': { icon: '' },
           'dj-speakers': { icon: '' },
           'drums-percussion': { icon: '' },
           'guitars-basses': { icon: '' },
           'keyboards-pianos': { icon: '' },
           'studio-equipment': { icon: '' },
           'loud-speakers': { icon: '' },
           'home-theater': { icon: '' },
           'earphones': { icon: '' }
         };
const formattedCategories = Array.isArray(categoriesData) 
           ? categoriesData.map(cat => {
               ;
const categoryId = typeof cat === 'string' ? cat : cat.id;
const categoryName = typeof cat === 'string' ? cat : cat.name;
               return {
                 id: categoryId,
                 name: categoryName || categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                 icon: categoryMap[categoryId]?.icon || ''
               };
             })
           : [];
         
         setCategories(formattedCategories);
       } catch (error) {
         console.error('Failed to load categories:', error);
         // Fallback categories
         setCategories([
           { id: 'headphones', name: 'Headphones', icon: '' },
           { id: 'earbuds', name: 'Earbuds', icon: '' },
           { id: 'speakers', name: 'Speakers', icon: '' },
           { id: 'microphones', name: 'Microphones', icon: '' }
         ]);
       }
     };
    
    loadCategories();
  }, []);

  // Debounced search function
const performSearch = useCallback(async (query) => {
     if (!query.trim()) {
       setSearchResults([]);
       setIsLoading(false);
       return;
     }

     setIsLoading(true);
     try {
    const response = await productsAPI.searchProducts(query, { limit: 8 });
    const products = response.data?.products || response.products || response || [];
       setSearchResults(products.slice(0, 8)); // Limit to 8 results for dropdown
     } catch (error) {
       console.error('Search failed:', error);
       setSearchResults([]);
     } finally {
       setIsLoading(false);
     }
   }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Category suggestions based on search
const categorySuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
const query = searchQuery.toLowerCase();
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(query) || 
      cat.id.includes(query)
    ).slice(0, 3);
  }, [searchQuery]);

  // Handle search input change
const handleInputChange = (e) => {
    ;
const value = e.target.value;
    
    // Prevent email addresses from being entered
    if (value.includes('@')) {
      e.target.value = '';
      setSearchQuery('');
      setIsDropdownOpen(false);
      return;
    }
    
    setSearchQuery(value);
    setIsDropdownOpen(value.length > 0);
    setSelectedIndex(-1);
};


  // Handle search submission
const handleSearch = useCallback((query = searchQuery, type = 'general') => {
    if (!query.trim()) return;

    // Add to recent searches
const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    // Navigate to search results
    if (type === 'category') {
      const category = categories.find(cat => cat.name.toLowerCase() === query.toLowerCase());
if (category) {
        navigate(`/category/${category.id}`);
      }
    } else {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }

    // Close search
    setSearchQuery('');
    setIsDropdownOpen(false);
if (onClose) onClose();
  }, [searchQuery, recentSearches, navigate, onClose]);

  // Handle keyboard navigation
const handleKeyDown = (e) => {
    ;
const totalItems = searchResults.length + categorySuggestions.length + recentSearches.length + popularSearches.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
if (selectedIndex >= 0) {
          // Handle selection based on index
          if (selectedIndex < searchResults.length) {
            const product = searchResults[selectedIndex];
            navigate(`/product/${product.id}`);
          } else if (selectedIndex < searchResults.length + categorySuggestions.length) {
            const catIndex = selectedIndex - searchResults.length;
            handleSearch(categorySuggestions[catIndex].name, 'category');
          } else {
            // Handle recent or popular searches
const remainingIndex = selectedIndex - searchResults.length - categorySuggestions.length;
if (remainingIndex < recentSearches.length) {
              handleSearch(recentSearches[remainingIndex]);
            } else {
              const popIndex = remainingIndex - recentSearches.length;
              handleSearch(popularSearches[popIndex]);
            }
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
if (onClose) onClose();
        break;
    }
  };

  // Clear recent searches
const clearRecentSearches = () => {
  setRecentSearches([]);
    localStorage.removeItem('recentSearches');
};


  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'w-[24rem]'}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg border-2 border-gray-200/80 focus-within:border-brand-coral focus-within:shadow-lg shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden">
          <div className="pl-3 pr-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <SafeSearchInput
            id={searchId || (isMobile ? "mobile-product-search" : "desktop-product-search")}
            name="search-products-query"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsDropdownOpen(searchQuery.length > 0 || recentSearches.length > 0)}
            className="flex-1 py-2.5 px-2 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsDropdownOpen(false);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={() => handleSearch()}
            className="px-4 py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-medium text-sm transition-all duration-300 flex items-center gap-1 min-w-[80px]"
          >
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      {isDropdownOpen && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-coral mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          )}
          
          {/* Search Results */}
          {!isLoading && searchResults.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Products ({searchResults.length})
              </div>
              {searchResults.map((product, index) => (
                <Link
                  key={product._id || product.id}
                  to={`/product/${product._id || product.id}`}
                  onClick={() => {
                    setIsDropdownOpen(false);
if (onClose) onClose();
                  }}
                  className={`flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors ${
                    selectedIndex === index ? 'bg-brand-coral/10' : ''
                  }`}
                >
                  <img 
                    src={getImageUrl(product.image || product.images?.[0])} 
                    alt={product.name}
                    className="w-10 h-10 object-contain rounded-lg mr-3 bg-gray-50"
                    onError={(e) => {
                      e.target.src = '/images/DJSpeaker1.png';
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{product.category?.replace('-', ' ')}</div>
                  </div>
                  <div className="text-brand-coral font-semibold">₹{product.price}</div>
                </Link>
              ))}
      </div>
    )
  }

          {/* Category Suggestions */}
          {categorySuggestions.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Categories
              </div>
              {categorySuggestions.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleSearch(category.name, 'category')}
                  className={`flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left ${
                    selectedIndex === searchResults.length + index ? 'bg-brand-coral/10' : ''
                  }`}
                >
                  <span className="text-xl mr-3">{category.icon}</span>
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="ml-auto text-xs text-gray-500">Category</span>
                </button>
              ))}
      </div>
    )
  }

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="flex justify-between items-center px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-brand-coral hover:text-brand-coral/80 transition-colors"
                >
                  Clear All
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${search}-${index}`}
                  onClick={() => handleSearch(search)}
                  className={`flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left ${
                    selectedIndex === searchResults.length + categorySuggestions.length + index ? 'bg-brand-coral/10' : ''
                  }`}
                >
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
      </div>
    )
  }

          {/* Popular Searches */}
          {!searchQuery && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Popular Searches
              </div>
              {popularSearches.map((search, index) => (
                <button
                  key={`popular-${search}-${index}`}
                  onClick={() => handleSearch(search)}
                  className={`flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left ${
                    selectedIndex === searchResults.length + categorySuggestions.length + recentSearches.length + index ? 'bg-brand-coral/10' : ''
                  }`}
                >
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-gray-700">{search}</span>
                  <span className="ml-auto text-xs text-gray-400"></span>
                </button>
              ))}
      </div>
    )
  }

          {/* No Results */}
          {!isLoading && searchQuery && searchResults.length === 0 && categorySuggestions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium mb-2">No results found for "{searchQuery}"</p>
              <p className="text-sm">Try searching for headphones, earbuds, speakers, or microphones</p>
            </div>
          )}
      </div>
    )
  }
    </div>
  );
};

export default EnhancedSearchBar;
