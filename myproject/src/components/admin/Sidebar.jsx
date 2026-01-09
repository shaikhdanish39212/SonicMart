import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <polyline points="9,11 12,14 22,4"></polyline>
        </svg>
      ),
    },
    {
      name: 'Contacts',
      href: '/admin/contacts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      name: 'Coupons',
      href: '/admin/coupons',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      name: 'Deals',
      href: '/admin/deals',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto" style={{ background: 'linear-gradient(180deg, #2C3E50 0%, #34495E 100%)' }}>
        {/* Header with Logo */}
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
              <img 
                src="/images/Brand_Logo.png" 
                alt="SonicMart Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-white font-bold text-xl bg-red-500 w-10 h-10 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>SM</span>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">SonicMart</h1>
              <div className="text-sm" style={{ color: '#20B2AA' }}>Admin Panel</div>
            </div>
          </div>
        </div>
        
        {/* Exit Admin Button */}
        <div className="px-6 mb-8">
          <Link
            to="/"
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #E74C3C 100%)' }}
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Exit Admin
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2">
          <div className="mb-4">
            <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</h2>
          </div>
          {navigation.map((item) => {
            const isActive = item.href === '/admin' 
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-lg transform translate-x-1'
                    : 'text-gray-300 hover:text-white hover:transform hover:translate-x-1'
                }`}
                style={isActive 
                  ? { background: 'linear-gradient(135deg, #20B2AA 0%, #17A2B8 100%)' }
                  : {}
                }
              >
                <span className={`mr-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-white opacity-80"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-xs text-gray-300">System Online</span>
            </div>
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">
                © 2025 SonicMart
              </div>
              <div className="text-xs text-gray-500">
                Admin Panel v1.0
              </div>
            </div>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <img 
                src="/images/Brand_Logo.png" 
                alt="SonicMart Logo" 
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-red-500 font-bold text-xs" style={{ display: 'none' }}>SM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;