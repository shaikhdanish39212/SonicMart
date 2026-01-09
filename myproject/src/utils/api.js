const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Check if this is a login attempt (don't clear session for login failures)
      const isLoginAttempt = response.url.includes('/auth/login') ||
        response.url.includes('/auth/register');

      if (!isLoginAttempt) {
        // This is a session expiry on an authenticated endpoint
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Dispatch custom event for AuthContext to handle
        window.dispatchEvent(new CustomEvent('auth-logout', {
          detail: { reason: 'session-expired' }
        }));
      }
    }

    const errorData = await response.json().catch(() => ({
      message: `Error ${response.status}: ${response.statusText}`
    }));

    console.error('🔧 API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      errorData: errorData,
      url: response.url
    });

    // Create more detailed error message with validation details
    let errorMessage = errorData.message || `HTTP ${response.status}`;

    // If there are validation errors, include them
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const validationMessages = errorData.errors.map(err => err.msg || err.message).join(', ');
      errorMessage = `${errorMessage}: ${validationMessages}`;
    }

    // If there are validation details, include them
    if (errorData.details) {
      errorMessage = `${errorMessage} (${errorData.details})`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Main API function
const api = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: getAuthHeaders()
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return handleResponse(response);
};

// Products API
export const productsAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/products?${queryString}` : `${API_BASE_URL}/products`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get all deals
  getDeals: async () => {
    const response = await fetch(`${API_BASE_URL}/deals`);
    return handleResponse(response);
  },

  // Get single product by ID
  getProduct: async (id, bustCache = false) => {
    const url = bustCache
      ? `${API_BASE_URL}/products/${id}?_fresh=${Date.now()}`
      : `${API_BASE_URL}/products/${id}`;
    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders(),
        ...(bustCache && {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        })
      }
    });
    return handleResponse(response);
  },

  // Get single product by slug
  getProductBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await fetch(`${API_BASE_URL}/products/featured/list?limit=${limit}`);
    return handleResponse(response);
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    // add a cache-busting param to avoid stale 304 responses in some browsers/proxies
    const withNoCache = { ...params, _ts: Date.now() };
    const queryString = new URLSearchParams(withNoCache).toString();
    const url = `${API_BASE_URL}/products/category/${category}?${queryString}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get product categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    return handleResponse(response);
  },

  // Get internal component categories
  getInternalCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/products/internal-categories`);
    return handleResponse(response);
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const searchParams = new URLSearchParams({ search: query, ...params });
    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`);
    return handleResponse(response);
  },

  // Add product review
  addReview: async (productId, reviewData) => {
    console.log('🔧 API: Adding review for product:', productId);
    console.log('🔧 API: Review data being sent:', reviewData);
    console.log('🔧 API: Auth headers:', getAuthHeaders());

    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });

    console.log('🔧 API: Response status:', response.status);
    console.log('🔧 API: Response headers:', Object.fromEntries(response.headers));

    return handleResponse(response);
  }
};

// Comparison API endpoints
export const comparisonAPI = {
  // Get user's comparison list
  getComparison: async () => {
    const response = await fetch(`${API_BASE_URL}/comparison`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Add product to comparison
  addToComparison: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/comparison/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId })
    });
    return handleResponse(response);
  },

  // Remove product from comparison
  removeFromComparison: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/comparison/items/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Clear all comparison items
  clearComparison: async () => {
    const response = await fetch(`${API_BASE_URL}/comparison`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update comparison settings
  updateSettings: async (settings) => {
    const response = await fetch(`${API_BASE_URL}/comparison/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  }
};

// Auth API endpoints
export const authAPI = {
  login: (email, password) => api('/auth/login', 'POST', { email, password }),
  register: (userData) => api('/auth/register', 'POST', userData),
  logout: () => api('/auth/logout', 'POST'),
  forgotPassword: (email) => api('/auth/forgot-password', 'POST', { email }),
  resetPassword: (token, password) => api('/auth/reset-password', 'POST', { token, password }),
  getProfile: () => api('/auth/me', 'GET'),
  updateProfile: (data) => api('/auth/profile', 'PUT', data),
};

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    });
    return handleResponse(response);
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    });
    return handleResponse(response);
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId })
    });
    return handleResponse(response);
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Apply coupon to cart
  applyCoupon: async (couponCode) => {
    const response = await fetch(`${API_BASE_URL}/cart/coupon`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ couponCode })
    });
    return handleResponse(response);
  },

  // Remove coupon from cart
  removeCoupon: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/coupon`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Orders API
export const ordersAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  },

  // Get user's orders
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/orders?${queryString}` : `${API_BASE_URL}/orders`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get single order by ID
  getOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Cancel order
  cancelOrder: async (orderId, data) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Delete order
  deleteOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Download invoice
  downloadInvoice: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Error ${response.status}: ${response.statusText}`
      }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.blob(); // Return blob for PDF download
  }
};

