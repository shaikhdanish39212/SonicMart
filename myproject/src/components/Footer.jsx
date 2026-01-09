import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { footerAPI } from '../utils/api';
import { contactInfo } from '../config/contactInfo';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState({ loading: false, message: '', type: '' });

  // Function to handle scroll to top when footer links are clicked
  const handleLinkClick = () => {
    // Small delay to allow navigation to complete
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      // Fallback for browsers that don't support smooth behavior
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterStatus({ loading: false, message: 'Please enter a valid email address', type: 'error' });
      return;
    }

    setNewsletterStatus({ loading: true, message: '', type: '' });
    
    try {
      const response = await footerAPI.subscribeNewsletter(newsletterEmail, 'footer');
      setNewsletterStatus({ loading: false, message: response.message, type: 'success' });
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus({ 
        loading: false, 
        message: error.message || 'Failed to subscribe. Please try again.', 
        type: 'error' 
      });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-brand-coral to-red-500 py-6 lg:py-8">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 lg:mb-6">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 lg:mb-2">Stay Updated</h3>
              <p className="text-white/90 text-base lg:text-lg">Get exclusive deals and latest audio gear updates</p>
            </div>
            <div className="flex w-full max-w-md">
              <form onSubmit={handleNewsletterSubmit} className="flex w-full">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white text-gray-900 placeholder-gray-500"
                  disabled={newsletterStatus.loading}
                />
                <button
                  type="submit"
                  disabled={newsletterStatus.loading}
                  className="px-6 py-3 bg-white text-brand-coral font-semibold rounded-r-lg hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50"
                >
                  {newsletterStatus.loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
          {newsletterStatus.message && (
            <div className="mt-4 text-center">
              <p className={`text-sm ${newsletterStatus.type === 'success' ? 'text-green-100' : 'text-red-100'}`}>
                {newsletterStatus.message}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-8 lg:py-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-coral/20 via-transparent to-brand-teal/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-brand-coral/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-teal/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8">
            
            {/* Brand Section */}
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                  <img 
                    src="/images/Brand_Logo.png" 
                    alt="SonicMart Logo" 
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-red-500 font-bold text-xl" style={{ display: 'none' }}>SM</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">SonicMart</h2>
                  <p className="text-xs text-brand-coral font-medium">Premium Audio Experience</p>
                </div>
              </div>
              
              <div className="text-gray-300 mb-4 lg:mb-6 leading-relaxed text-sm text-justify space-y-1">
                <p>India's premier destination for premium audio equipment.</p>
                <p>From professional-grade headphones to cutting-edge speakers,</p>
                <p>we bring you the finest audio gear with unmatched</p>
                <p>quality and service.</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                <div className="flex items-center text-gray-300">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-3 text-brand-coral flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <span className="text-sm">{contactInfo.phone.primary}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-3 text-brand-coral flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className="text-sm">{contactInfo.email.support}</span>
                </div>
                <div className="flex items-start text-gray-300">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-3 mt-0.5 text-brand-coral flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm">{contactInfo.address.full}</span>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="flex space-x-3">
                <a 
                  href={contactInfo.socials.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-2 lg:p-3 bg-white/5 rounded-full border border-white/10 hover:bg-brand-coral hover:border-brand-coral transition-all duration-300"
                  title="Follow us on Facebook"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a 
                  href={contactInfo.socials.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-2 lg:p-3 bg-white/5 rounded-full border border-white/10 hover:bg-brand-coral hover:border-brand-coral transition-all duration-300"
                  title="Follow us on Instagram"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a 
                  href={contactInfo.socials.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-2 lg:p-3 bg-white/5 rounded-full border border-white/10 hover:bg-brand-coral hover:border-brand-coral transition-all duration-300"
                  title="Follow us on Twitter"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a 
                  href={contactInfo.socials.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-2 lg:p-3 bg-white/5 rounded-full border border-white/10 hover:bg-brand-coral hover:border-brand-coral transition-all duration-300"
                  title="Subscribe to our YouTube channel"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-base lg:text-lg font-bold mb-4 lg:mb-6 text-white">Shop Categories</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link 
                    to="/products?category=headphones" 
                    onClick={handleLinkClick}
                    className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center"
                  >
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Headphones
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products?category=earbuds" 
                    onClick={handleLinkClick}
                    className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center"
                  >
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Earbuds & TWS
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products?category=speakers" 
                    onClick={handleLinkClick}
                    className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center"
                  >
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Speakers
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products?category=microphones" 
                    onClick={handleLinkClick}
                    className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center"
                  >
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Microphones
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Account */}
            <div>
              <h3 className="text-base lg:text-lg font-bold mb-4 lg:mb-6 text-white">Your Account</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link to="/cart" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Your Cart
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/orders" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Your Orders
                  </Link>
                </li>
                <li>
                  <Link to="/profile" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Your Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-base lg:text-lg font-bold mb-4 lg:mb-6 text-white">Customer Service</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link to="/help" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/returns" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Info */}
            <div>
              <h3 className="text-base lg:text-lg font-bold mb-4 lg:mb-6 text-white">Company</h3>
              <ul className="space-y-2 lg:space-y-3">
                <li>
                  <Link to="/about" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    About SonicMart
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" onClick={handleLinkClick} className="text-gray-300 hover:text-brand-coral transition-colors duration-300 text-sm flex items-center">
                    <span className="w-1 h-1 bg-brand-coral rounded-full mr-3 flex-shrink-0"></span>
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Trust Badges & Features */}
          <div className="border-t border-white/20 mt-8 lg:mt-12 pt-6 lg:pt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
              <div className="flex flex-col items-center text-center p-3 lg:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-2 lg:mb-3">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.68 5.39A3 3 0 008.62 15h2.76a3 3 0 002.94-2.61L15 7H6.41l-.77-3H3z" />
                  </svg>
                </div>
                <span className="text-xs lg:text-sm font-medium text-white">Free Shipping</span>
                <span className="text-xs text-gray-400 mt-1">On orders ₹999+</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 lg:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-2 lg:mb-3">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs lg:text-sm font-medium text-white">Secure Payment</span>
                <span className="text-xs text-gray-400 mt-1">SSL Protected</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 lg:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-2 lg:mb-3">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs lg:text-sm font-medium text-white">Easy Returns</span>
                <span className="text-xs text-gray-400 mt-1">30-Day Policy</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 lg:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-brand-coral to-red-500 rounded-full flex items-center justify-center mb-2 lg:mb-3">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs lg:text-sm font-medium text-white">24/7 Support</span>
                <span className="text-xs text-gray-400 mt-1">Expert Help</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 lg:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2 lg:mb-3">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs lg:text-sm font-medium text-white">Authentic Products</span>
                <span className="text-xs text-gray-400 mt-1">100% Genuine</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 lg:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mb-2 lg:mb-3">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <span className="text-xs lg:text-sm font-medium text-white">Expert Reviews</span>
                <span className="text-xs text-gray-400 mt-1">Detailed Analysis</span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/20 mt-6 lg:mt-8 pt-4 lg:pt-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
              <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6 text-center lg:text-left">
                <p className="text-gray-400 text-xs lg:text-sm">© 2025 SonicMart Technologies Pvt Ltd. All rights reserved.</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <Link to="/privacy" onClick={handleLinkClick} className="hover:text-brand-coral transition-colors">Privacy Policy</Link>
                  <span>•</span>
                  <Link to="/terms" onClick={handleLinkClick} className="hover:text-brand-coral transition-colors">Terms of Service</Link>
                  <span>•</span>
                  <Link to="/cookies" onClick={handleLinkClick} className="hover:text-brand-coral transition-colors">Cookie Policy</Link>
                  <span>•</span>
                  <Link to="/sitemap" onClick={handleLinkClick} className="hover:text-brand-coral transition-colors">Sitemap</Link>
                </div>
              </div>
              <div className="flex items-center text-gray-500 text-xs lg:text-sm">
                <span>Made with</span>
                <svg className="w-3 h-3 mx-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>in India for audio enthusiasts worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
