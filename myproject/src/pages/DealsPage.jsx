import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext'
import { useProductComparison } from '../context/ProductComparisonContext';
import { useProductCache } from '../context/ProductCacheContext';
import ProductCardModern from '../components/ProductCardModern';
import { ChevronLeft, ChevronRight, Clock, Tag, TrendingUp, Star, Filter, Grid3X3, List, Search, Zap, Music, IndianRupee, Truck, Headphones, Mic, Volume2, Home, Settings, Piano, Guitar, Drum, Megaphone } from 'lucide-react';
const DealsPage = () => {
const [deals, setDeals] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedCategory, setSelectedCategory] = useState('All Categories');
const [viewType, setViewType] = useState('grid');
const [sortBy, setSortBy] = useState('featured');
const [showFilters, setShowFilters] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [priceRange, setPriceRange] = useState([0, 50000]);
const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 49 });
const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
const { comparisonList, addToComparison } = useProductComparison();
const { getDeals, isDealsCached } = useProductCache();

  // Icon mapping function for categories
  const getCategoryIcon = (iconType) => {
    const iconProps = { size: 18, className: "transition-transform duration-300 group-hover:scale-110" };
    
    switch(iconType) {
      case 'all': return <Grid3X3 {...iconProps} />;
      case 'dj-speakers': return <Volume2 {...iconProps} />;
      case 'drums': return <Drum {...iconProps} />;
      case 'earbuds': return <Headphones {...iconProps} />;
      case 'earphones': return <Headphones {...iconProps} />;
      case 'guitars': return <Guitar {...iconProps} />;
      case 'headphones': return <Headphones {...iconProps} />;
      case 'home-theater': return <Home {...iconProps} />;
      case 'internal-components': return <Settings {...iconProps} />;
      case 'keyboards': return <Piano {...iconProps} />;
      case 'loud-speakers': return <Megaphone {...iconProps} />;
      case 'microphones': return <Mic {...iconProps} />;
      case 'neckband': return <Headphones {...iconProps} />;
      case 'speakers': return <Volume2 {...iconProps} />;
      case 'studio': return <Music {...iconProps} />;
      default: return <Music {...iconProps} />;
    }
  };

  // All 15 categories with display names and icons  
  const categories = [
    { key: 'All Categories', name: 'All Categories', iconType: 'all', count: '200+' },
    { key: 'dj-speakers', name: 'DJ Speakers', iconType: 'dj-speakers', count: '15' },
    { key: 'drums-percussion', name: 'Drums & Percussion', iconType: 'drums', count: '18' },
    { key: 'earbuds', name: 'Earbuds', iconType: 'earbuds', count: '12' },
    { key: 'earphones', name: 'Earphones', iconType: 'earphones', count: '14' },
    { key: 'guitars-basses', name: 'Guitars & Basses', iconType: 'guitars', count: '20' },
    { key: 'headphones', name: 'Headphones', iconType: 'headphones', count: '16' },
    { key: 'home-theater', name: 'Home Theater', iconType: 'home-theater', count: '10' },
    { key: 'internal-components', name: 'Internal Components', iconType: 'internal-components', count: '25' },
    { key: 'keyboards-pianos', name: 'Keyboards & Pianos', iconType: 'keyboards', count: '14' },
    { key: 'loud-speakers', name: 'Loud Speakers', iconType: 'loud-speakers', count: '12' },
    { key: 'microphones', name: 'Microphones', iconType: 'microphones', count: '18' },
    { key: 'neckband-earphones', name: 'Neckband Earphones', iconType: 'neckband', count: '8' },
    { key: 'speakers', name: 'Speakers', iconType: 'speakers', count: '22' },
    { key: 'studio-equipment', name: 'Studio Equipment', iconType: 'studio', count: '16' }
  ];
const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'discount', label: 'Highest Discount' }
  ]; 
// Countdown timer effect 
useEffect(() => { 
const timer = setInterval(() => { 
setTimeLeft(prev => { 
if (prev.seconds > 0) { 
return { ...prev, seconds: prev.seconds - 1 }; 
} else if (prev.minutes > 0) { 
return { ...prev, minutes: prev.minutes - 1, seconds: 59 }; 
} else if (prev.hours > 0) { 
return { hours: prev.hours - 1, minutes: 59, seconds: 59 }; 
}
return prev; 
}); 
}, 1000);
  return () => clearInterval(timer); }, []);
