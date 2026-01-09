import React, { useState, useEffect, useContext } from 'react';
import { usersAPI, ordersAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { getImageUrl } from '../utils/imageUrl';
import { 
  FaShoppingBag, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaDownload, 
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaBox,
  FaCalendarAlt,
  FaRupeeSign,
  FaStar,
  FaTimes
} from 'react-icons/fa';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Get location to detect navigation
  const location = useLocation();
  
  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Cancel order states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  
  // Delete order states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Invoice download state
  const [downloadingInvoice, setDownloadingInvoice] = useState(null);
  
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Dynamic Icon Components
  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  );

  const FilterIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

// Fetch orders
  const fetchOrders = async (forceRefresh = false) => {
    // Wait for auth loading to complete
    if (authLoading) {
      return;
    }

    // Check if user is authenticated after loading is done
    if (!isAuthenticated || !user) {
      setLoading(false);
      setError('You must be logged in to view your orders.');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log('[MyOrders] Fetching orders...', { 
        userId: user?._id, 
        forceRefresh,
        fromOrderConfirmation: location.state?.fromOrderConfirmation 
      });
      
      // Add small delay if coming from order confirmation to ensure backend processing is complete
      if (location.state?.fromOrderConfirmation) {
        console.log('[MyOrders] Waiting for order processing to complete...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const response = await usersAPI.getUserOrders();
      console.log('[MyOrders] Orders received:', response.data);
      setOrders(response.data.orders || []);
      setLoading(false);
      
      // Clear the state after first load to prevent unnecessary delays on subsequent visits
      if (location.state?.fromOrderConfirmation) {
        window.history.replaceState({}, document.title);
      }
    } catch (err) {
      console.error('[MyOrders] Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, isAuthenticated, authLoading, location.pathname, location.state]); // Add location.state to dependencies

  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.orderItems.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.orderStatus?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-high':
          return b.totalPrice - a.totalPrice;
        case 'amount-low':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortBy]);
// Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR' 
    }).format(price);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'processing':
        return <FaBox className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  // Cancel order functions
  const handleCancelOrder = (order) => {
    console.log('handleCancelOrder called with order:', {
      orderId: order._id,
      orderStatus: order.orderStatus,
      canCancel: !['cancelled', 'delivered', 'returned'].includes(order.orderStatus)
    });
    
    // Additional safeguard - check if order can be cancelled
    if (['cancelled', 'delivered', 'returned'].includes(order.orderStatus)) {
      showNotification(`Order cannot be cancelled. Current status: ${order.orderStatus}`, 'error');
      return;
    }
    
    setOrderToCancel(order);
    setShowCancelModal(true);
    setCancelReason('');
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
    setCancelReason('');
    setCancelling(false);
  };

  const handleConfirmCancel = async () => {
    console.log('handleConfirmCancel called with:', { 
      cancelReason, 
      isEmpty: !cancelReason,
      trimmed: cancelReason?.trim(),
      length: cancelReason?.length 
    });
    
    if (!cancelReason || cancelReason.trim() === '') {
      showNotification('Please select a reason for cancellation', 'error');
      return;
    }

    // Check if user is logged in
    if (!user) {
      showNotification('You must be logged in to cancel orders', 'error');
      handleCloseCancelModal();
      return;
    }

    try {
      setCancelling(true);
      console.log('Attempting to cancel order:', {
        orderId: orderToCancel._id,
        reason: cancelReason,
        reasonLength: cancelReason?.length,
        user: user.name
      });
      
      const cancelData = {
        reason: cancelReason.trim()
      };
      
      console.log('Cancel data being sent:', cancelData);
      
      const response = await ordersAPI.cancelOrder(orderToCancel._id, cancelData);

      console.log('Cancel order response:', response);

      if (response && response.status === 'success') {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderToCancel._id 
              ? { ...order, orderStatus: 'cancelled', cancelReason: cancelReason }
              : order
          )
        );
        
        // Success notification
        showNotification('Order cancelled successfully!', 'success');
        handleCloseCancelModal();
        
        // State is already updated above, no need to reload
        
      } else {
        throw new Error(response?.message || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Cancel order error details:', error);
      
      let errorMessage = 'Failed to cancel order. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        console.log('Error status:', status);
        console.log('Error data:', data);
        
        if (status === 400) {
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map(e => e.msg || e.message).join(', ');
          } else if (data.message) {
            errorMessage = data.message;
          } else {
            errorMessage = 'Invalid request. Please check your input.';
          }
        } else if (status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (status === 403) {
          errorMessage = 'You are not authorized to cancel this order.';
        } else if (status === 404) {
          errorMessage = 'Order not found.';
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Download invoice function
  const handleDownloadInvoice = async (order) => {
    try {
      setDownloadingInvoice(order._id);
      
      const blob = await ordersAPI.downloadInvoice(order._id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.orderNumber || order._id.slice(-8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification('Invoice downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download invoice error:', error);
      showNotification('Failed to download invoice. Please try again.', 'error');
    } finally {
      setDownloadingInvoice(null);
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    return !['delivered', 'cancelled', 'returned'].includes(order.orderStatus);
  };

  // Handle delete order
  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  // Confirm delete order
  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      setDeleting(true);
      
      // Call API to delete order
      await ordersAPI.deleteOrder(orderToDelete._id);
      
      // Remove order from local state
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderToDelete._id));
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setOrderToDelete(null);
      
      showNotification('Order deleted successfully', 'success');
    } catch (error) {
      console.error('Delete order error:', error);
      
      let errorMessage = 'Failed to delete order. Please try again.';
      if (error.response) {
        const data = error.response.data;
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.error) {
          errorMessage = data.error;
        } else if (data && data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(e => e.msg || e.message).join(', ');
        }
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setDeleting(false);
    }
  };
  // Show loading spinner while auth is being verified or orders are loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F8F9FA 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">
            {authLoading ? 'Verifying authentication...' : 'Loading your orders...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error only after auth loading is complete and user is not authenticated
  if (!authLoading && (!isAuthenticated || error)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F8F9FA 100%)' }}>
        <div className="text-center max-w-md mx-auto p-8">
          <FaTimesCircle className="text-red-500 text-6xl mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Orders</h2>
          <p className="text-gray-600 mb-6">
            {!isAuthenticated ? 'You must be logged in to view your orders.' : error}
          </p>
          <div className="space-x-4">
            {!isAuthenticated ? (
              <Link 
                to="/login" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium inline-block"
              >
                Login
              </Link>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
            )}
            <Link 
              to="/" 
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium inline-block"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F8F9FA 100%)' }}>
      {/* Custom Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
      
      <div className="max-w-full mx-auto px-4 py-4">
        {/* Compact Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaShoppingBag className="text-orange-500 text-xl" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600 text-sm">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                </p>
              </div>
            </div>
          </div>

          {/* Horizontal Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-[300px] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by order number (e.g., SA-2025-000023) or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="min-w-[160px] relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white text-gray-900 cursor-pointer text-sm"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sort */}
              <div className="min-w-[160px] relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white text-gray-900 cursor-pointer text-sm"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>
              </div>

              {/* Quick Stats */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-center min-w-[120px]">
                <div className="text-lg font-bold text-orange-600">{filteredOrders.length}</div>
                <div className="text-xs text-orange-600">Total Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List - Horizontal Card Layout */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FaShoppingBag className="text-4xl text-gray-300 mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {orders.length === 0 ? 'No Orders Found' : 'No Matching Orders'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {orders.length === 0 
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : "Try adjusting your search or filter criteria to find your orders."
              }
            </p>
            {orders.length === 0 && (
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaShoppingBag />
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                {/* Horizontal Order Header */}
                <div className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    
                    {/* Order Info (2 columns) */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(order.orderStatus)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Items Preview (5 columns) */}
                    <div className="lg:col-span-5">
                      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap md:overflow-x-auto md:no-scrollbar">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm min-w-0">
                            {(item.image || item.images?.[0] || item.product?.image || item.product?.images?.[0] || item.galleryImages?.[0]) ? (
                              <img 
                                src={getImageUrl(item.image || item.images?.[0] || item.product?.image || item.product?.images?.[0] || item.galleryImages?.[0])}
                                alt={item.name} 
                                className="w-8 h-8 object-cover rounded flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = '/images/placeholder.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <span className="text-gray-700 truncate max-w-[150px]">{item.name}</span>
                            <span className="text-gray-500 flex-shrink-0">×{item.quantity}</span>
                          </div>
                        ))}
                        {/* No "+N more"; all items are visible. If too many, row scrolls horizontally on md+. */}
                      </div>
                    </div>

                    {/* Status (1 column) */}
                    <div className="lg:col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </div>

                    {/* Price & Actions (4 columns) */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                            <FaRupeeSign className="text-sm" />
                            {order.totalPrice?.toLocaleString('en-IN') || '0'}
                          </div>
                          {order.couponCode && (
                            <div className="text-xs text-green-600 font-medium">
                              Coupon: {order.couponCode}
                            </div>
                          )}
                          <p className="text-xs text-gray-500">{order.orderItems.length} items</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="flex items-center gap-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs whitespace-nowrap"
                          >
                            <FaEye className="text-xs" />
                            View
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={downloadingInvoice === order._id}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-xs whitespace-nowrap ${
                              downloadingInvoice === order._id
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                            }`}
                            title="Download invoice PDF"
                          >
                            <FaDownload className="text-xs" />
                            {downloadingInvoice === order._id ? 'Downloading...' : 'Invoice'}
                          </button>
                          
                          {/* Cancel Button - only for active orders (not delivered or cancelled) */}
                          {(order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered') && (
                            <button 
                              onClick={() => {
                                console.log('Cancel button clicked for order:', {
                                  orderId: order._id,
                                  orderStatus: order.orderStatus,
                                  canCancel: order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered'
                                });
                                handleCancelOrder(order);
                              }}
                              className="flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-xs whitespace-nowrap"
                              title="Cancel this order"
                            >
                              <FaTimes className="text-xs" />
                              Cancel
                            </button>
                          )}
                          
                          {/* Delete Button - only for delivered and cancelled orders */}
                          {(order.orderStatus === 'cancelled' || order.orderStatus === 'delivered') && (
                            <button 
                              onClick={() => handleDeleteOrder(order)}
                              className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs whitespace-nowrap"
                              title="Remove order from history"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v1a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v1a1 1 0 102 0V9z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showOrderModal}
          onClose={handleCloseModal}
        />
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && orderToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Cancel Order {orderToCancel.orderNumber ? `#${orderToCancel.orderNumber}` : `#${orderToCancel._id.slice(-8).toUpperCase()}`}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              
              <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-3">
                Why are you canceling this order? *
              </label>
              
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Changed my mind"
                    checked={cancelReason === "Changed my mind"}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Changed my mind</div>
                    <div className="text-sm text-gray-500">No longer need this product</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Found better price elsewhere"
                    checked={cancelReason === "Found better price elsewhere"}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Found better price</div>
                    <div className="text-sm text-gray-500">Available cheaper on another site</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Ordered by mistake"
                    checked={cancelReason === "Ordered by mistake"}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Ordered by mistake</div>
                    <div className="text-sm text-gray-500">Accidentally placed this order</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Delivery time too long"
                    checked={cancelReason === "Delivery time too long"}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Delivery taking too long</div>
                    <div className="text-sm text-gray-500">Need the product sooner</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Financial constraints"
                    checked={cancelReason === "Financial constraints"}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Financial reasons</div>
                    <div className="text-sm text-gray-500">Budget constraints</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="cancelReason"
                    value="Other reason"
                    checked={cancelReason === "Other reason"}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-1 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Other</div>
                    <div className="text-sm text-gray-500">Different reason</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseCancelModal}
                disabled={cancelling}
                className="px-6 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling || !cancelReason}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Order
            </h3>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to permanently delete this order from your history?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Warning</p>
                    <p className="text-sm text-yellow-700">This action cannot be undone. The order will be permanently removed from your order history.</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <p><strong>Order ID:</strong> #{orderToDelete.orderNumber || orderToDelete._id.slice(-8).toUpperCase()}</p>
                <p><strong>Status:</strong> {orderToDelete.orderStatus}</p>
                <p><strong>Total:</strong> ₹{orderToDelete.totalPrice?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrderToDelete(null);
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;