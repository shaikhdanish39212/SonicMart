import React, { useEffect, useState, useCallback } from 'react';
import adminAPI from '../../utils/adminAPI';
import DealFormMinimal from '../../components/admin/DealFormMinimal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import debounce from 'lodash.debounce';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  
  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    dealId: null,
    dealName: ''
  });
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    expiredDeals: 0,
    upcomingDeals: 0,
    averageDiscount: 0
  });

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDeals();
      setDeals(response.data.data);
      calculateStats(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to get actual category name - more dynamic approach
  const getCategoryDisplayName = (category) => {
    if (!category || category === 'all') return 'All Categories';
    
    // Dynamic category mapping - handles any format
    const categoryMap = {
      'earbuds': 'Earbuds',
      'headphones': 'Headphones', 
      'speakers-monitors': 'Speakers & Monitors',
      'speakers': 'Speakers',
      'monitors': 'Monitors',
      'microphones': 'Microphones',
      'audio-interfaces': 'Audio Interfaces',
      'cables-adapters': 'Cables & Adapters',
      'stands-mounts': 'Stands & Mounts',
      'cases-bags': 'Cases & Bags',
      'power-accessories': 'Power & Accessories',
      'recording-equipment': 'Recording Equipment',
      'dj-equipment': 'DJ Equipment',
      'amplifiers': 'Amplifiers',
      'home-audio': 'Home Audio',
      'portable-audio': 'Portable Audio',
      'gaming-audio': 'Gaming Audio'
    };
    
    // First try exact match
    if (categoryMap[category.toLowerCase()]) {
      return categoryMap[category.toLowerCase()];
    }
    
    // Then try with dashes removed
    const noDashCategory = category.toLowerCase().replace(/-/g, '');
    for (const [key, value] of Object.entries(categoryMap)) {
      if (key.replace(/-/g, '') === noDashCategory) {
        return value;
      }
    }
    
    // Finally, format the category string nicely
    return category
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const calculateStats = (dealsData) => {
    const currentDate = new Date();
    
    // Active deals: currently running and active
    const activeDeals = dealsData.filter(deal => {
      const startDate = new Date(deal.validFrom);
      const endDate = new Date(deal.validUntil);
      return startDate <= currentDate && endDate >= currentDate && deal.isActive;
    });
    
    // Expired deals: past end date
    const expiredDeals = dealsData.filter(deal => {
      const endDate = new Date(deal.validUntil);
      return endDate < currentDate;
    });
    
    // Upcoming deals: not started yet
    const upcomingDeals = dealsData.filter(deal => {
      const startDate = new Date(deal.validFrom);
      return startDate > currentDate && deal.isActive;
    });
    
    // Calculate average discount
    const validDiscounts = dealsData.filter(deal => deal.discountValue && deal.discountValue > 0);
    const avgDiscount = validDiscounts.length > 0 
      ? (validDiscounts.reduce((sum, deal) => sum + deal.discountValue, 0) / validDiscounts.length).toFixed(1)
      : 0;

    setStats({
      totalDeals: dealsData.length,
      activeDeals: activeDeals.length,
      expiredDeals: expiredDeals.length,
      upcomingDeals: upcomingDeals.length,
      averageDiscount: avgDiscount
    });
  };

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleAdd = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  // Function to format deal name for display (matches table display logic)
  const formatDealName = (deal) => {
    if (!deal) return 'Unknown Deal';
    
    // Get category name using the same logic as the table display
    let categoryName = 'All Categories';
    
    // First try to get categories from applicableProducts (same as table logic)
    if (deal.applicableProducts && deal.applicableProducts.length > 0) {
      const productCategories = deal.applicableProducts
        .map(product => {
          if (typeof product === 'object' && product.category) {
            return getCategoryDisplayName(product.category);
          }
          return null;
        })
        .filter(Boolean);
      
      if (productCategories.length > 0) {
        // Remove duplicates and format
        const uniqueCategories = [...new Set(productCategories)];
        if (uniqueCategories.length === 1) {
          categoryName = uniqueCategories[0];
        } else if (uniqueCategories.length <= 2) {
          categoryName = uniqueCategories.join(' & ');
        } else {
          categoryName = `${uniqueCategories[0]} & ${uniqueCategories.length - 1} more`;
        }
      } else {
        // Fallback: if no product categories found, check if it's a category-wide deal
        categoryName = deal.category && deal.category !== 'all' 
          ? `All ${getCategoryDisplayName(deal.category)}`
          : 'All Categories';
      }
    } else {
      // Fallback to deal category if no applicable products
      categoryName = deal.category && deal.category !== 'all'
        ? `All ${getCategoryDisplayName(deal.category)}`
        : 'All Categories';
    }
    
    // Get discount information
    let discountText = 'No Discount';
    if (deal.discountValue && deal.discountValue > 0) {
      if (deal.type === 'percentage') {
        discountText = `${deal.discountValue}% OFF`;
      } else {
        discountText = `₹${deal.discountValue} OFF`;
      }
    }
    
    return `${categoryName} - ${discountText}`;
  };

  const handleDelete = (deal) => {
    // Open confirmation modal with properly formatted deal name
    setDeleteModal({
      isOpen: true,
      dealId: deal._id,
      dealName: formatDealName(deal)
    });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await adminAPI.deleteDeal(deleteModal.dealId);
      await fetchDeals(); // Refresh the deals list
      setSuccessMessage('Deal deleted successfully!');
      setDeleteModal({ isOpen: false, dealId: null, dealName: '' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete deal');
      setDeleteModal({ isOpen: false, dealId: null, dealName: '' });
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, dealId: null, dealName: '' });
  };

  const handleSave = async () => {
    // DealForm already made the API call, we just need to refresh and close
    await fetchDeals();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  const getDealStatus = (deal) => {
    const currentDate = new Date();
    const startDate = new Date(deal.validFrom);
    const endDate = new Date(deal.validUntil);
    
    if (currentDate < startDate) return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    if (currentDate > endDate) return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    return { status: 'Active', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F8F9FA 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#FF6B6B' }}></div>
          <h2 className="text-xl font-semibold" style={{ color: '#2C3E50' }}>Loading Deals...</h2>
          <p style={{ color: '#666' }}>Please wait while we fetch your deal data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F8F9FA 100%)' }}>
        <div className="text-center p-8 rounded-lg shadow-lg" style={{ backgroundColor: '#FEFCF3' }}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#2C3E50' }}>Error Loading Deals</h2>
          <p style={{ color: '#666' }}>{error}</p>
          <button 
            onClick={fetchDeals}
            className="mt-4 px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: '#FF6B6B' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F8F9FA 100%)' }}>
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-3 sm:mt-4 lg:mt-6">
        <div 
          className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
          style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)' }}
        >
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">Deal Management</h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg">Manage promotional offers and discounts</p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 rounded-full opacity-10 bg-white transform translate-x-24 sm:translate-x-32 -translate-y-24 sm:-translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 rounded-full opacity-10 bg-white transform -translate-x-16 sm:-translate-x-24 translate-y-16 sm:translate-y-24"></div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-3 sm:mt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {/* Statistics Dashboard */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Deals */}
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-md" style={{ backgroundColor: '#FEFCF3', border: '1px solid #FF6B6B20' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium" style={{ color: '#666' }}>Total Deals</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#2C3E50' }}>{stats.totalDeals}</p>
                <p className="text-xs mt-0.5" style={{ color: '#666' }}>
                  All deals in system
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF6B6B20' }}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Deals */}
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md" style={{ backgroundColor: '#FEFCF3', border: '1px solid #20B2AA20' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium" style={{ color: '#666' }}>Active Deals</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#2C3E50' }}>{stats.activeDeals}</p>
                <p className="text-xs mt-0.5" style={{ color: '#666' }}>
                  Currently running
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#20B2AA20' }}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#20B2AA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Upcoming Deals */}
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md" style={{ backgroundColor: '#FEFCF3', border: '1px solid #9333EA20' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium" style={{ color: '#666' }}>Upcoming Deals</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#2C3E50' }}>{stats.upcomingDeals}</p>
                <p className="text-xs mt-0.5" style={{ color: '#666' }}>
                  Scheduled to start
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9333EA20' }}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#9333EA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Discount */}
          <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md" style={{ backgroundColor: '#FEFCF3', border: '1px solid #F59E0B20' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium" style={{ color: '#666' }}>Avg. Discount</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#2C3E50' }}>{stats.averageDiscount}%</p>
                <p className="text-xs mt-0.5" style={{ color: '#666' }}>
                  {stats.totalDeals > 0 ? 'Across all deals' : 'No deals available'}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F59E0B20' }}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#2C3E50' }}>All Deals</h2>
          <button 
            onClick={handleAdd} 
            className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
            style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)' }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Deal
          </button>
        </div>

        {/* Enhanced Table */}
        <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: '#FEFCF3' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #2C3E50 0%, #20B2AA 100%)' }}>
                  <th className="text-left py-4 px-8 font-semibold text-white">Category</th>
                  <th className="text-left py-4 px-8 font-semibold text-white">Products</th>
                  <th className="text-left py-4 px-8 font-semibold text-white">Discount</th>
                  <th className="text-left py-4 px-8 font-semibold text-white">Status</th>
                  <th className="text-left py-4 px-8 font-semibold text-white">Valid From</th>
                  <th className="text-left py-4 px-8 font-semibold text-white">Valid Until</th>
                  <th className="text-left py-4 px-8 font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, index) => {
                  const dealStatus = getDealStatus(deal);
                  return (
                    <tr 
                      key={deal._id} 
                      className={`border-b border-gray-100 hover:shadow-md transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : ''
                      }`}
                      style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8F9FA' }}
                    >
                      {/* Category Column - Show actual product categories */}
                      <td className="py-4 px-8">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: '#20B2AA20' }}>
                            <svg className="w-4 h-4" style={{ color: '#20B2AA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: '#2C3E50' }}>
                              {(() => {
                                // Get actual product categories from the populated products
                                if (deal.applicableProducts && deal.applicableProducts.length > 0) {
                                  const productCategories = deal.applicableProducts
                                    .map(product => {
                                      if (typeof product === 'object' && product.category) {
                                        return getCategoryDisplayName(product.category);
                                      }
                                      return null;
                                    })
                                    .filter(Boolean);
                                  
                                  if (productCategories.length > 0) {
                                    // Remove duplicates and join
                                    const uniqueCategories = [...new Set(productCategories)];
                                    if (uniqueCategories.length === 1) {
                                      return uniqueCategories[0];
                                    } else if (uniqueCategories.length <= 2) {
                                      return uniqueCategories.join(' & ');
                                    } else {
                                      return `${uniqueCategories[0]} & ${uniqueCategories.length - 1} more`;
                                    }
                                  }
                                }
                                
                                // Fallback to deal category if no product categories found
                                return getCategoryDisplayName(deal.category);
                              })()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Products Column */}
                      <td className="py-4 px-8">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: '#9333EA20' }}>
                            <svg className="w-4 h-4" style={{ color: '#9333EA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: '#2C3E50' }}>
                              {(() => {
                                // Since backend populates applicableProducts with product names,
                                // we can directly access the populated data
                                if (deal.applicableProducts && deal.applicableProducts.length > 0) {
                                  const productNames = deal.applicableProducts
                                    .map(product => {
                                      // Handle both populated objects and string IDs
                                      if (typeof product === 'object' && product.name) {
                                        return product.name;
                                      } else if (typeof product === 'string') {
                                        // If it's still a string ID, show a fallback
                                        return `Product ${product.substring(0, 8)}`;
                                      }
                                      return null;
                                    })
                                    .filter(Boolean);
                                  
                                  if (productNames.length === 0) {
                                    return `${deal.applicableProducts.length} Specific Product${deal.applicableProducts.length !== 1 ? 's' : ''}`;
                                  }
                                  
                                  if (productNames.length === 1) {
                                    return productNames[0];
                                  } else if (productNames.length === 2) {
                                    return productNames.join(' & ');
                                  } else {
                                    return `${productNames[0]} & ${productNames.length - 1} more`;
                                  }
                                } else {
                                  return `All ${getCategoryDisplayName(deal.category)}`;
                                }
                              })()}
                            </p>
                            <p className="text-xs" style={{ color: '#666' }}>
                              {deal.applicableProducts && deal.applicableProducts.length > 0 
                                ? `${deal.applicableProducts.length} selected`
                                : deal.title || 'Category-wide deal'
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-8">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#20B2AA20', color: '#20B2AA' }}>
                          {deal.discountValue && deal.type === 'percentage' ? `${deal.discountValue}% OFF` : 
                           deal.discountValue && deal.type !== 'percentage' ? `$${deal.discountValue} OFF` : 
                           'No discount set'}
                        </span>
                      </td>
                      <td className="py-4 px-8">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dealStatus.color}`}>
                          {dealStatus.status}
                        </span>
                      </td>
                      <td className="py-4 px-8" style={{ color: '#2C3E50' }}>
                        {new Date(deal.validFrom).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-8" style={{ color: '#2C3E50' }}>
                        {new Date(deal.validUntil).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-8">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(deal)}
                            className="p-2 rounded-lg transition-colors hover:shadow-md"
                            style={{ backgroundColor: '#20B2AA20', color: '#20B2AA' }}
                            title="Edit Deal"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(deal)}
                            className="p-2 rounded-lg transition-colors hover:shadow-md"
                            style={{ backgroundColor: '#FF6B6B20', color: '#FF6B6B' }}
                            title="Delete Deal"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {deals.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FF6B6B20' }}>
                <svg className="w-8 h-8" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#2C3E50' }}>No deals found</h3>
              <p style={{ color: '#666' }}>Get started by creating your first promotional deal</p>
              <button 
                onClick={handleAdd}
                className="mt-4 px-6 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#FF6B6B' }}
              >
                Create First Deal
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <DealFormMinimal
          deal={editingDeal}
          onSuccess={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Deal"
        message={`Are you sure you want to delete the deal "${deleteModal.dealName}"? This action cannot be undone.`}
        confirmText="Delete Deal"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default DealsPage;
