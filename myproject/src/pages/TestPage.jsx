import React, { useState, useEffect } from 'react';
import { productsAPI, authAPI } from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import LoginTest from '../components/LoginTest';
const TestPage = () => {
  const [status, setStatus] = useState('Initializing...');
const [products, setProducts] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const testProductsAPI = async () => {
    try {
    console.log('TestPage: Starting API test...');
        setStatus('Testing API connection...');
        setLoading(true);
        setError(null);
        
        // Test the exact same call as ProductsPage
const response = await productsAPI.getProducts({
          page: 1,
          limit: 50,
          sortBy: 'name'
        });
    console.log('TestPage: API Response received:', response);
if (response && response.data && response.data.products) {
          const products = response.data.products;
          console.log('TestPage: Products array:', products);
          console.log('TestPage: Products count:', products.length);
          console.log('TestPage: First product:', products[0]);
          
          setProducts(products);
          setStatus(`Success! Loaded ${products.length} products`);
        } else {
          console.error('TestPage: Invalid response structure:', response);
          setError('Invalid response structure');
          setStatus('Failed - Invalid response structure');
        }
      } catch (err) {
        console.error('🧪 TestPage: API Error:', err);
        setError(err.message);
        setStatus('❌ Failed - ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    testProductsAPI();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">API Status</h2>
          <p className="mb-2"><strong>Status:</strong>{status}</p>
          <p className="mb-2"><strong>Loading:</strong>{loading ? 'Yes' : 'No'}</p>
          {error && (
            <p className="text-red-600 mb-2"><strong>Error:</strong>{error}
      </p>
    )
  }
        </div>
        
        {products.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product, index) => (
                <div key={product._id || index} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">₹{product.price}</p>
                  <p className="text-sm text-gray-500">Category: {product.category}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  {product.image && (
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name}
                      className="w-full h-32 object-contain mt-2 bg-gray-100 rounded"
                      onError={(e) => {
                        console.log('🖼️ Image failed to load:', product.image);
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Login API Test */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Login API Test</h2>
          <LoginTest />
        </div>
      </div>
    </div>
  );
};

export default TestPage;