
import React, { useState, useEffect } from 'react';
import ProductCardModern from './ProductCardModern';
import { productsAPI } from '../utils/api';
const ProductList = () => {
  ;
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const loadProducts = async () => {
    try {
    setLoading(true);
  // Request a larger limit so the frontend shows more products (backend supports `limit`)
const response = await productsAPI.getProducts({ limit: 200 });
        setProducts(response.data.products);
      } catch (err) {
        setError(err.message);
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
if (loading) {
    return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-coral"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Error loading products: {error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCardModern key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
