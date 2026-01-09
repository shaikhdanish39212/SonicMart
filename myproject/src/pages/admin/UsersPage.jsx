import React, { useEffect, useState, useCallback } from 'react';
import adminAPI from '../../utils/adminAPI';
import UserForm from '../../components/admin/UserForm';
import debounce from 'lodash.debounce';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, userId: null, userName: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Calculate user statistics with analytics
  const userStats = React.useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.length; // All users are active since deleted ones are permanently removed
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    const recentUsers = users.filter(u => {
      const createdDate = new Date(u.createdAt || Date.now());
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return createdDate >= oneWeekAgo;
    }).length;
    
    const averageJoinRate = totalUsers > 0 ? (recentUsers / 7).toFixed(1) : 0;
    
    return {
      totalUsers,
      activeUsers,
      adminUsers,
      regularUsers,
      recentUsers,
      averageJoinRate,
      adminPercentage: totalUsers > 0 ? ((adminUsers / totalUsers) * 100).toFixed(1) : 0
    };
  }, [users]);

  const fetchUsers = useCallback(async () => {
    try {
      // Don't show main loading for search, use isSearching instead
      if (!searchTerm) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }
      
      const params = {
        search: searchTerm,
      };
      
      // Only add role parameter if it's not 'all'
      if (role !== 'all') {
        params.role = role;
      }
      
      console.log('Fetching users with params:', params); // Debug log
      const response = await adminAPI.getUsers(params);
      console.log('API response:', response.data); // Debug log
      setUsers(response.data.data.users);
    } catch (err) {
      console.error('Error fetching users:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [searchTerm, role]);

  // Use debounced fetch for search term changes with longer delay
  const debouncedFetchUsers = useCallback(
    debounce(() => {
      fetchUsers();
    }, 600), // Reduced to 600ms for better responsiveness
    [searchTerm, role] // Dependencies that should trigger new debounced function
  );

  // Separate effect for immediate role changes (no debounce needed)
  const prevRole = React.useRef(role);
  useEffect(() => {
    if (prevRole.current !== role) {
      prevRole.current = role;
      fetchUsers(); // Immediate fetch for role changes
    }
  }, [role, fetchUsers]);

  // Debounced effect for search term changes
  useEffect(() => {
    if (searchTerm !== '') {
      setIsSearching(true); // Show searching indicator immediately when typing
      debouncedFetchUsers();
    } else if (searchTerm === '') {
      // Immediate fetch when search is cleared
      fetchUsers();
    }
    
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchTerm, debouncedFetchUsers, fetchUsers]);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []); // Only run once on mount

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setDeleteConfirmation({
      show: true,
      userId: user._id,
      userName: user.name
    });
  };

  const confirmDelete = async () => {
    // Store the userId before clearing the confirmation state
    const userIdToDelete = deleteConfirmation.userId;
    const userNameToDelete = deleteConfirmation.userName;
    
    // Hide confirmation dialog immediately
    setDeleteConfirmation({ show: false, userId: null, userName: '' });
    
    try {
      console.log('Attempting to delete user with ID:', userIdToDelete);
      const response = await adminAPI.deleteUser(userIdToDelete);
      console.log('Delete response:', response);
      
      // Show success message
      setSuccessMessage(`User "${userNameToDelete}" deleted successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh the user list
      await fetchUsers();
      
    } catch (err) {
      console.error('Delete user error:', err);
      console.error('Error response:', err.response);
      
      // Show error message
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete user';
      setError(errorMessage);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, userId: null, userName: '' });
  };

  const handleSave = async (userData) => {
    try {
      console.log('Saving user data:', userData);
      
      if (editingUser) {
        // Update existing user
        await adminAPI.updateUser(editingUser._id, userData);
        console.log('User updated successfully');
      } else {
        // Create new user
        await adminAPI.createUser(userData);
        console.log('User created successfully');
      }
      
      // Close modal and refresh users list
      setIsModalOpen(false);
      setEditingUser(null);
      await fetchUsers();
      
      // Clear any errors
      setError(null);
      
    } catch (err) {
      console.error('Save user error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save user';
      setError(errorMessage);
    }
  };

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gray-200 rounded-2xl h-32"></div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="mt-2">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Filter Section Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        </div>
        <div className="space-y-4 p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-card border border-red-200 p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Users</h3>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Reload Page
            </button>
            <button 
              onClick={fetchUsers}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 font-medium text-sm sm:text-base">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-white" style={{background: 'linear-gradient(to right, #2C3E50, #34495e, #20B2AA)'}}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-3 sm:mb-4 lg:mb-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">User Management</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Manage user accounts, permissions, and monitor user activity across your platform
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={handleAdd} 
              className="bg-coral hover:bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
              style={{background: 'linear-gradient(to right, #FF6B6B, #ef4444)'}}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Users</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{userStats.totalUsers}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-500">{userStats.recentUsers} new this week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active Users</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{userStats.activeUsers}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs text-green-600">✓ Currently online</span>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Administrators</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{userStats.adminUsers}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs text-purple-600">{userStats.adminPercentage}% of total</span>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Join Rate</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{userStats.averageJoinRate}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs text-orange-600">users per day</span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-card border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            Search & Filters
          </h3>
        </div>
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="user-search" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Search Users</label>
              <div className="relative">
                <input
                  id="user-search"
                  name="userSearch"
                  type="text"
                  placeholder="Search by name, email, or role..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-8 sm:pl-12 pr-8 sm:pr-10 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 bg-white text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-4 flex items-center pointer-events-none">
                  {isSearching ? (
                    <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-2 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="role-filter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter by Role</label>
              <select
                id="role-filter"
                name="roleFilter"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">👤 Regular Users</option>
                <option value="admin">👑 Administrators</option>
              </select>
            </div>
          </div>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Showing {users.length} users</span>
              {isSearching && (
                <span className="text-orange-600 flex items-center">
                  <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              )}
              {searchTerm && !isSearching && (
                <span className="text-orange-600">• Filtered by "{searchTerm}"</span>
              )}
              {role !== 'all' && (
                <span className="text-orange-600">• Role: {role}</span>
              )}
            </div>
            <div className="flex space-x-2">
              {(searchTerm || role !== 'all') ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRole('all');
                  }}
                  className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear Filters</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Users Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-card border border-gray-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">No Users Found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto px-4">
              {searchTerm || role !== 'all' 
                ? 'No users match your current search and filter criteria. Try adjusting your filters.'
                : 'Get started by creating your first user account to manage access to your platform.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4">
              {(searchTerm || role !== 'all') ? (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setRole('all');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              ) : (
                <button 
                  onClick={handleAdd}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
                  style={{background: 'linear-gradient(to right, #FF6B6B, #ef4444)'}}
                >
                  Add Your First User
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Users Directory</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white" style={{background: 'linear-gradient(to right, #2C3E50, #34495e)'}}>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 lg:px-6 font-semibold text-xs sm:text-sm uppercase tracking-wider">User</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 lg:px-6 font-semibold text-xs sm:text-sm uppercase tracking-wider">Contact Info</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Role & Permissions</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Join Date</th>
                    <th className="text-center py-4 px-6 font-semibold text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base mr-2 sm:mr-3 group-hover:scale-105 transition-transform">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm sm:text-base">{user.name || 'Unknown User'}</div>
                            <div className="text-xs sm:text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {user.lastLogin ? `Last seen: ${new Date(user.lastLogin).toLocaleDateString()}` : 'Never logged in'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-xs sm:text-sm text-gray-500 flex items-center mt-0.5 sm:mt-1">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 lg:px-6">
                        <div className="space-y-1 sm:space-y-2">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                            user.role === 'admin' 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {user.role === 'admin' ? '👑 Administrator' : '👤 Regular User'}
                          </span>
                          <div className="text-xs text-gray-500">
                            {user.role === 'admin' ? 'Full platform access' : 'Standard user permissions'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap bg-green-50 text-green-700 border-green-200">
                          ✅ Active
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.floor((Date.now() - new Date(user.createdAt || Date.now())) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleEdit(user)} 
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md flex items-center space-x-1"
                            style={{background: 'linear-gradient(to right, #20B2AA, #06b6d4)'}}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(user)} 
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md flex items-center space-x-1"
                            style={{background: 'linear-gradient(to right, #FF6B6B, #ef4444)'}}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      
      {/* User Form Modal */}
      {isModalOpen && (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-red-200 max-w-md mx-auto">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete User Permanently
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to permanently delete <strong>{deleteConfirmation.userName}</strong>? 
              This action cannot be undone and will completely remove the user from the database.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
