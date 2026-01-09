import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModernSearchBar = ({ isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <form onSubmit={handleSearch}>
          <div className="flex rounded-lg border border-gray-300 focus-within:border-brand-coral bg-white">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2.5 text-sm rounded-l-lg border-0 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-coral text-white rounded-r-lg hover:bg-opacity-90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch}>
        <div className="flex rounded-lg border border-gray-300 focus-within:border-brand-coral focus-within:ring-1 focus-within:ring-brand-coral bg-white shadow-sm">
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 px-4 py-2.5 text-sm border-0 focus:outline-none bg-white rounded-l-lg"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="px-6 py-2.5 text-brand-coral rounded-r-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModernSearchBar;