import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCardModern from './ProductCardModern';
const SimpleProductsPage = () => {
  ;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log(' Loading products...');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`);
        const data = await response.json(); console.log(' Products loaded:', data); setProducts(data.data.products || []);
      } catch (err) { console.error(' Error loading products:', err); setError(err.message); } finally { setLoading(false); }
    }; loadProducts();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto">
          </div>
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      </div>);
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Products</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()
          } className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" > Retry </button>
        </div>
      </div>);
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4"> Sounds Accessories & Components </h1>
        <p className="text-lg text-gray-600"> Found {products.length} products in your store </p>
      </div>
      <div className="products-page-grid"> {products.map((product) => (<div key={product._id} className="h-full">
        <ProductCardModern product={product} />
      </div>))
      }
      </div> {products.length === 0 && (<div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">
        </div>
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Products Found</h2>
        <p className="text-gray-500">Check your backend connection or database.</p>
      </div>)
      }
    </div>
  );
};

export default SimpleProductsPage;