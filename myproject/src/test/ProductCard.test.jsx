import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

// Mock product data
const mockProduct = {
  _id: '1',
  name: 'Test Product',
  price: 99.99,
  originalPrice: 149.99,
  description: 'Test product description',
  category: 'Test Category',
  subcategory: 'Test Subcategory',
  brand: 'Test Brand',
  images: ['test-image.jpg'],
  stock: 10,
  specifications: {
    'Test Spec': 'Test Value'
  }
};

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('ProductCard Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders product information correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₹99.99')).toBeInTheDocument();
    expect(screen.getByText('₹149.99')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
  });

  test('displays sale badge when product has discount', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const saleElements = screen.getAllByText(/SALE|33% OFF/i);
    expect(saleElements.length).toBeGreaterThan(0);
  });

  test('shows out of stock when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    
    render(
      <TestWrapper>
        <ProductCard product={outOfStockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  test('adds product to cart when add to cart button is clicked', async () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    // Wait for the button text to change or success message
    await waitFor(() => {
      expect(screen.getByText(/added|success/i)).toBeInTheDocument();
    });
  });

  test('navigates to product page when product is clicked', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/product/1');
  });

  test('handles image error gracefully', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const image = screen.getByRole('img');
    fireEvent.error(image);

    // Should still render without crashing
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});