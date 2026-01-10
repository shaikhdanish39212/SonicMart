import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useRBAC } from '../context/RBACContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import EnhancedSearchBar from './EnhancedSearchBar';

const NavbarClean = () => {
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
  }

  const { wishlistItemCount = 0 } = useWishlist() || {};
  const { comparisonItemCount = 0 } = useProductComparison() || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Simplified main navigation (like Amazon/Flipkart)
  const mainNavLinks = [
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
    {
      to: '/deals',
      label: 'Deals',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12a3 3 0 01-.879 2.121c.592.591 1.348.879 2.121.879 1.414 0 2.6-1.076 2.6-2.6a2.6 2.6 0 00-.879-1.99c-.313-.244-.707-.377-1.121-.377-.828 0-1.55.572-1.842 1.967z" clipRule="evenodd" /></svg>
    },
  ];

  // Mobile menu links (comprehensive for mobile sidebar)
  const mobileNavLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/products', label: 'All Products', icon: '📦' },
    { to: '/categories', label: 'Categories', icon: '📂' },
    { to: '/deals', label: 'Deals', icon: '🔥' },
    { to: '/internal-components', label: 'Components', icon: '⚙️' },
    { to: '/coupons', label: 'Coupons', icon: '🎫' },
    { to: '/wishlist', label: 'Wishlist', icon: '❤️' },
    { to: '/compare', label: 'Compare', icon: '⚖️' },
  ];

  return (
    <>
      {/* Clean Modern Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">

        {/* Top Bar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-8 text-xs">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Free delivery on orders over ₹999</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">Customer Support: 1800-123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Hello, {user.name}</span>
                    {hasRole('admin') && (
                      <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-medium">
                        Admin
                      </Link>
                    )}
                    <Link to="/orders" className="text-gray-600 hover:text-brand-coral">
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                      }}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login" className="text-gray-600 hover:text-brand-coral">
                      Sign In
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/register" className="text-brand-coral hover:text-brand-coral/80 font-medium">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation - Clean Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left Section: Logo + Mobile Menu */}
            <div className="flex items-center space-x-4">

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-brand-coral hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200 bg-white border border-gray-100">
                  <img
                    src="/images/Brand_Logo.png"
                    alt="SonicMart"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-8 h-8 bg-brand-coral text-white text-sm font-bold rounded-lg items-center justify-center">
                    SM
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-bold bg-gradient-to-r from-brand-coral to-red-500 bg-clip-text text-transparent">
                    SonicMart
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Section: Search Bar */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <EnhancedSearchBar />
            </div>

            {/* Right Section: Navigation + Actions */}
            <div className="flex items-center space-x-6">

              {/* Desktop Navigation - Clean */}
              <div className="hidden lg:flex items-center space-x-6">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${isActivePath(link.to)
                        ? 'text-brand-coral bg-brand-coral/10'
                        : 'text-gray-700 hover:text-brand-coral hover:bg-gray-50'
                      }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Action Buttons - Clean */}
              <div className="flex items-center space-x-2">

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Wishlist"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>

                {/* Compare */}
                <Link
                  to="/compare"
                  className="relative p-2 text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Compare"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {comparisonItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {comparisonItemCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-brand-coral hover:bg-brand-coral/10 rounded-lg transition-all duration-200"
                  title="Shopping Cart"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-coral text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Account */}
                <div className="hidden md:block">
                  {user ? (
                    <Link
                      to="/profile"
                      className="p-2 text-gray-700 hover:text-brand-coral hover:bg-gray-50 rounded-lg transition-all duration-200"
                      title="Account"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 px-4 py-2 bg-brand-coral text-white rounded-lg hover:bg-brand-coral/90 transition-all duration-200 font-medium text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden border-t border-gray-100 py-3">
            <EnhancedSearchBar isMobile={true} />
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu - Clean */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'
        }`}>

        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0'
            }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Side Menu */}
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>

          {/* Menu Header */}
          <div className="bg-brand-coral text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Shop</h3>
              <div className="space-y-1">
                {mobileNavLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${isActivePath(link.to)
                        ? 'bg-brand-coral/10 text-brand-coral border-l-4 border-brand-coral'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Section */}
            {!user && (
              <div className="border-t pt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-brand-coral text-white rounded-lg hover:bg-brand-coral/90 transition-all duration-200 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarClean;