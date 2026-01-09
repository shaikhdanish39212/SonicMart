import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useRBAC } from '../context/RBACContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import ModernSearchBar from './ModernSearchBar';

const Navbar = () => {
  const { cartItemCount = 0 } = useContext(CartContext) || {};
  const auth = useContext(AuthContext);
  
  // Add null check for auth context
  const user = auth?.user;
  const isAuthenticated = auth?.isAuthenticated;
  
  // Safely get RBAC context with error handling
  let rbac = null;
  let hasRole = () => false;
  
  try {
    rbac = useRBAC();
    hasRole = rbac?.hasRole || (() => false);
  } catch (error) {
    console.warn('RBAC context not available:', error.message);
    // Continue with default values
  }
  
  const { wishlist = [] } = useWishlist() || {};
  const { comparisonItemCount = 0 } = useProductComparison() || {};
  const wishlistItemCount = wishlist.length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Category navigation items with SVG icons
  const categoryLinks = [
    { 
      to: '/', 
      label: 'Home', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
    },
    { 
      to: '/products', 
      label: 'All Products', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a1 1 0 011-1h2a1 1 0 011 1v3H8z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/categories', 
      label: 'Categories', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    },

  ];

  // Additional menu items for "More" dropdown (keeps navbar clean but accessible)
  const moreMenuItems = [
    { 
      to: '/deals', 
      label: 'Hot Deals', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 717 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/internal-components', 
      label: 'Components', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/coupons', 
      label: 'Coupons', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 102 2h12a2 2 0 102-2V4a2 2 0 00-2-2H4zm0 2h12v11H4V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/about', 
      label: 'About Us', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/contact', 
      label: 'Contact', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
    },
    { 
      to: '/help', 
      label: 'Help & Support', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.05 6.863c.286-.414.656-.584 1.143-.584.487 0 .857.17 1.143.584a1.05 1.05 0 01.2.617c0 .213-.049.426-.171.639-.097.17-.245.347-.463.554l-.662.627c-.418.39-.418.646-.418.82v.608a.5.5 0 01-1 0v-.572c0-.408 0-.967.537-1.467l.663-.618c.186-.179.308-.317.308-.463 0-.09-.036-.182-.118-.259a.757.757 0 00-.518-.19c-.482 0-.72.188-.72.525a.5.5 0 11-1 0c0-.816.414-1.401 1.076-1.401zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
    },
  ];

  // Enhanced navigation links with SVG icons
  const navLinks = [
    { 
      to: '/', 
      label: 'Home', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
    },
    { 
      to: '/products', 
      label: 'Products', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a1 1 0 011-1h2a1 1 0 011 1v3H8z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/categories', 
      label: 'Categories', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    },
    { 
      to: '/deals', 
      label: 'Deals', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/coupons', 
      label: 'Coupons', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0115 5a3 3 0 013 3v6a3 3 0 01-3 3v-6a5 5 0 00-10 0v6a3 3 0 01-3-3V8a3 3 0 013-3zm2 2V5a1 1 0 112 0v2a1 1 0 11-2 0zm6 0V5a1 1 0 112 0v2a1 1 0 11-2 0z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/wishlist', 
      label: 'Wishlist', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
    },
    { 
      to: '/compare', 
      label: 'Compare', 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
    },
  ];

  return (
    <>
      {/* Enhanced Professional Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        
        {/* Main Navigation - Enhanced Layout */}
        <div className="w-full py-1">
          <div className="flex items-center h-16 px-3 sm:px-4">
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-brand-coral hover:bg-gradient-to-r hover:from-brand-coral/10 hover:to-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-brand-coral/20 mr-3"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Enhanced Logo - Mobile Optimized */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-4 group flex-shrink-0">
              <div className="relative p-1.5 sm:p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border border-gray-200 group-hover:border-brand-coral/30">
                <img 
                  src="/images/Brand_Logo.png" 
                  alt="SonicMart" 
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-brand-coral to-red-500 text-white text-sm sm:text-base font-bold rounded-xl items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  SM
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-coral/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </div>
              <div className="hidden sm:block">
                <div className="space-y-1">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-coral via-red-500 to-orange-500 bg-clip-text text-transparent group-hover:from-brand-coral/90 group-hover:via-red-400 group-hover:to-orange-400 transition-all duration-300">
                    SonicMart
                  </span>
                  <p className="text-xs text-gray-500 font-medium tracking-wide">Sounds Accessories and Components</p>
                </div>
              </div>
              {/* Mobile Logo Text - Show only brand name on mobile */}
              <div className="sm:hidden">
                <span className="text-lg font-bold bg-gradient-to-r from-brand-coral via-red-500 to-orange-500 bg-clip-text text-transparent">
                  SonicMart
                </span>
              </div>
            </Link>

            {/* Enhanced Search Bar - Positioned after logo */}
            <div className="hidden md:flex items-center flex-1 ml-6 lg:ml-10 mr-6 lg:mr-20">
              <div className="w-full">
                <ModernSearchBar />
              </div>
            </div>

            {/* Right Section: Enhanced Navigation Links + Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0 ml-auto">

              {/* Enhanced Navigation Links - Desktop */}
              <div className="hidden lg:flex items-center space-x-2">
                {categoryLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-xl group ${
                      isActivePath(link.to)
                        ? 'text-white bg-gradient-to-r from-brand-coral to-red-500 shadow-lg shadow-brand-coral/30'
                        : 'text-gray-600 hover:text-brand-coral hover:bg-gradient-to-r hover:from-brand-coral/10 hover:to-red-50 border border-transparent hover:border-brand-coral/20'
                    }`}
                  >
                    <span className="mr-2 transition-transform duration-300 group-hover:scale-110">{link.icon}</span>
                    <span className="whitespace-nowrap">{link.label}</span>
                    {/* Active indicator */}
                    {isActivePath(link.to) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </Link>
                ))}
                
                {/* Enhanced More dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="flex items-center px-3 py-2 text-sm font-semibold text-gray-600 hover:text-brand-coral hover:bg-gradient-to-r hover:from-brand-coral/10 hover:to-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-brand-coral/20 group"
                  >
                    <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                    </svg>
                    <span className="whitespace-nowrap">More</span>
                    <svg className={`w-4 h-4 ml-2 transition-all duration-300 ${dropdownOpen ? 'rotate-180 scale-110' : 'group-hover:scale-110'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  
                  {/* Enhanced Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {moreMenuItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-brand-coral/10 hover:to-red-50 hover:text-brand-coral transition-all duration-200 mx-2 rounded-xl group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="mr-3 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                          <span>{item.label}</span>
                          <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Action Buttons - Navigation Style */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                
                {/* Cart - Navigation Style - Mobile Optimized */}
                <Link
                  to="/cart"
                  className="relative flex items-center px-2 sm:px-3 py-2 text-sm font-semibold text-gray-600 hover:text-brand-coral hover:bg-gradient-to-r hover:from-brand-coral/10 hover:to-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-brand-coral/20 group"
                >
                  <svg className="w-5 h-5 sm:mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span className="whitespace-nowrap hidden sm:inline">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 sm:relative sm:top-auto sm:right-auto sm:ml-2 bg-gradient-to-r from-brand-coral to-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Account - Navigation Style - Desktop */}
                <div className="hidden md:block">
                  {user ? (
                    <Link 
                      to="/profile" 
                      className="relative flex items-center px-3 py-2 text-sm font-semibold text-gray-600 hover:text-brand-coral hover:bg-gradient-to-r hover:from-brand-coral/10 hover:to-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-brand-coral/20 group"
                    >
                      <div className="relative mr-2">
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="whitespace-nowrap">Account</span>
                    </Link>
                  ) : (
                    <Link 
                      to="/login" 
                      className="flex items-center px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-coral to-red-500 hover:from-brand-coral/90 hover:to-red-400 rounded-xl transition-all duration-300 border border-transparent group"
                    >
                      <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="whitespace-nowrap">Sign In</span>
                    </Link>
                  )}
                </div>

                {/* Mobile Account - Navigation Style - Mobile Optimized */}
                <div className="md:hidden">
                  {user ? (
                    <Link 
                      to="/profile" 
                      className="flex items-center px-2 py-2 text-sm font-semibold text-gray-600 hover:text-brand-coral hover:bg-gradient-to-r hover:from-brand-coral/10 hover:to-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-brand-coral/20 group"
                    >
                      <div className="relative">
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                    </Link>
                  ) : (
                    <Link 
                      to="/login" 
                      className="flex items-center px-2 py-2 text-sm font-semibold text-gray-600 hover:text-brand-coral hover:bg-gradient-to-r hover:from-brand-coral/10 hover:to-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-brand-coral/20 group"
                    >
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                      </svg>
                    </Link>
                  )}
                </div>

                {/* 3-Dot Menu Button - Mobile Optimized */}
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center p-1.5 sm:p-2 text-gray-700 hover:text-brand-coral hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden border-t border-gray-100 px-4 py-3">
            <ModernSearchBar isMobile={true} />
          </div>
        </div>
      </nav>

      {/* Enhanced Professional Sidebar */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'visible' : 'invisible'
      }`}>
        
        {/* Backdrop with Blur Effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm transition-all duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Professional Sidebar Panel */}
        <div className={`absolute right-0 top-0 h-full w-[400px] max-w-[90vw] bg-white shadow-2xl transform transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* Modern Header with Gradient */}
          <div className="relative bg-gradient-to-r from-brand-coral to-red-500 text-white p-6 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full transform -translate-x-10 translate-y-10"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <img 
                    src="/images/Brand_Logo.png" 
                    alt="SonicMart" 
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <svg className="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">SonicMart</h2>
                  <p className="text-white/80 text-sm">Your Audio Paradise</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex flex-col h-full overflow-y-auto">
            
            {/* Enhanced User Profile Section */}
            <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
              {user ? (
                <div className="space-y-4">
                  {/* User Avatar and Info */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">Welcome back!</h3>
                      <p className="font-semibold text-brand-coral">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email || 'Valued Customer'}</p>
                    </div>
                  </div>
                  
                  {/* User Action Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    {hasRole('admin') && (
                      <Link 
                        to="/admin" 
                        className="group flex items-center space-x-3 p-4 bg-white border border-purple-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:shadow-md"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-purple-600">Admin Panel</p>
                          <p className="text-sm text-gray-500">Manage your store</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                    
                    <Link 
                      to="/my-orders" 
                      className="group flex items-center space-x-3 p-4 bg-white border border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:shadow-md"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600">My Orders</p>
                        <p className="text-sm text-gray-500">Track your purchases</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                      }}
                      className="group flex items-center space-x-3 p-4 bg-white border border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 hover:shadow-md w-full"
                    >
                      <div className="p-2 bg-red-100 group-hover:bg-red-200 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900 group-hover:text-red-600">Sign Out</p>
                        <p className="text-sm text-gray-500">Logout securely</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest User Welcome */
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Welcome to SonicMart!</h3>
                    <p className="text-gray-600 mb-4">Sign in to access your account and enjoy personalized features</p>
                    <div className="flex space-x-3">
                      <Link 
                        to="/login" 
                        className="flex-1 px-4 py-3 bg-brand-coral text-white rounded-lg text-center hover:bg-brand-coral/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        onClick={() => setSidebarOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/register" 
                        className="flex-1 px-4 py-3 border-2 border-brand-coral text-brand-coral rounded-lg text-center hover:bg-brand-coral hover:text-white transition-all duration-200 font-medium"
                        onClick={() => setSidebarOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Your Lists Section */}
            <div className="p-6 bg-white border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Your Collections</h4>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to="/wishlist" 
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 hover:shadow-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 group-hover:bg-red-200 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-red-600">Wishlist</p>
                      <p className="text-sm text-gray-500">Saved items you love</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {wishlistItemCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                        {wishlistItemCount}
                      </span>
                    )}
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                
                <Link 
                  to="/compare" 
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:shadow-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600">Compare Products</p>
                      <p className="text-sm text-gray-500">Side-by-side comparison</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAuthenticated && comparisonItemCount > 0 && (
                      <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                        {comparisonItemCount}
                      </span>
                    )}
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu - Amazon Style Slide-out */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
        isMenuOpen ? 'visible' : 'invisible'
      }`}>
        
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Side Menu */}
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          
          {/* Menu Header */}
          <div className="bg-brand-coral text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-lg font-bold">
                  {user ? `Hello, ${user.name}` : 'Hello, Sign In'}
                </span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-brand-coral/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="p-4 space-y-6">
            
            {/* Main Navigation */}
            <div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Shop by Category</h3>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      isActivePath(link.to)
                        ? 'bg-brand-coral/10 text-brand-coral border-l-4 border-brand-coral'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                    {isActivePath(link.to) && (
                      <div className="ml-auto w-2 h-2 bg-brand-coral rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Your Account</h3>
              <div className="space-y-1">
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">Your Account</span>
                    </Link>
                    <Link 
                      to="/my-orders" 
                      className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="font-medium">Your Orders</span>
                    </Link>
                    {hasRole('admin') && (
                      <Link 
                        to="/admin" 
                        className="flex items-center space-x-3 p-3 rounded-lg text-purple-700 hover:bg-purple-50 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Sign In</span>
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex items-center space-x-3 p-3 rounded-lg bg-brand-coral text-white hover:bg-brand-coral/90 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span className="font-medium">Create Account</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;