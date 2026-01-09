import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const SitemapPage = () => {
  // Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const sitemapSections = [
    {
      title: "Shop",
      icon: "🛍️",
      color: "brand-coral",
      links: [
        { name: "All Products", path: "/products" },
        { name: "Headphones", path: "/category/headphones" },
        { name: "Earphones", path: "/category/earphones" },
        { name: "Speakers", path: "/category/speakers" },
        { name: "Gaming Audio", path: "/category/gaming" },
        { name: "Accessories", path: "/category/accessories" },
        { name: "Special Offers", path: "/deals" },
        { name: "New Arrivals", path: "/new-arrivals" }
      ]
    },
    {
      title: "Account",
      icon: "👤",
      color: "brand-navy",
      links: [
        { name: "Sign In", path: "/login" },
        { name: "Create Account", path: "/register" },
        { name: "My Account", path: "/profile" },
        { name: "Order History", path: "/orders" },
        { name: "Wishlist", path: "/wishlist" },
        { name: "Track Order", path: "/track-order" }
      ]
    },
    {
      title: "Customer Service",
      icon: "🎧",
      color: "brand-teal",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Contact Us", path: "/contact" },
        { name: "Returns & Refunds", path: "/returns" },
        { name: "Shipping Information", path: "/shipping" },
        { name: "Size Guide", path: "/size-guide" },
        { name: "FAQ", path: "/faq" }
      ]
    },
    {
      title: "Company",
      icon: "🏢",
      color: "purple-500",
      links: [
        { name: "About SonicMart", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Press & Media", path: "/press" },
        { name: "Investor Relations", path: "/investors" },
        { name: "Store Locations", path: "/stores" },
        { name: "Affiliate Program", path: "/affiliate" }
      ]
    },
    {
      title: "Legal & Privacy",
      icon: "📋",
      color: "green-500",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "Data Protection", path: "/data-protection" },
        { name: "Accessibility", path: "/accessibility" }
      ]
    },
    {
      title: "Resources",
      icon: "📚",
      color: "yellow-500",
      links: [
        { name: "Audio Guides", path: "/guides" },
        { name: "Product Manuals", path: "/manuals" },
        { name: "Compatibility Check", path: "/compatibility" },
        { name: "Setup Tutorials", path: "/tutorials" },
        { name: "Community Forum", path: "/forum" },
        { name: "Blog", path: "/blog" }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sitemap - SonicMart</title>
        <meta name="description" content="Navigate SonicMart easily with our complete sitemap. Find all pages, categories, and sections in one place." />
      </Helmet>

      <div className="min-h-screen bg-brand-gray py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-brand-navy mb-4">Site Map</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Navigate SonicMart with ease. Find all our pages, categories, and sections organized for your convenience.
            </p>
          </div>

          {/* Quick Search */}
          <div className="mb-12">
            <div className="max-w-lg mx-auto relative">
              <input
                type="text"
                placeholder="Search pages..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const sections = document.querySelectorAll('.sitemap-section');
                  sections.forEach(section => {
                    const links = section.querySelectorAll('.sitemap-link');
                    let hasVisibleLinks = false;
                    
                    links.forEach(link => {
                      const text = link.textContent.toLowerCase();
                      if (text.includes(searchTerm)) {
                        link.style.display = 'flex';
                        hasVisibleLinks = true;
                      } else {
                        link.style.display = searchTerm === '' ? 'flex' : 'none';
                      }
                    });
                    
                    section.style.display = searchTerm === '' || hasVisibleLinks ? 'block' : 'none';
                  });
                }}
              />
              <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sitemap Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {sitemapSections.map((section, index) => (
              <div
                key={index}
                className="sitemap-section bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Section Header */}
                <div className="flex items-center mb-6">
                  <div className={`text-2xl mr-3 p-2 rounded-lg bg-${section.color} bg-opacity-10`}>
                    {section.icon}
                  </div>
                  <h2 className={`text-xl font-bold text-${section.color}`}>
                    {section.title}
                  </h2>
                </div>

                {/* Section Links */}
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className={`sitemap-link flex items-center text-gray-700 hover:text-${section.color} transition-colors duration-200 p-2 rounded-md hover:bg-gray-50 group`}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400 group-hover:text-brand-teal transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Link Count */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    {section.links.length} pages in this section
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Popular Pages */}
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-4 flex items-center">
                  <span className="mr-2">⭐</span>
                  Popular Pages
                </h3>
                <ul className="space-y-2">
                  <li><Link to="/products" className="text-brand-coral hover:underline font-medium">All Products</Link></li>
                  <li><Link to="/deals" className="text-brand-coral hover:underline font-medium">Special Offers</Link></li>
                  <li><Link to="/track-order" className="text-brand-coral hover:underline font-medium">Track Your Order</Link></li>
                  <li><Link to="/help" className="text-brand-coral hover:underline font-medium">Help Center</Link></li>
                  <li><Link to="/returns" className="text-brand-coral hover:underline font-medium">Returns & Refunds</Link></li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/products"
                    className="bg-brand-coral text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-center"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/contact"
                    className="bg-brand-teal text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-center"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/track-order"
                    className="bg-brand-navy text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-center"
                  >
                    Track Order
                  </Link>
                  <Link
                    to="/help"
                    className="bg-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-center"
                  >
                    Get Help
                  </Link>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-brand-coral">50+</div>
                  <div className="text-sm text-gray-600">Total Pages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-teal">6</div>
                  <div className="text-sm text-gray-600">Main Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-navy">15</div>
                  <div className="text-sm text-gray-600">Help Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-500">500+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-12 bg-gradient-to-r from-brand-coral to-brand-teal rounded-xl text-white p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h3>
            <p className="mb-6 opacity-90">
              Our customer support team is here to help you navigate our website and find exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-brand-coral px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                to="/help"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-coral transition-colors"
              >
                Browse FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SitemapPage;