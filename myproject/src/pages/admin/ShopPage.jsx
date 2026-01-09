import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminShopPage = () => {
  const navigate = useNavigate();
  const [shopSettings, setShopSettings] = useState({
    storeName: 'SonicMart',
    storeDescription: 'Your premier destination for sound accessories',
    isOpen: true,
    maintenanceMode: false,
    featuredCategories: [],
    announcements: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopSettings();
  }, []);

  const fetchShopSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/shop/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setShopSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch shop settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStore = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/shop/toggle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isOpen: !shopSettings.isOpen })
      });

      if (response.ok) {
        setShopSettings(prev => ({ ...prev, isOpen: !prev.isOpen }));
      }
    } catch (error) {
      console.error('Failed to toggle store status:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm px-4 sm:px-6 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shop Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your store settings and configuration</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
              shopSettings.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {shopSettings.isOpen ? 'Store Open' : 'Store Closed'}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 sm:h-48">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Store Status */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Store Status</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">Store Open/Closed</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Control whether customers can place orders</p>
                </div>
                <button
                  onClick={handleToggleStore}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    shopSettings.isOpen ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      shopSettings.isOpen ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">Maintenance Mode</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Show maintenance page to visitors</p>
                </div>
                <button
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    shopSettings.maintenanceMode ? 'bg-yellow-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      shopSettings.maintenanceMode ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={shopSettings.storeName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={shopSettings.storeDescription}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors duration-200">
                  📦
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Products</h3>
                <p className="text-xs text-gray-500">Manage inventory</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/orders')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors duration-200">
                  📋
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Orders</h3>
                <p className="text-xs text-gray-500">Process orders</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors duration-200">
                  👥
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Users</h3>
                <p className="text-xs text-gray-500">Manage customers</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/deals')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200 transition-colors duration-200">
                  🏷️
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Deals</h3>
                <p className="text-xs text-gray-500">Manage promotions</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminShopPage;