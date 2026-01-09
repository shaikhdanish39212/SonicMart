import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { wishlistAPI } from '../utils/api';
import AuthNotification from '../components/AuthNotification';

// Wishlist Context
export const WishlistContext = createContext();

// Custom hook for using wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Wishlist Actions
const WISHLIST_ACTIONS = {
  SET_WISHLIST: 'SET_WISHLIST',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Wishlist Reducer
const wishlistReducer = (state, action) => {
  const removeDuplicates = (products) => {
    if (!Array.isArray(products)) {
      return [];
    }
    const uniqueProducts = [];
    const productIds = new Set();
    products.forEach(product => {
      // Ensure product is not null and has an id
      if (product && (product._id || product.id)) {
        const productId = product._id || product.id;
        if (!productIds.has(productId)) {
          productIds.add(productId);
          uniqueProducts.push(product);
        }
      }
    });
    return uniqueProducts;
  };

  switch (action.type) {
    case WISHLIST_ACTIONS.SET_WISHLIST:
      const wishlistPayload = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        wishlist: removeDuplicates(wishlistPayload),
        loading: false,
        error: null,
      };
    case WISHLIST_ACTIONS.ADD_ITEM:
      const addItemPayload = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        wishlist: removeDuplicates(addItemPayload),
        loading: false,
        error: null,
      };
    case WISHLIST_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        wishlist: (state.wishlist || []).filter(item => 
          (item._id || item.product?._id || item.id) !== action.payload
        ),
        loading: false,
        error: null
      };
    case WISHLIST_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case WISHLIST_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case WISHLIST_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Initial State
const initialState = {
  wishlist: [],
  loading: false,
  error: null
};

// Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);
  const [authNotification, setAuthNotification] = useState(null);
  
  // Track current user to detect user changes
  const [currentUserId, setCurrentUserId] = useState(null);

  // Load wishlist when user is authenticated or user changes
  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize

    if (isAuthenticated && user) {
      const newUserId = user._id || user.id;
      
      // If user changed, clear previous data and load new user's wishlist
      if (newUserId !== currentUserId) {
        dispatch({ type: WISHLIST_ACTIONS.SET_WISHLIST, payload: [] });
        setCurrentUserId(newUserId);
        loadWishlist();
      }
    } else if (isAuthenticated === false) {
      // Only clear wishlist when explicitly not authenticated (not during initial load)
      dispatch({ type: WISHLIST_ACTIONS.SET_WISHLIST, payload: [] });
      setCurrentUserId(null);
    }
    // Don't do anything if isAuthenticated is null/undefined (still loading)
  }, [authLoading, isAuthenticated, user?.id, currentUserId]);

  // Load wishlist function
  const loadWishlist = async () => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });
      const response = await wishlistAPI.getWishlist();
      
      // Ensure wishlist is always an array by accessing the nested data
      let wishlistData = response.data?.wishlist || [];
      if (!Array.isArray(wishlistData)) {
        console.warn('Wishlist data is still not an array after attempting to access nested data:', wishlistData);
        wishlistData = [];
      }
      
      dispatch({ type: WISHLIST_ACTIONS.SET_WISHLIST, payload: wishlistData });
    } catch (error) {
      dispatch({ type: WISHLIST_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Add to wishlist function
  const addToWishlist = async (productId) => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Please log in to add items to your wishlist';
        setAuthNotification(message);
        throw new Error(message);
      }
      
      const response = await wishlistAPI.addToWishlist(productId);
      
      // Use the response data directly if available, otherwise reload
      if (response.data?.wishlist) {
        dispatch({ type: WISHLIST_ACTIONS.SET_WISHLIST, payload: response.data.wishlist });
      } else {
        // Fallback to reload if response doesn't contain updated wishlist
        await loadWishlist();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      
      // Handle authentication errors
      if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('log in')) {
        setAuthNotification('Please log in to add items to your wishlist');
      }
      
      dispatch({ type: WISHLIST_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Remove from wishlist function
  const removeFromWishlist = async (productId) => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        const message = 'Please log in to manage your wishlist';
        setAuthNotification(message);
        throw new Error(message);
      }
      
      const response = await wishlistAPI.removeFromWishlist(productId);
      
      // Use the response data directly if available, otherwise use local removal
      if (response.data?.wishlist) {
        dispatch({ type: WISHLIST_ACTIONS.SET_WISHLIST, payload: response.data.wishlist });
      } else {
        // Fallback to local removal if response doesn't contain updated wishlist
        dispatch({ type: WISHLIST_ACTIONS.REMOVE_ITEM, payload: productId });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      
      // Handle authentication errors
      if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('log in')) {
        setAuthNotification('Please log in to manage your wishlist');
      }
      
      dispatch({ type: WISHLIST_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update the isInWishlist function
  const isInWishlist = (productId) => {
    // Add debugging to catch the error
    console.log('Checking wishlist for productId:', productId, 'Current wishlist:', state.wishlist);
    
    // Ensure wishlist is an array before calling some()
    if (!Array.isArray(state.wishlist)) {
      console.error('state.wishlist is not an array:', state.wishlist);
      return false;
    }

    // Handle empty wishlist
    if (state.wishlist.length === 0) {
      return false;
    }

    // Check if productId is valid
    if (!productId) {
      console.warn('isInWishlist called with invalid productId:', productId);
      return false;
    }

    // Convert productId to string for comparison
    const targetId = String(productId);
    
    const isFound = state.wishlist.some(item => {
      if (!item) return false;
      
      // Handle different possible structures
      const itemId = item._id || item.id || item.product?._id || item.product?.id;
      
      if (!itemId) {
        console.warn('Wishlist item missing ID:', item);
        return false;
      }
      
      return String(itemId) === targetId;
    });

    console.log(`Product ${targetId} ${isFound ? 'found' : 'not found'} in wishlist`);
    return isFound;
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loadWishlist,
    clearError
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
      {authNotification && (
        <AuthNotification 
          message={authNotification} 
          onClose={() => setAuthNotification(null)} 
        />
      )}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;