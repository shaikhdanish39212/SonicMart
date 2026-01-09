import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useState } from 'react';
import { useAuth } from './AuthContext';
import { comparisonAPI } from '../utils/api';

// Action types
const COMPARISON_ACTIONS = {
  ADD_TO_COMPARISON: 'ADD_TO_COMPARISON',
  REMOVE_FROM_COMPARISON: 'REMOVE_FROM_COMPARISON',
  CLEAR_COMPARISON: 'CLEAR_COMPARISON',
  SET_COMPARISON: 'SET_COMPARISON',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  maxItems: 4
};

// Reducer function
const comparisonReducer = (state, action) => {
  switch (action.type) {
    case COMPARISON_ACTIONS.ADD_TO_COMPARISON:
      // Check if item already exists
      const exists = state.items.some(
        item => (item._id || item.id) === (action.payload._id || action.payload.id)
      );
      
      if (exists) {
        return {
          ...state,
          error: 'Product is already in comparison list'
        };
      }
      
      // Check max items limit
      if (state.items.length >= state.maxItems) {
        return {
          ...state,
          error: `You can only compare up to ${state.maxItems} products`
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
        error: null
      };
      
    case COMPARISON_ACTIONS.REMOVE_FROM_COMPARISON:
      return {
        ...state,
        items: state.items.filter(
          item => (item._id || item.id) !== action.payload
        ),
        error: null
      };
      
    case COMPARISON_ACTIONS.CLEAR_COMPARISON:
      return {
        ...state,
        items: [],
        error: null
      };
      
    case COMPARISON_ACTIONS.SET_COMPARISON:
      return {
        ...state,
        items: action.payload,
        error: null
      };
      
    case COMPARISON_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case COMPARISON_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
      
    case COMPARISON_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

// Create context
const ProductComparisonContext = createContext();

// Provider component
export const ProductComparisonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(comparisonReducer, initialState);
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  
  // Track current user to detect user changes
  const [currentUserId, setCurrentUserId] = useState(null);

  // Load comparison list from backend when user is authenticated
  const loadComparisonFromBackend = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    dispatch({ type: COMPARISON_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await comparisonAPI.getComparison();
      
      if (response && response.data && response.data.comparison) {
        const backendComparison = response.data.comparison;
        
        // Transform backend format to frontend format
        const transformedItems = backendComparison.items.map(item => ({
          // Use consistent ID field
          id: item.product._id || item.product.id,
          _id: item.product._id || item.product.id,
          // Spread all product properties
          ...item.product,
          // Add comparison-specific metadata
          addedAt: item.addedAt
        }));
        
        dispatch({ type: COMPARISON_ACTIONS.SET_COMPARISON, payload: transformedItems });
        
        // Also save to localStorage as backup
        const storageKey = `productComparison_${user._id || user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(transformedItems));
      }
    } catch (error) {
      console.error('Error loading comparison from backend:', error);
      
      // Fallback to localStorage if backend fails
      const storageKey = `productComparison_${user._id || user.id}`;
      const savedComparison = localStorage.getItem(storageKey);
      
      if (savedComparison) {
        try {
          const parsedComparison = JSON.parse(savedComparison);
          dispatch({ type: COMPARISON_ACTIONS.SET_COMPARISON, payload: parsedComparison });
        } catch (parseError) {
          console.error('Error parsing localStorage comparison:', parseError);
        }
      }
    } finally {
      dispatch({ type: COMPARISON_ACTIONS.SET_LOADING, payload: false });
    }
  }, [isAuthenticated, user]);

  // Load comparison when auth state changes or user changes
  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize
    
    const newUserId = user?._id || user?.id || 'guest';
    
    // If user changed, clear previous data and load new user's comparison
    if (newUserId !== currentUserId) {
      // Clear current state first
      dispatch({ type: COMPARISON_ACTIONS.CLEAR_COMPARISON });
      setCurrentUserId(newUserId);
      
      if (isAuthenticated && user) {
        // Load from backend for authenticated users
        loadComparisonFromBackend();
      } else {
        // Load from localStorage for guest users
        const storageKey = 'productComparison_guest';
        const savedComparison = localStorage.getItem(storageKey);
        
        if (savedComparison) {
          try {
            const parsedComparison = JSON.parse(savedComparison);
            dispatch({ type: COMPARISON_ACTIONS.SET_COMPARISON, payload: parsedComparison });
          } catch (error) {
            console.error('Error loading guest comparison from localStorage:', error);
          }
        }
      }
    }
  }, [authLoading, isAuthenticated, user, currentUserId, loadComparisonFromBackend]);

  // Clear comparison when user logs out
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      dispatch({ type: COMPARISON_ACTIONS.CLEAR_COMPARISON });
      localStorage.removeItem('productComparison_guest');
    }
  }, [authLoading, isAuthenticated]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated && currentUserId === 'guest') {
      const storageKey = 'productComparison_guest';
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated, currentUserId]);
  
  // Add product to comparison
  const addToComparison = async (product) => {
    if (!product) return;
    
    const productId = product._id || product.id;
    
    // Check if item already exists
    const exists = state.items.some(item => (item._id || item.id) === productId);
    if (exists) {
      dispatch({ type: COMPARISON_ACTIONS.SET_ERROR, payload: 'Product is already in comparison list' });
      setTimeout(() => dispatch({ type: COMPARISON_ACTIONS.CLEAR_ERROR }), 3000);
      return;
    }
    
    // Check max items limit
    if (state.items.length >= state.maxItems) {
      dispatch({ type: COMPARISON_ACTIONS.SET_ERROR, payload: `You can only compare up to ${state.maxItems} products` });
      setTimeout(() => dispatch({ type: COMPARISON_ACTIONS.CLEAR_ERROR }), 3000);
      return;
    }
    
    try {
      if (isAuthenticated && user) {
        // Add to backend for authenticated users
        dispatch({ type: COMPARISON_ACTIONS.SET_LOADING, payload: true });
        
        const response = await comparisonAPI.addToComparison(productId);
        
        if (response && response.data && response.data.comparison) {
          const backendComparison = response.data.comparison;
          const transformedItems = backendComparison.items.map(item => ({
            id: item.product._id || item.product.id,
            _id: item.product._id || item.product.id,
            ...item.product,
            addedAt: item.addedAt
          }));
          
          dispatch({ type: COMPARISON_ACTIONS.SET_COMPARISON, payload: transformedItems });
          
          // Update localStorage backup
          const storageKey = `productComparison_${user._id || user.id}`;
          localStorage.setItem(storageKey, JSON.stringify(transformedItems));
        }
      } else {
        // Add to local state for guest users
        dispatch({
          type: COMPARISON_ACTIONS.ADD_TO_COMPARISON,
          payload: { ...product, id: productId, _id: productId }
        });
      }
    } catch (error) {
      console.error('Error adding to comparison:', error);
      dispatch({ type: COMPARISON_ACTIONS.SET_ERROR, payload: 'Failed to add product to comparison' });
      setTimeout(() => dispatch({ type: COMPARISON_ACTIONS.CLEAR_ERROR }), 3000);
    } finally {
      dispatch({ type: COMPARISON_ACTIONS.SET_LOADING, payload: false });
    }
  };
  
  // Remove product from comparison
  const removeFromComparison = async (productId) => {
    if (!productId) return;
    
    try {
      if (isAuthenticated && user) {
        // Remove from backend for authenticated users
        dispatch({ type: COMPARISON_ACTIONS.SET_LOADING, payload: true });
        
        const response = await comparisonAPI.removeFromComparison(productId);
        
        if (response && response.data && response.data.comparison) {
          const backendComparison = response.data.comparison;
          const transformedItems = backendComparison.items.map(item => ({
            id: item.product._id || item.product.id,
            _id: item.product._id || item.product.id,
            ...item.product,
            addedAt: item.addedAt
          }));
          
          dispatch({ type: COMPARISON_ACTIONS.SET_COMPARISON, payload: transformedItems });
          
          // Update localStorage backup
          const storageKey = `productComparison_${user._id || user.id}`;
          localStorage.setItem(storageKey, JSON.stringify(transformedItems));
        }
      } else {
        // Remove from local state for guest users
        dispatch({
          type: COMPARISON_ACTIONS.REMOVE_FROM_COMPARISON,
          payload: productId
        });
      }
    } catch (error) {
      console.error('Error removing from comparison:', error);
      dispatch({ type: COMPARISON_ACTIONS.SET_ERROR, payload: 'Failed to remove product from comparison' });
      setTimeout(() => dispatch({ type: COMPARISON_ACTIONS.CLEAR_ERROR }), 3000);
    } finally {
      dispatch({ type: COMPARISON_ACTIONS.SET_LOADING, payload: false });
    }
  };
  
  // Clear all comparison items
  const clearComparison = async () => {
    try {
      if (isAuthenticated && user) {
        // Clear backend for authenticated users
        dispatch({ type: COMPARISON_ACTIONS.SET_LOADING, payload: true });
        
        await comparisonAPI.clearComparison();
        
        // Update localStorage backup
        const storageKey = `productComparison_${user._id || user.id}`;
        localStorage.removeItem(storageKey);
      } else {
        // Clear localStorage for guest users
        localStorage.removeItem('productComparison_guest');
      }
      
      dispatch({ type: COMPARISON_ACTIONS.CLEAR_COMPARISON });
    } catch (error) {
      console.error('Error clearing comparison:', error);
      dispatch({ type: COMPARISON_ACTIONS.SET_ERROR, payload: 'Failed to clear comparison' });
      setTimeout(() => dispatch({ type: COMPARISON_ACTIONS.CLEAR_ERROR }), 3000);
    } finally {
      dispatch({ type: COMPARISON_ACTIONS.SET_LOADING, payload: false });
    }
  };
  
  // Check if product is in comparison
  const isInComparison = (productId) => {
    if (!productId) return false;
    return state.items.some(
      item => (item._id || item.id) === productId
    );
  };
  
  // Get comparison count
  const getComparisonCount = () => {
    return state.items.length;
  };
  
  // Get products for comparison
  const getComparisonProducts = () => {
    return state.items;
  };
  
  // Get products by category for comparison
  const getComparisonByCategory = () => {
    const grouped = {};
    state.items.forEach(item => {
      const category = item.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  };
  
  // Check if can add more products
  const canAddMore = () => {
    return state.items.length < state.maxItems;
  };
  
  // Get remaining slots
  const getRemainingSlots = () => {
    return state.maxItems - state.items.length;
  };
  
  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    // State
    comparisonList: state.items,
    loading: state.loading,
    comparisonError: state.error,
    comparisonItemCount: state.items.length,
    maxComparisonItems: state.maxItems,
    
    // Actions
    addToComparison,
    removeFromComparison,
    clearComparison,
    
    // Helpers
    isInComparison,
    getComparisonCount: () => state.items.length,
    getComparisonProducts: () => state.items,
    getComparisonByCategory: () => {
      const grouped = {};
      state.items.forEach(item => {
        const category = item.category || 'Other';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(item);
      });
      return grouped;
    },
    canAddMore: () => state.items.length < state.maxItems,
    getRemainingSlots: () => state.maxItems - state.items.length
  }), [
    state.items,
    state.loading,
    state.error,
    state.maxItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison
  ]);
  
  return (
    <ProductComparisonContext.Provider value={value}>
      {children}
    </ProductComparisonContext.Provider>
  );
};

// Custom hook to use comparison context
export const useProductComparison = () => {
  const context = useContext(ProductComparisonContext);
  if (!context) {
    throw new Error('useProductComparison must be used within a ProductComparisonProvider');
  }
  return context;
};

export default ProductComparisonContext;