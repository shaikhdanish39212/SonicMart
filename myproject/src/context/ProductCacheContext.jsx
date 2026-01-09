import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { productsAPI } from '../utils/api';

// Create Product Cache Context
const ProductCacheContext = createContext();

// Cache Actions
const CACHE_ACTIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_DEALS: 'SET_DEALS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_CATEGORY_PRODUCTS: 'SET_CATEGORY_PRODUCTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_CACHE: 'CLEAR_CACHE',
  UPDATE_TIMESTAMP: 'UPDATE_TIMESTAMP',
  UPDATE_PRODUCT_STATS: 'UPDATE_PRODUCT_STATS'
};

// Initial state
const initialState = {
  products: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null,
    totalCount: 0
  },
  deals: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null
  },
  categories: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null
  },
  categoryProducts: {}, // Object with categoryId as key
  searchResults: {} // Object with search query as key
};

// Cache TTL (Time To Live) in milliseconds
const CACHE_TTL = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  DEALS: 2 * 60 * 1000,    // 2 minutes
  CATEGORIES: 10 * 60 * 1000, // 10 minutes
  CATEGORY_PRODUCTS: 3 * 60 * 1000 // 3 minutes
};

// Reducer
const cacheReducer = (state, action) => {
  switch (action.type) {
    case CACHE_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: {
          data: action.payload.data || [],
          loading: false,
          error: null,
          lastFetched: Date.now(),
          totalCount: action.payload.totalCount || action.payload.data?.length || 0
        }
      };
      
    case CACHE_ACTIONS.SET_DEALS:
      return {
        ...state,
        deals: {
          data: action.payload || [],
          loading: false,
          error: null,
          lastFetched: Date.now()
        }
      };
      
    case CACHE_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: {
          data: action.payload || [],
          loading: false,
          error: null,
          lastFetched: Date.now()
        }
      };
      
    case CACHE_ACTIONS.SET_CATEGORY_PRODUCTS:
      return {
        ...state,
        categoryProducts: {
          ...state.categoryProducts,
          [action.payload.categoryId]: {
            data: action.payload.data || [],
            loading: false,
            error: null,
            lastFetched: Date.now(),
            pagination: action.payload.pagination
          }
        }
      };
      
    case CACHE_ACTIONS.SET_LOADING:
      const { dataType, loading } = action.payload;
      return {
        ...state,
        [dataType]: {
          ...state[dataType],
          loading
        }
      };
      
    case CACHE_ACTIONS.SET_ERROR:
      const { dataType: errorType, error } = action.payload;
      return {
        ...state,
        [errorType]: {
          ...state[errorType],
          loading: false,
          error
        }
      };
      
    case CACHE_ACTIONS.CLEAR_CACHE:
      return initialState;
    
    case CACHE_ACTIONS.UPDATE_PRODUCT_STATS: {
      const { productId, averageRating, totalReviews } = action.payload;
      // Helper to patch an array of products
      const patchArray = (arr = []) => arr.map(p => {
        const id = p._id || p.id;
        if (id && String(id) === String(productId)) {
          return { ...p, averageRating, totalReviews };
        }
        return p;
      });

      // Patch top-level products
      const patchedProducts = {
        ...state.products,
        data: patchArray(state.products.data)
      };

      // Patch each category cache bucket
      const patchedCategoryProducts = Object.entries(state.categoryProducts).reduce((acc, [key, bucket]) => {
        acc[key] = {
          ...bucket,
          data: patchArray(bucket.data)
        };
        return acc;
      }, {});

      return {
        ...state,
        products: patchedProducts,
        categoryProducts: patchedCategoryProducts
      };
    }
      
    default:
      return state;
  }
};

// Helper function to check if cache is valid
const isCacheValid = (lastFetched, ttl) => {
  if (!lastFetched) return false;
  return (Date.now() - lastFetched) < ttl;
};

