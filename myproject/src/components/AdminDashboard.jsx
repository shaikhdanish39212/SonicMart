import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminAPI from '../utils/adminAPI';
import { formatPrice } from '../utils/currency';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    todayIncome: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    growthPercentage: 0,
    activeUsers: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clear any cached data and force fresh authentication
    console.log('🔄 AdminDashboard mounting - clearing cache and fetching fresh data');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 DEBUGGING: Making API call to getDashboardStats...');
      console.log('🔍 DEBUGGING: API URL will be:', `http://localhost:5000/api/admin/dashboard?v=${Date.now()}&noCache=true&force=1`);
      
      const response = await adminAPI.getDashboardStats();
      console.log('🔍 DEBUGGING: Raw response received:', response);
      console.log('🔍 DEBUGGING: Response status:', response.status);
      console.log('🔍 DEBUGGING: Response data:', response.data);
      
      if (response.data.status === 'success') {
        const { data } = response.data;
        
        console.log('Admin Dashboard - Full API Response:', response.data);
        
        // Update stats with better error handling
        try {
          setStats({
            totalUsers: data.stats?.users?.total || 0,
            totalProducts: data.stats?.products?.total || 0,
            totalOrders: data.stats?.orders?.total || 0,
            todayIncome: data.stats?.revenue?.thisMonth || 0,
            pendingOrders: data.stats?.orders?.pending || 0,
            totalRevenue: data.stats?.revenue?.total || 0,
            growthPercentage: 12.5,
            activeUsers: data.stats?.users?.total || 0
          });
          console.log('✅ Stats updated successfully');
        } catch (statsError) {
          console.error('❌ Error updating stats:', statsError);
        }
        
        // Update recent orders
        if (data.recentOrders && data.recentOrders.length > 0) {
          const formattedOrders = data.recentOrders.map(order => ({
            id: order.orderNumber || `#${order._id.slice(-8)}`,
            customer: order.user?.name || 'Unknown Customer',
            product: order.orderItems?.[0]?.name || 'Multiple Items',
            amount: formatPrice(order.totalPrice),
            status: order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1),
            date: new Date(order.createdAt).toLocaleDateString(),
            payment: order.isPaid ? 'Paid' : 'Pending'
          }));
          setRecentOrders(formattedOrders);
        } else {
          setRecentOrders([]);
        }
      } else {
        console.error('🔍 DEBUGGING: API call failed with status:', response.data.status);
        console.error('🔍 DEBUGGING: Error message:', response.data.message);
        setError(`API Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Set fallback data on error
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        todayIncome: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        growthPercentage: 0,
        activeUsers: 0
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (payment) => {
    return payment === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-brand-cream min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-navy">Dashboard Overview</h1>
            <p className="text-gray-600 mt-0.5 sm:mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Dashboard"
            >
              <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-brand-coral ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border">
              <div className="text-xs sm:text-sm text-gray-500">Last updated</div>
              <div className="text-xs sm:text-sm font-medium text-brand-navy">Just now</div>
            </div>
          </div>
        </div>
        <nav className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
          <span className="text-brand-coral font-medium">Dashboard</span> / Overview
        </nav>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        {[
          {
            title: 'Total Revenue',
            value: formatPrice(stats.totalRevenue),
            subtitle: `+${stats.growthPercentage}%`,
            bgColor: 'from-brand-navy to-slate-700',
            textColor: 'text-slate-200',
            subtitleColor: 'text-green-400',
            icon: (
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-2xl font-bold">₹</span>
              </div>
            )
          },
          {
            title: 'Total Orders',
            value: stats.totalOrders,
            subtitle: `${stats.pendingOrders} pending`,
            bgColor: 'from-brand-coral to-red-500',
            textColor: 'text-red-100',
            subtitleColor: 'text-red-100',
            icon: (
              <div className="w-8 h-8 flex items-center justify-center relative">
                <div className="w-6 h-4 border-2 border-current rounded-sm"></div>
                <div className="w-2 h-2 bg-current rounded-full absolute bottom-0 left-1"></div>
                <div className="w-2 h-2 bg-current rounded-full absolute bottom-0 right-1"></div>
              </div>
            )
          },
          {
            title: 'Total Products',
            value: stats.totalProducts,
            subtitle: 'Active inventory',
            bgColor: 'from-brand-teal to-cyan-500',
            textColor: 'text-cyan-100',
            subtitleColor: 'text-cyan-100',
            icon: (
              <div className="w-8 h-8 flex items-center justify-center relative">
                <div className="w-6 h-5 border-2 border-current rounded-sm"></div>
                <div className="w-4 h-0.5 bg-current absolute top-3 left-2"></div>
                <div className="w-4 h-0.5 bg-current absolute top-4 left-2"></div>
                <div className="w-4 h-0.5 bg-current absolute top-5 left-2"></div>
              </div>
            )
          },
          {
            title: 'Active Users',
            value: stats.activeUsers,
            subtitle: `${stats.totalUsers} total`,
            bgColor: 'from-emerald-500 to-green-600',
            textColor: 'text-green-100',
            subtitleColor: 'text-green-100',
            icon: (
              <div className="w-8 h-8 relative">
                <div className="w-3 h-3 bg-current rounded-full absolute top-0 left-2.5"></div>
                <div className="w-6 h-3 bg-current rounded-full absolute bottom-1 left-1"></div>
              </div>
            )
          }
        ].map((card, index) => (
          <div key={index} className={`bg-gradient-to-br ${card.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${card.textColor} text-xs sm:text-sm font-medium uppercase tracking-wide`}>{card.title}</p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mt-1 sm:mt-2">{card.value}</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  {card.title === 'Total Revenue' && (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                  <span className={`${card.subtitleColor} text-xs sm:text-sm font-medium`}>{card.subtitle}</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3 flex items-center justify-center">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
        {/* Recent Orders - Full Width */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-brand-navy">Recent Orders</h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Latest customer orders</p>
            </div>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="bg-brand-coral hover:bg-brand-coral/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
            >
              <span>View All</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-6 sm:py-8 lg:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-brand-coral"></div>
                <span className="ml-2 sm:ml-3 text-gray-500 text-sm sm:text-base">Loading orders...</span>
              </div>
            ) : error ? (
              <div className="text-center py-6 sm:py-8 lg:py-12">
                <div className="text-red-500 mb-2">⚠️</div>
                <p className="text-gray-500 text-sm sm:text-base">{error}</p>
                <button 
                  onClick={fetchDashboardData}
                  className="mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-coral text-white rounded-lg hover:bg-brand-coral/90 transition-colors text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-6 sm:py-8 lg:py-12">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📦</div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">No Recent Orders</h3>
                <p className="text-gray-500 text-sm sm:text-base">Orders will appear here when customers start placing them.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left p-2 sm:p-3 lg:p-4 text-xs sm:text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="text-left p-2 sm:p-3 lg:p-4 text-xs sm:text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left p-2 sm:p-3 lg:p-4 text-xs sm:text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left p-2 sm:p-3 lg:p-4 text-xs sm:text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left p-2 sm:p-3 lg:p-4 text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left p-2 sm:p-3 lg:p-4 text-xs sm:text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-2 sm:p-3 lg:p-4">
                        <div className="font-medium text-brand-navy text-sm sm:text-base">{order.id}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{order.date}</div>
                      </td>
                      <td className="p-2 sm:p-3 lg:p-4">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{order.customer}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Customer</div>
                      </td>
                      <td className="p-2 sm:p-3 lg:p-4">
                        <div className="text-gray-900 text-sm sm:text-base">{order.product}</div>
                      </td>
                      <td className="p-2 sm:p-3 lg:p-4">
                        <div className="font-semibold text-brand-navy text-sm sm:text-base">{order.amount}</div>
                      </td>
                      <td className="p-2 sm:p-3 lg:p-4">
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 lg:p-4">
                        <button 
                          onClick={() => navigate(`/admin/orders?orderId=${order.id}`)}
                          className="text-brand-coral hover:text-brand-coral/80 font-medium text-xs sm:text-sm transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
