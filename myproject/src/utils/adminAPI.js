import axios from 'axios';

const API_URL = ((import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')) + '/admin';

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(error);
  }
);

const adminAPI = {
  // Product Management
  getProducts: (params) => axios.get(`${API_URL}/products`, { params }),
  getProductById: (id) => axios.get(`${API_URL}/products/${id}`),
  createProduct: (productData) => axios.post(`${API_URL}/products`, productData),
  updateProduct: (id, productData) => axios.put(`${API_URL}/products/${id}`, productData),
  deleteProduct: (id) => axios.delete(`${API_URL}/products/${id}`),
  restoreProduct: (id) => axios.patch(`${API_URL}/products/${id}/restore`),

  // User Management
  getUsers: (params) => axios.get(`${API_URL}/users`, { params }),
  getUserById: (id) => axios.get(`${API_URL}/users/${id}`),
  createUser: (userData) => axios.post(`${API_URL}/users`, userData),
  updateUser: (id, userData) => axios.put(`${API_URL}/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`${API_URL}/users/${id}`),

  // Order Management
  getOrders: (params) => axios.get(`${API_URL}/orders`, params),
  updateOrder: (id, orderData) => axios.put(`${API_URL}/orders/${id}`, orderData),

  // Deal Management
  getDeals: () => axios.get(`${API_URL}/deals`),
  createDeal: (dealData) => axios.post(`${API_URL}/deals`, dealData),
  updateDeal: (id, dealData) => axios.put(`${API_URL}/deals/${id}`, dealData),
  deleteDeal: (id) => axios.delete(`${API_URL}/deals/${id}`),

  // Coupon Management
  getCoupons: (params) => axios.get(`${API_URL}/coupons`, { params }),
  createCoupon: (couponData) => axios.post(`${API_URL}/coupons`, couponData),
  updateCoupon: (id, couponData) => axios.put(`${API_URL}/coupons/${id}`, couponData),
  deleteCoupon: (id) => axios.delete(`${API_URL}/coupons/${id}`),

  // Contact Management
  getContacts: (params) => axios.get(`${API_URL}/contacts`, { params }),
  getContactById: (id) => axios.get(`${API_URL}/contacts/${id}`),
  updateContact: (id, contactData) => axios.put(`${API_URL}/contacts/${id}`, contactData),
  deleteContact: (id) => axios.delete(`${API_URL}/contacts/${id}`),

  // Dashboard Stats
  getDashboardStats: () => axios.get(`${API_URL}/dashboard?v=${Date.now()}&noCache=true&force=1`),

  // Authentication
  auth: {
    getCurrentUser: async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`);
        return {
          success: true,
          data: response.data.data.user
        };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || error.message
        };
      }
    }
  },

  // Role Management
  roles: {
    getByName: async (roleName) => {
      try {
        // For now, return mock permissions based on role
        // This should be replaced with actual API call when role management is implemented
        const rolePermissions = {
          admin: {
            permissions: [
              'users.view', 'users.create', 'users.edit', 'users.delete',
              'products.view', 'products.create', 'products.edit', 'products.delete',
              'orders.view', 'orders.edit', 'orders.delete',
              'analytics.view', 'system.settings'
            ]
          },
          moderator: {
            permissions: [
              'users.view', 'products.view', 'products.edit',
              'orders.view', 'orders.edit'
            ]
          },
          user: {
            permissions: []
          }
        };

        return {
          success: true,
          data: rolePermissions[roleName] || { permissions: [] }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  }
};

export default adminAPI;