// Product Cache Provider
export const ProductCacheProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cacheReducer, initialState);

  // Hydrate from sessionStorage on provider mount (in case user navigates after review)
  React.useEffect(() => {
    try {
      const key = 'updatedProductStats';
      const data = JSON.parse(sessionStorage.getItem(key) || '{}');
      Object.entries(data).forEach(([productId, stats]) => {
        if (stats && typeof stats.averageRating === 'number') {
          dispatch({
            type: CACHE_ACTIONS.UPDATE_PRODUCT_STATS,
            payload: { productId, averageRating: stats.averageRating, totalReviews: stats.totalReviews }
          });
        }
      });
    } catch {}
  }, []);

  // Listen for live rating updates and patch caches
  React.useEffect(() => {
    const handler = (e) => {
      const { productId, averageRating, totalReviews } = e.detail || {};
      if (!productId) return;
      dispatch({
        type: CACHE_ACTIONS.UPDATE_PRODUCT_STATS,
        payload: { productId, averageRating, totalReviews }
      });
    };
    window.addEventListener('product-rating-updated', handler);
    return () => window.removeEventListener('product-rating-updated', handler);
  }, []);

  // Get all products with caching
  const getProducts = useCallback(async (forceRefresh = false) => {
    // Check if we have valid cached data
    if (!forceRefresh && isCacheValid(state.products.lastFetched, CACHE_TTL.PRODUCTS) && state.products.data.length > 0) {
      return {
        data: state.products.data,
        totalCount: state.products.totalCount,
        fromCache: true
      };
    }

    dispatch({ type: CACHE_ACTIONS.SET_LOADING, payload: { dataType: 'products', loading: true } });

    try {
      // Get all products in one call - the API already returns all products
      const response = await productsAPI.getProducts();
      const allProducts = response.data?.products || response.data || [];
      const totalProducts = response.data?.pagination?.totalProducts || allProducts.length;

      dispatch({
        type: CACHE_ACTIONS.SET_PRODUCTS,
        payload: { data: allProducts, totalCount: totalProducts }
      });

      return {
        data: allProducts,
        totalCount: totalProducts,
        fromCache: false
      };
    } catch (error) {
      dispatch({
        type: CACHE_ACTIONS.SET_ERROR,
        payload: { dataType: 'products', error: error.message }
      });
      throw error;
    }
  }, [state.products.lastFetched, state.products.data]);

  // Get deals with caching
  const getDeals = useCallback(async (forceRefresh = false) => {
    // Check if we have valid cached data
    if (!forceRefresh && isCacheValid(state.deals.lastFetched, CACHE_TTL.DEALS) && state.deals.data.length > 0) {
      return {
        data: state.deals.data,
        fromCache: true
      };
    }

    dispatch({ type: CACHE_ACTIONS.SET_LOADING, payload: { dataType: 'deals', loading: true } });

    try {
      const response = await productsAPI.getDeals();
      const deals = response.data || [];

      dispatch({
        type: CACHE_ACTIONS.SET_DEALS,
        payload: deals
      });

      return {
        data: deals,
        fromCache: false
      };
    } catch (error) {
      dispatch({
        type: CACHE_ACTIONS.SET_ERROR,
        payload: { dataType: 'deals', error: error.message }
      });
      throw error;
    }
  }, [state.deals.lastFetched, state.deals.data]);

  // Get products with deals applied
  const getProductsWithDeals = useCallback(async (forceRefresh = false) => {
    try {
      // Get both products and deals
      const [productsResult, dealsResult] = await Promise.all([
        getProducts(forceRefresh),
        getDeals(forceRefresh)
      ]);

      const products = productsResult.data || [];
      const deals = dealsResult.data || [];

      // Create a map of product IDs to deals for quick lookup
      const dealMap = new Map();
      deals.forEach(dealProduct => {
        dealMap.set(dealProduct._id, {
          originalPrice: dealProduct.originalPrice,
          discountedPrice: dealProduct.price,
          discountPercentage: dealProduct.discount,
          discountAmount: dealProduct.discountAmount,
          dealInfo: dealProduct.dealInfo
        });
      });

      // Merge deals into products
      const productsWithDeals = products.map(product => {
        const deal = dealMap.get(product._id);
        if (deal) {
          return {
            ...product,
            originalPrice: deal.originalPrice,
            price: deal.discountedPrice,
            discountedPrice: deal.discountedPrice,
            discountPercentage: deal.discountPercentage,
            discountAmount: deal.discountAmount,
            discount: deal.discountPercentage,
            hasActiveDeal: true,
            dealInfo: deal.dealInfo
          };
        }
        return {
          ...product,
          hasActiveDeal: false
        };
      });

      return {
        data: productsWithDeals,
        fromCache: productsResult.fromCache && dealsResult.fromCache
      };

    } catch (error) {
      console.error('Error getting products with deals:', error);
      // Fallback to just products if deals fail
      return await getProducts(forceRefresh);
    }
  }, [getProducts, getDeals]);

  // Get category products with caching
  const getCategoryProducts = useCallback(async (categoryId, params = {}, forceRefresh = false) => {
    const cacheKey = categoryId;
    const cachedData = state.categoryProducts[cacheKey];
    
    // Check if we have valid cached data
    if (!forceRefresh && cachedData && isCacheValid(cachedData.lastFetched, CACHE_TTL.CATEGORY_PRODUCTS)) {
      return {
        data: cachedData.data,
        pagination: cachedData.pagination,
        fromCache: true
      };
    }

    try {
      const response = await productsAPI.getProductsByCategory(categoryId, params);
      const products = response.data?.products || response.data || [];
      const pagination = response.data?.pagination || response.data || {};

      dispatch({
        type: CACHE_ACTIONS.SET_CATEGORY_PRODUCTS,
        payload: {
          categoryId: cacheKey,
          data: products,
          pagination
        }
      });

      return {
        data: products,
        pagination,
        fromCache: false
      };
    } catch (error) {
      throw error;
    }
  }, [state.categoryProducts]);

  // Get category products with deals applied
  const getCategoryProductsWithDeals = useCallback(async (categoryId, params = {}, forceRefresh = false) => {
    try {
      console.log(`🔄 getCategoryProductsWithDeals called for category: ${categoryId}`);
      
      // Get both category products and deals
      const [categoryResult, dealsResult] = await Promise.all([
        getCategoryProducts(categoryId, params, forceRefresh),
        getDeals(forceRefresh)
      ]);

      const products = categoryResult.data || [];
      const deals = dealsResult.data || [];

      console.log(`📦 Category products loaded: ${products.length}`);
      console.log(`🎯 Deals loaded: ${deals.length}`);
      console.log(`🎯 Deals data:`, deals);

      // Create a map of product IDs to deals for quick lookup
      const dealMap = new Map();
      deals.forEach(dealProduct => {
        console.log(`🏷️ Mapping deal for product ID: ${dealProduct._id}`);
        dealMap.set(dealProduct._id, {
          originalPrice: dealProduct.originalPrice,
          discountedPrice: dealProduct.price,
          discountPercentage: dealProduct.discount,
          discountAmount: dealProduct.discountAmount,
          dealInfo: dealProduct.dealInfo
        });
      });

      console.log(`🗺️ Deal map created with ${dealMap.size} entries`);

      // Merge deals into category products
      const productsWithDeals = products.map(product => {
        const deal = dealMap.get(product._id);
        console.log(`🔍 Checking product ${product.name} (ID: ${product._id}) for deals...`);
        
        if (deal) {
          console.log(`✅ Deal found for ${product.name}! Applying discount...`);
          return {
            ...product,
            originalPrice: deal.originalPrice,
            price: deal.discountedPrice,
            discountedPrice: deal.discountedPrice,
            discountPercentage: deal.discountPercentage,
            discountAmount: deal.discountAmount,
            discount: deal.discountPercentage,
            hasActiveDeal: true,
            dealInfo: deal.dealInfo
          };
        } else {
          console.log(`❌ No deal found for ${product.name}`);
        }
        
        return {
          ...product,
          hasActiveDeal: false
        };
      });

      console.log(`🎉 Products with deals processed: ${productsWithDeals.length}`);
      const dealsApplied = productsWithDeals.filter(p => p.hasActiveDeal).length;
      console.log(`💰 Deals applied to ${dealsApplied} products`);

      return {
        data: productsWithDeals,
        pagination: categoryResult.pagination,
        fromCache: categoryResult.fromCache && dealsResult.fromCache
      };

    } catch (error) {
      console.error('❌ Error getting category products with deals:', error);
      // Fallback to just category products if deals fail
      return await getCategoryProducts(categoryId, params, forceRefresh);
    }
  }, [getCategoryProducts, getDeals]);

  // Clear cache function
  const clearCache = useCallback(() => {
    dispatch({ type: CACHE_ACTIONS.CLEAR_CACHE });
  }, []);

  // Get cached product by ID
  const getProductById = useCallback((productId) => {
    return state.products.data.find(product => 
      (product._id || product.id) === productId
    );
  }, [state.products.data]);

  // Search products in cache
  const searchProductsInCache = useCallback((query) => {
    if (!query || !state.products.data.length) return [];
    
    const searchTerm = query.toLowerCase();
    return state.products.data.filter(product =>
      product.name?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm)
    );
  }, [state.products.data]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // State
    products: state.products,
    deals: state.deals,
    categories: state.categories,
    categoryProducts: state.categoryProducts,
    
    // Actions
    getProducts,
    getProductsWithDeals,
    getDeals,
    getCategoryProducts,
    getCategoryProductsWithDeals,
    clearCache,
    getProductById,
    searchProductsInCache,
    
    // Cache status helpers
    isProductsCached: state.products.data.length > 0 && isCacheValid(state.products.lastFetched, CACHE_TTL.PRODUCTS),
    isDealsCached: state.deals.data.length > 0 && isCacheValid(state.deals.lastFetched, CACHE_TTL.DEALS),
    isCategoriesCached: state.categories.data.length > 0 && isCacheValid(state.categories.lastFetched, CACHE_TTL.CATEGORIES)
  }), [
    state,
    getProducts,
    getProductsWithDeals,
    getDeals,
    getCategoryProducts,
    getCategoryProductsWithDeals,
    clearCache,
    getProductById,
    searchProductsInCache
  ]);

  return (
    <ProductCacheContext.Provider value={contextValue}>
      {children}
    </ProductCacheContext.Provider>
  );
};

// Custom hook to use product cache
export const useProductCache = () => {
  const context = useContext(ProductCacheContext);
  if (!context) {
    throw new Error('useProductCache must be used within a ProductCacheProvider');
  }
  return context;
};

export default ProductCacheContext;