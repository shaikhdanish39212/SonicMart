import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../utils/api';
import { toast } from 'react-hot-toast';

// Base URL for direct fetch calls - strip trailing /api if present since endpoints include full path
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Function to load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Validate cart structure
      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return [];
};

// Function to save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCartFromStorage);
  const [addingToCartIds, setAddingToCartIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    const loadCartFromBackend = async () => {
      if (isAuthenticated && user) {
        setIsLoading(true);
        try {
          // GET /api/cart
          const response = await fetch(`${API_BASE}/api/cart`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            const backendCart = result.data?.cart;

            if (backendCart && Array.isArray(backendCart.items)) {
              // Transform backend cart format to frontend format
              const transformedCart = backendCart.items.map(item => ({
                id: item.product._id || item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                // Spread product details first
                ...item.product,
                // Then ensure consistent image properties (override if needed)
                image: item.product.image || item.product.images?.[0] || item.product.galleryImages?.[0],
                // Ensure we preserve all image fields for consistency
                images: item.product.images,
                galleryImages: item.product.galleryImages,
                mainImage: item.product.image || item.product.images?.[0] || item.product.galleryImages?.[0]
              }));
              setCart(transformedCart);
              saveCartToStorage(transformedCart);
            }
          } else {
            throw new Error('Failed to fetch cart from backend');
          }
        } catch (error) {
          console.error('Error loading cart from backend:', error);
          // Fallback to localStorage on error
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCartFromBackend();
  }, [isAuthenticated, user?.id]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setCart([]);
      localStorage.removeItem('cart');
    }
  }, [isAuthenticated]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = async (product) => {
    const productId = product.id || product._id;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      // Show a toast notification requiring login
      toast.error('Please log in to add items to your cart');
      return;
    }

    // Add product ID to loading set
    setAddingToCartIds(prev => new Set(prev).add(productId));

    try {
      // Update local state optimistically
      setCart(prevCart => {
        const existingProduct = prevCart.find(item => item.id === productId);
        if (existingProduct) {
          return prevCart.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, id: productId, quantity: 1 }];
        }
      });

      // If user is authenticated, sync with backend
      if (isAuthenticated && user) {
        try {
          // Use the correct backend endpoint POST /api/cart/items
          const response = await fetch(`${API_BASE}/api/cart/items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId: productId, quantity: 1 })
          });

          if (!response.ok) {
            throw new Error('Failed to add to backend cart');
          }
        } catch (error) {
          console.error('Error adding to backend cart:', error);
          // Continue with local storage - don't block UX
        }
      }

      // Simulate a brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      // Remove product ID from loading set
      setAddingToCartIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeFromCart = async (productId) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error('Please log in to manage your cart');
      return;
    }

    // Update local state optimistically
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === productId);
      if (!existingProduct) {
        return prevCart; // Product not found, return unchanged cart
      }
      if (existingProduct.quantity === 1) {
        return prevCart.filter(item => item.id !== productId);
      } else {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });

    // If user is authenticated, sync with backend
    if (isAuthenticated && user) {
      try {
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct && existingProduct.quantity === 1) {
          // Remove completely from backend DELETE /api/cart/items/:productId
          const response = await fetch(`${API_BASE}/api/cart/items/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to remove from backend cart');
          }
        } else {
          // Just reduce quantity by 1 - PUT /api/cart/items/:productId
          const newQuantity = existingProduct.quantity - 1;
          const response = await fetch(`${API_BASE}/api/cart/items/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ quantity: newQuantity })
          });

          if (!response.ok) {
            throw new Error('Failed to update backend cart');
          }
        }
      } catch (error) {
        console.error('Error removing from backend cart:', error);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error('Please log in to manage your cart');
      return;
    }

    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    // Update local state optimistically
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // If user is authenticated, sync with backend
    if (isAuthenticated && user) {
      try {
        // PUT /api/cart/items/:productId
        const response = await fetch(`${API_BASE}/api/cart/items/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) {
          throw new Error('Failed to update backend cart');
        }
      } catch (error) {
        console.error('Error updating backend cart:', error);
      }
    }
  };

  const clearCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error('Please log in to manage your cart');
      return;
    }

    // Store current cart state for potential undo functionality
    const currentCart = [...cart];

    // Always clear local state first for immediate UI response
    setCart([]);
    localStorage.removeItem('cart');

    // If user is authenticated, sync with backend
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.warn('No authentication token found');
          return;
        }

        const response = await fetch(`${API_BASE}/api/cart`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Backend clear failed: ${response.status}`);
        }

        // Success - cart is cleared both locally and on backend
        console.log('Cart cleared successfully');

      } catch (error) {
        console.error('Backend sync error:', error);
        // Don't restore cart on backend error - local clear should persist
        // User will be notified through the UI if needed
      }
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Helper function to check if a specific product is being added to cart
  const isAddingToCart = (productId) => {
    return addingToCartIds.has(productId);
  };

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    isAddingToCart,
    isLoading,
    getTotalPrice,
    getTotalItems
  }), [
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    isAddingToCart,
    isLoading,
    getTotalPrice,
    getTotalItems
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
