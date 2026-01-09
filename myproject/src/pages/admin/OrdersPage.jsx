import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import adminAPI from '../../utils/adminAPI';
import debounce from 'lodash.debounce';
import { formatPrice } from '../../utils/currency';
import OrderDetailsModal from '../../components/OrderDetailsModal';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // URL parameter handling
  const [searchParams] = useSearchParams();
  const highlightOrderId = searchParams.get('orderId');
  const orderRefs = useRef({});
  
  // Search loading state
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15); // Fixed items per page for performance

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Optimized filtering and sorting with useMemo
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;
    
    // Apply search filter (search in customer name, email, order number, or order ID)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.user?.name?.toLowerCase().includes(searchLower) ||
        order.user?.email?.toLowerCase().includes(searchLower) ||
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order._id?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filtered;
  }, [orders, searchTerm, statusFilter]);
  
  // Paginated orders for rendering
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);
  
  // Calculate order statistics with analytics (based on filtered orders)
  const orderStats = useMemo(() => {
    const totalOrders = orders.length; // Use all orders for stats, not filtered
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
    const processingOrders = orders.filter(o => o.orderStatus === 'processing').length;
    const shippedOrders = orders.filter(o => o.orderStatus === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;
    
    const recentOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return orderDate >= oneWeekAgo;
    }).length;
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completionRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      recentOrders,
      averageOrderValue,
      completionRate,
      activeOrders: pendingOrders + processingOrders + shippedOrders
    };
  }, [orders]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Remove search and status params - we'll filter client-side
      const response = await adminAPI.getOrders();
      setOrders(response.data.data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependencies - only fetch once

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle highlighting and scrolling to specific order
  useEffect(() => {
    if (highlightOrderId && orders.length > 0) {
      // Small delay to ensure the DOM is rendered
      setTimeout(() => {
        const targetOrder = orders.find(order => 
          order.orderNumber === highlightOrderId || 
          `#${order._id.slice(-8)}` === highlightOrderId
        );
        
        if (targetOrder) {
          const orderElement = orderRefs.current[targetOrder._id];
          if (orderElement) {
            // Scroll to the order with some offset
            orderElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            
            // Add a temporary highlight effect
            orderElement.style.backgroundColor = '#FFF3CD';
            orderElement.style.transition = 'background-color 0.3s ease';
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
              orderElement.style.backgroundColor = '';
            }, 3000);
          }
        }
      }, 100);
    }
  }, [orders, highlightOrderId]);

  // Optimize debounced search for visual feedback only
  const debouncedSearch = useCallback(debounce(() => {
    setIsSearching(false);
  }, 600), []);

  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      debouncedSearch();
      return debouncedSearch.cancel;
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrder(orderId, { status: newStatus });
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  // Modal handlers
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="mt-2">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Status Overview Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="h-8 bg-gray-200 rounded w-8 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>
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
              <div className="w-24 h-8 bg-gray-200 rounded"></div>
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
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Reload Page
            </button>
            <button 
              onClick={fetchOrders}
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
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white" style={{background: 'linear-gradient(to right, #2C3E50, #34495e, #20B2AA)'}}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 sm:mb-6 lg:mb-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Order Management</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Track orders, manage fulfillment, and monitor sales performance across your platform
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Orders</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{orderStats.totalOrders}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-500">{orderStats.recentOrders} new this week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{formatPrice(orderStats.totalRevenue)}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs text-green-600">Avg: {formatPrice(orderStats.averageOrderValue)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active Orders</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{orderStats.activeOrders}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs text-orange-600">Pending fulfillment</span>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-card border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Completion Rate</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{orderStats.completionRate}%</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs text-purple-600">{orderStats.deliveredOrders} delivered</span>
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      {orderStats.totalOrders > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-card border border-gray-100 p-3 sm:p-4 lg:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Order Status Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{orderStats.pendingOrders}</div>
              <div className="text-sm text-gray-500">⏸️ Pending</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{orderStats.processingOrders}</div>
              <div className="text-sm text-yellow-600">⏳ Processing</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{orderStats.shippedOrders}</div>
              <div className="text-sm text-blue-600">🚚 Shipped</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-green-600">{orderStats.deliveredOrders}</div>
              <div className="text-xs sm:text-sm text-green-600">✅ Delivered</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2 sm:p-3 lg:p-4 text-center">
              <div className="text-lg sm:text-xl font-bold text-red-600">{orderStats.cancelledOrders}</div>
              <div className="text-xs sm:text-sm text-red-600">❌ Cancelled</div>
            </div>
          </div>
        </div>
      )}

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
              <label htmlFor="order-search" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Search Orders</label>
              <div className="relative">
                                <input
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 bg-white text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.trim()) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {isSearching && (
                  <div className="absolute inset-y-0 right-0 pr-8 sm:pr-10 flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {searchTerm && !isSearching && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                id="status-filter"
                name="statusFilter"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 bg-white"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏸️ Pending Orders</option>
                <option value="processing">⏳ Processing</option>
                <option value="shipped">🚚 Shipped</option>
                <option value="delivered">✅ Delivered</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Showing {filteredAndSortedOrders.length} of {orders.length} orders</span>
              {searchTerm && (
                <span className="text-orange-600">• Filtered by "{searchTerm}"</span>
              )}
              {statusFilter !== 'all' && (
                <span className="text-orange-600">• Status: {statusFilter}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Orders Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">No Orders Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || status !== 'all' 
                ? 'No orders match your current search and filter criteria. Try adjusting your filters.'
                : 'Orders will appear here once customers start making purchases. Your sales dashboard will show all order activity.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(searchTerm || status !== 'all') ? (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Clear Filters
                </button>
              ) : (
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  style={{background: 'linear-gradient(to right, #FF6B6B, #ef4444)'}}
                >
                  View Analytics
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Orders Overview</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white" style={{background: 'linear-gradient(to right, #2C3E50, #34495e)'}}>
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Order Details</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Customer Info</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Order Value</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Date</th>
                    <th className="text-center py-4 px-6 font-semibold text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {paginatedOrders.map((order, index) => (
                    <tr 
                      key={order._id} 
                      ref={el => orderRefs.current[order._id] = el}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 group-hover:scale-105 transition-transform">
                            📦
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{order.orderNumber || `#${order._id.slice(-8)}`}</div>
                            <div className="text-sm text-gray-500">{order.orderItems?.length || 0} items</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {order.user?.name || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            {order.user?.email || 'No email provided'}
                          </div>
                          {order.shippingAddress && (
                            <div className="text-xs text-gray-400 mt-1">
                              📍 {order.shippingAddress.city}, {order.shippingAddress.state}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{formatPrice(order.totalPrice || 0)}</div>
                          <div className="text-sm text-gray-500">
                            {order.paymentMethod && `💳 ${order.paymentMethod}`}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {order.orderItems?.length > 0 && `Avg: ${formatPrice((order.totalPrice || 0) / order.orderItems.length)}`}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                          order.orderStatus === 'delivered' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : order.orderStatus === 'shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.orderStatus === 'processing'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {order.orderStatus === 'delivered' && '✅'}
                          {order.orderStatus === 'shipped' && '🚚'}
                          {order.orderStatus === 'processing' && '⏳'}
                          {order.orderStatus === 'cancelled' && '❌'}
                          {order.orderStatus === 'pending' && '⏸️'}
                          {' '}{order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900 font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {Math.floor((Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-center space-y-2">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white text-gray-900 w-full"
                          >
                            <option value="pending">⏸️ Pending</option>
                            <option value="processing">⏳ Processing</option>
                            <option value="shipped">🚚 Shipped</option>
                            <option value="delivered">✅ Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                          <button 
                            onClick={() => handleViewDetails(order)}
                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {filteredAndSortedOrders.length > itemsPerPage && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.ceil(filteredAndSortedOrders.length / itemsPerPage) }, (_, i) => i + 1)
                      .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === Math.ceil(filteredAndSortedOrders.length / itemsPerPage))
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-3 py-2 text-sm text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              currentPage === page
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAndSortedOrders.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(filteredAndSortedOrders.length / itemsPerPage)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersPage;