const handleWishlistToggle = (product) => { if (wishlist && wishlist.some(item => item._id === product._id || item.id === product.id)) { removeFromWishlist(product._id || product.id); } else { addToWishlist(product); } };
const handleAddToComparison = (product) => { if (comparisonList && comparisonList.length >= 4) { alert('You can only compare up to 4 products at a time.'); return; }
if (comparisonList && !comparisonList.some(item => item._id === product._id || item.id === product.id)) { addToComparison(product); } };
// Load once on mount to avoid refetch loops when context updates
const loadDeals = useCallback(async () => {
    try {
      console.log('[DealsPage] loadDeals: start');
      setLoading(true);
      setError(null);
      
      // Use cache when available to keep getDeals stable and avoid triggering effect loops
      const result = await getDeals(false);
      const count = Array.isArray(result?.data) ? result.data.length : 0;
      console.log(`[DealsPage] loadDeals: received ${count} deals ${result?.fromCache ? '(from cache)' : '(fresh data)'}`);
      setDeals(result?.data || []);
      
    } catch (err) {
      console.error('Error loading deals:', err);
      setError(`Failed to load products. ${err?.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
      console.log('[DealsPage] loadDeals: end, loading=false');
    }
  }, []);
  useEffect(() => { loadDeals(); }, []);

  // Apply category filter
  const filteredDeals = selectedCategory === 'All Categories' ? (Array.isArray(deals) ? deals : []) : (Array.isArray(deals) ? deals.filter(deal => deal.category === selectedCategory) : []);

  // Apply search filter 
  const searchFilteredDeals = searchTerm ? filteredDeals.filter(deal => deal.name?.toLowerCase().includes(searchTerm.toLowerCase()) || deal.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || deal.category?.toLowerCase().includes(searchTerm.toLowerCase()) ) : filteredDeals; 

  // Apply price filter 
  const priceFilteredDeals = searchFilteredDeals.filter(deal => {
    const price = deal.discountedPrice || deal.price || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Apply sorting
  const sortedDeals = [...priceFilteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.discountedPrice || a.price || 0) - (b.discountedPrice || b.price || 0);
      case 'price-high':
        return (b.discountedPrice || b.price || 0) - (a.discountedPrice || a.price || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white sm:bg-[#FEFCF3]">
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8A65 30%, #20B2AA 70%, #2C3E50 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        <div className="relative mobile-container sm:max-w-screen-2xl mx-auto py-2 sm:py-3 lg:py-5">
          <div className="text-center text-white">
            {/* Flash Sale Badge */}
            <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold mb-1.5 sm:mb-2 animate-pulse shadow-lg" style={{ backgroundColor: '#20B2AA', color: 'white' }}>
              <Clock className="w-3 h-3 mr-1" />
              FLASH SALE ENDS IN: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </div>
            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 sm:mb-3 leading-tight">
              <span className="block text-white drop-shadow-lg">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">MEGA AUDIO</span>
              </span>
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FEFCF3, #F8F9FA)' }}>SALE</span>
            </h1>
            {/* Dynamic Deal Highlights */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-1 sm:gap-2 mb-3 sm:mb-4 max-w-4xl mx-auto">
              <div className="flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg backdrop-blur-sm border-2 transform hover:scale-105 transition-all duration-300" style={{ backgroundColor: '#FEFCF3', borderColor: '#20B2AA', color: '#2C3E50' }}>
                <Zap className="text-sm mr-1" size={14} />
                <span className="font-bold text-xs">Flash Deals</span>
              </div>
              <div className="flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg backdrop-blur-sm border-2 transform hover:scale-105 transition-all duration-300" style={{ backgroundColor: '#FEFCF3', borderColor: '#20B2AA', color: '#2C3E50' }}>
                <Music className="text-sm mr-1" size={14} />
                <span className="font-bold text-xs">Premium Audio</span>
              </div>
              <div className="flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg backdrop-blur-sm border-2 transform hover:scale-105 transition-all duration-300" style={{ backgroundColor: '#FEFCF3', borderColor: '#20B2AA', color: '#2C3E50' }}>
                <IndianRupee className="text-sm mr-1" size={14} />
                <span className="font-bold text-xs">Best Prices</span>
              </div>
              <div className="flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg backdrop-blur-sm border-2 transform hover:scale-105 transition-all duration-300" style={{ backgroundColor: '#FEFCF3', borderColor: '#20B2AA', color: '#2C3E50' }}>
                <Truck className="text-sm mr-1" size={14} />
                <span className="font-bold text-xs">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
        {/* Modern Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0,80 C300,120 500,0 800,60 C1000,100 1100,40 1200,80 L1200,120 L0,120 Z" fill="#FEFCF3" opacity="0.8"/>
          </svg>
        </div>
      </div>

      {/* Enhanced Category Navigation - Clean Tabs */}
      <div className="border-b-2 py-2 sm:py-3" style={{ backgroundColor: '#F8F9FA', borderColor: '#20B2AA' }}>
        <div className="mobile-container sm:max-w-screen-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2" style={{ color: '#2C3E50' }}>
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Find the perfect audio equipment for your needs
            </p>
          </div>
          
          {/* Clean Tab-Style Categories */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 max-w-5xl mx-auto px-2 sm:px-0">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => {
                  setSelectedCategory(category.key);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group flex items-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 border-2 min-w-[100px] sm:min-w-[120px] justify-center ${
                  selectedCategory === category.key 
                    ? 'transform scale-105 shadow-lg' 
                    : 'hover:shadow-md hover:transform hover:scale-102'
                }`}
                style={{
                  background: selectedCategory === category.key 
                    ? 'linear-gradient(135deg, #20B2AA, #2C3E50)' 
                    : '#FFFFFF',
                  borderColor: selectedCategory === category.key ? '#20B2AA' : '#E5E7EB',
                  color: selectedCategory === category.key ? 'white' : '#2C3E50'
                }}
              >
                {/* Icon */}
                <span className="text-sm sm:text-base mr-1 sm:mr-2">
                  {getCategoryIcon(category.iconType)}
                </span>
                {/* Category Name */}
                <span className="font-bold whitespace-nowrap">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters Sidebar */}
      {showFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-opacity-50" style={{ backgroundColor: '#2C3E50' }} onClick={() => setShowFilters(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 shadow-2xl overflow-y-auto" style={{ backgroundColor: '#FEFCF3' }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: '#2C3E50' }}>Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#F8F9FA', color: '#2C3E50' }}>
                  ×
                </button>
              </div>
              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-bold mb-4 text-lg" style={{ color: '#2C3E50' }}>Price Range</h4>
                <div className="space-y-4">
                  <input 
                    id="priceRangeMax" 
                    name="priceRangeMax" 
                    type="range" 
                    min="0" 
                    max="50000" 
                    value={priceRange[1]} 
                    onChange={(e) => {
                      setPriceRange([priceRange[0], parseInt(e.target.value)]);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer" 
                    style={{ backgroundColor: '#F8F9FA' }} 
                  />
                  <div className="flex justify-between text-base font-bold" style={{ color: '#FF6B6B' }}>
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
              {/* Quick Filters */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg" style={{ color: '#2C3E50' }}>Quick Filters</h4>
                <div className="space-y-3">
                  {['Under ₹1000', '₹1000 - ₹5000', '₹5000 - ₹15000', 'Above ₹15000'].map(range => (
                    <button 
                      key={range} 
                      className="w-full text-left px-4 py-3 text-base font-medium border-2 rounded-lg hover:shadow-md transition-all duration-200" 
                      style={{ borderColor: '#20B2AA', backgroundColor: '#F8F9FA', color: '#2C3E50' }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-transparent mx-auto mb-3 sm:mb-4" style={{ borderColor: '#FF6B6B' }}></div>
            <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: '#2C3E50' }}>Loading Premium Products...</h3>
            <p className="text-sm font-medium" style={{ color: '#FF6B6B' }}>Fetching the best deals for you</p>
            {process.env.NODE_ENV !== 'production' && (
              <p className="text-xs text-gray-500 mt-2">Debug: loading is true; waiting for API response...</p>
            )}
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{ color: '#2C3E50' }}>Something went wrong</h3>
            <p className="text-sm sm:text-base mb-4 sm:mb-6" style={{ color: '#FF6B6B' }}>{error}</p>
            <button onClick={loadDeals} className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg transition-all duration-200 transform hover:scale-105" style={{ backgroundColor: '#20B2AA', color: 'white' }}>
              Try Again
            </button>
          </div>
        ) : sortedDeals.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{ color: '#2C3E50' }}>No products found</h3>
            <p className="text-sm sm:text-base mb-4 sm:mb-6" style={{ color: '#FF6B6B' }}>Try adjusting your filters or search terms</p>
            <button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
              setPriceRange([0, 50000]);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg transition-all duration-200 transform hover:scale-105" style={{ backgroundColor: '#20B2AA', color: 'white' }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Products Grid */}
            <div className="products-page-grid">
              {sortedDeals.slice(0, 12).map((deal, index) => (
                <div key={deal._id || deal.id} style={{ animationDelay: `${index * 50}ms` }} className="h-full opacity-0 animate-fadeInUp">
                  <ProductCardModern product={deal} viewType={viewType} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DealsPage;