// Users API
export const usersAPI = {
  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return handleResponse(response);
  },

  // Add address
  addAddress: async (addressData) => {
    const response = await fetch(`${API_BASE_URL}/users/address`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData)
    });
    return handleResponse(response);
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await fetch(`${API_BASE_URL}/users/address/${addressId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData)
    });
    return handleResponse(response);
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await fetch(`${API_BASE_URL}/users/address/${addressId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get user orders
  getUserOrders: async (params = {}) => {
    // Add cache-busting timestamp to ensure fresh data
    const timestamp = Date.now();
    const allParams = { ...params, _ts: timestamp };
    const queryString = new URLSearchParams(allParams).toString();
    const url = `${API_BASE_URL}/users/orders?${queryString}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/users/wishlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId })
    });
    return handleResponse(response);
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/users/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get user's wishlist
  getWishlist: async () => {
    const response = await fetch(`${API_BASE_URL}/users/wishlist`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Wishlist API (dedicated section for better organization)
export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: async () => {
    const response = await fetch(`${API_BASE_URL}/users/wishlist`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/users/wishlist/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/users/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Check if product is in wishlist
  isInWishlist: async (productId) => {
    try {
      const response = await wishlistAPI.getWishlist();
      const wishlistData = response.data?.wishlist || [];
      return wishlistData.some(item => item._id === productId || item.product?._id === productId);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }
};

// Payment API
export const paymentAPI = {
  // Create Razorpay order
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  },

  // Verify Razorpay payment
  verifyPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Refund payment
  refundPayment: async (refundData) => {
    const response = await fetch(`${API_BASE_URL}/payments/refund`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(refundData)
    });
    return handleResponse(response);
  }
};

// Footer API
export const footerAPI = {
  // Newsletter subscription
  subscribeNewsletter: async (email, source = 'footer', preferences = {}) => {
    const response = await fetch(`${API_BASE_URL}/footer/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, source, preferences })
    });
    return handleResponse(response);
  },

  // Newsletter unsubscription - TODO: Implement backend endpoint
  // unsubscribeNewsletter: async (email) => {
  //   const response = await fetch(`${API_BASE_URL}/footer/newsletter/unsubscribe`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ email })
  //   });
  //   return handleResponse(response);
  // },

  // Submit contact form
  submitContact: async (contactData) => {
    const response = await fetch(`${API_BASE_URL}/footer/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });
    return handleResponse(response);
  },

  // Get newsletter statistics (admin only)
  getNewsletterStats: async () => {
    const response = await fetch(`${API_BASE_URL}/footer/newsletter/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get contact statistics (admin only)
  getContactStats: async () => {
    const response = await fetch(`${API_BASE_URL}/footer/contact/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Returns API
export const returnsAPI = {
  // Submit return request
  submitReturn: async (returnData) => {
    const response = await fetch(`${API_BASE_URL}/returns/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(returnData)
    });
    return handleResponse(response);
  },

  // Check return status
  checkReturn: async (orderNumber, email) => {
    const response = await fetch(`${API_BASE_URL}/returns/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderNumber, email })
    });
    return handleResponse(response);
  },

  // Get all returns (admin only)
  getReturns: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/returns?${queryString}` : `${API_BASE_URL}/returns`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update return status (admin only)
  updateReturn: async (returnId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/returns/${returnId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }
};

// Coupons API
export const couponsAPI = {
  // Get available coupons
  getCoupons: async () => {
    const response = await fetch(`${API_BASE_URL}/users/coupons`);
    return handleResponse(response);
  },

  // Validate coupon code
  validateCoupon: async (code, orderAmount) => {
    const response = await fetch(`${API_BASE_URL}/users/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, orderAmount })
    });
    return handleResponse(response);
  }
};

// Combined API object for easier imports
export default {
  products: productsAPI,
  auth: authAPI,
  cart: cartAPI,
  orders: ordersAPI,
  users: usersAPI,
  wishlist: wishlistAPI,
  payment: paymentAPI,
  footer: footerAPI,
  returns: returnsAPI,
  coupons: couponsAPI
};
