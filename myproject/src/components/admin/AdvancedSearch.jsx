import React, { useState, useEffect } from 'react';

const AdvancedSearch = ({ 
  onSearch, 
  searchType = 'users', // 'users', 'products', 'orders'
  initialFilters = {},
  isLoading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: { start: '', end: '' },
    status: 'all',
    sortBy: 'created',
    sortOrder: 'desc',
    ...initialFilters
  });

  // Search type specific configurations
  const searchConfigs = {
    users: {
      statusOptions: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' }
      ],
      sortOptions: [
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'role', label: 'Role' },
        { value: 'created', label: 'Date Created' },
        { value: 'lastLogin', label: 'Last Login' }
      ],
      additionalFilters: [
        {
          key: 'role',
          label: 'Role',
          type: 'select',
          options: [
            { value: 'all', label: 'All Roles' },
            { value: 'admin', label: 'Administrator' },
            { value: 'moderator', label: 'Moderator' },
            { value: 'user', label: 'User' }
          ]
        }
      ]
    },
    products: {
      statusOptions: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      sortOptions: [
        { value: 'name', label: 'Name' },
        { value: 'price', label: 'Price' },
        { value: 'stock', label: 'Stock' },
        { value: 'created', label: 'Date Created' },
        { value: 'updated', label: 'Last Updated' }
      ],
      additionalFilters: [
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { value: 'all', label: 'All Categories' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'books', label: 'Books' },
            { value: 'home', label: 'Home & Garden' }
          ]
        },
        {
          key: 'stockStatus',
          label: 'Stock Status',
          type: 'select',
          options: [
            { value: 'all', label: 'All Stock Levels' },
            { value: 'in-stock', label: 'In Stock' },
            { value: 'low-stock', label: 'Low Stock' },
            { value: 'out-of-stock', label: 'Out of Stock' }
          ]
        },
        {
          key: 'priceRange',
          label: 'Price Range',
          type: 'range',
          fields: [
            { key: 'min', placeholder: 'Min Price', type: 'number' },
            { key: 'max', placeholder: 'Max Price', type: 'number' }
          ]
        }
      ]
    },
    orders: {
      statusOptions: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      sortOptions: [
        { value: 'date', label: 'Order Date' },
        { value: 'total', label: 'Total Amount' },
        { value: 'customer', label: 'Customer Name' },
        { value: 'status', label: 'Status' }
      ],
      additionalFilters: [
        {
          key: 'paymentStatus',
          label: 'Payment Status',
          type: 'select',
          options: [
            { value: 'all', label: 'All Payment Status' },
            { value: 'paid', label: 'Paid' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
            { value: 'refunded', label: 'Refunded' }
          ]
        },
        {
          key: 'totalRange',
          label: 'Order Total Range',
          type: 'range',
          fields: [
            { key: 'min', placeholder: 'Min Amount', type: 'number' },
            { key: 'max', placeholder: 'Max Amount', type: 'number' }
          ]
        }
      ]
    }
  };

  const config = searchConfigs[searchType];

  useEffect(() => {
    // Trigger search when filters change
    const timeoutId = setTimeout(() => {
      onSearch(filters);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters, onSearch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRangeChange = (rangeKey, fieldKey, value) => {
    setFilters(prev => ({
      ...prev,
      [rangeKey]: {
        ...prev[rangeKey],
        [fieldKey]: value
      }
    }));
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      dateRange: { start: '', end: '' },
      status: 'all',
      sortBy: 'created',
      sortOrder: 'desc',
      ...Object.fromEntries(
        config.additionalFilters.map(filter => {
          if (filter.type === 'range') {
            return [filter.key, { min: '', max: '' }];
          }
          return [filter.key, 'all'];
        })
      )
    };
    setFilters(resetFilters);
  };

  const renderAdditionalFilter = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.key} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <select
              value={filters[filter.key] || 'all'}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
            >
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'range':
        return (
          <div key={filter.key} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <div className="flex space-x-2">
              {filter.fields.map(field => (
                <input
                  key={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={filters[filter.key]?.[field.key] || ''}
                  onChange={(e) => handleRangeChange(filter.key, field.key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Basic Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={`Search ${searchType}...`}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-coral focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-coral transition-colors duration-200"
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
            <svg 
              className={`ml-2 h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Status Filter */}
            <div className="flex flex-col">
              <label htmlFor="advanced-status" className="text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="advanced-status"
                name="advancedStatus"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
              >
                {config.statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  id="date-start"
                  name="dateStart"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleRangeChange('dateRange', 'start', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                />
                <input
                  id="date-end"
                  name="dateEnd"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleRangeChange('dateRange', 'end', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="flex flex-col">
              <label htmlFor="advanced-sort-by" className="text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="advanced-sort-by"
                name="advancedSortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
              >
                {config.sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex flex-col">
              <label htmlFor="advanced-sort-order" className="text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <select
                id="advanced-sort-order"
                name="advancedSortOrder"
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* Additional Filters */}
            {config.additionalFilters.map(renderAdditionalFilter)}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-coral transition-colors duration-200"
            >
              Reset Filters
            </button>
            
            <div className="text-sm text-gray-500">
              {isLoading && (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-coral" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;