import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import CartPage from '../components/CartPage';

// Mock the API
jest.mock('../utils/api', () => ({
  cartAPI: {
    getCart: jest.fn(),
    updateQuantity: jest.fn(),
    removeItem: jest.fn(),
  }
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

const mockCartData = {
  items: [
    {
      _id: '1',
      product: {
        _id: 'prod1',
        name: 'Test Product 1',
        price: 99.99,
        images: ['test1.jpg']
      },
      quantity: 2
    },
    {
      _id: '2',
      product: {
        _id: 'prod2',
        name: 'Test Product 2',
        price: 149.99,
        images: ['test2.jpg']
      },
      quantity: 1
    }
  ],
  total: 349.97
};

describe('CartPage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock successful cart fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCartData)
    });
  });

  test('renders cart items correctly', async () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  test('displays correct total amount', async () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/₹349.97/)).toBeInTheDocument();
    });
  });

  test('updates quantity when quantity buttons are clicked', async () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const increaseButtons = screen.getAllByText('+');
    fireEvent.click(increaseButtons[0]);

    // Should trigger quantity update
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cart/update'),
        expect.objectContaining({
          method: 'PUT'
        })
      );
    });
  });

  test('removes item when remove button is clicked', async () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByText(/remove|delete/i);
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cart/remove'),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });

  test('displays empty cart message when cart is empty', async () => {
    // Mock empty cart response
    fetch.mockClear();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0 })
    });

    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });

  test('navigates to checkout when proceed button is clicked', async () => {
    render(
      <TestWrapper>
        <CartPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const checkoutButton = screen.getByText(/proceed to checkout|place order/i);
    expect(checkoutButton).toHaveAttribute('href', '/place-order');
  });
});