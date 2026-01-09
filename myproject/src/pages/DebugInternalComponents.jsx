import React, { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';

const DebugInternalComponents = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching internal components data...');
        
        const response = await productsAPI.getProductsByCategory("internal-components", {
          page: 1,
          limit: 10 // Just first 10 for debugging
        });
        
        console.log('Raw API Response:', response);
        setApiData(response);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const products = apiData?.data?.products || [];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Internal Components Debug</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">API Response Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Status:</strong> {apiData?.status || 'Unknown'}</div>
          <div><strong>Product Count:</strong> {products.length}</div>
          <div><strong>Has Data:</strong> {apiData?.data ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Has Products:</strong> {products.length > 0 ? '✅ Yes' : '❌ No'}</div>
        </div>
      </div>
      
      <div className="space-y-6">
        {products.map((product, index) => (
          <div key={product._id || index} className="border rounded-lg p-6 bg-white shadow">
            <h3 className="text-lg font-semibold mb-4">{product.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div>
                <h4 className="font-medium mb-2">Product Info:</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>SKU:</strong> {product.sku}</div>
                  <div><strong>Category:</strong> {product.category}</div>
                  <div><strong>Brand:</strong> {product.brand}</div>
                  <div><strong>Price:</strong> ${product.price}</div>
                </div>
              </div>
              
              {/* Image Info */}
              <div>
                <h4 className="font-medium mb-2">Image Info:</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Images Array:</strong></div>
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    {JSON.stringify(product.images, null, 2)}
                  </div>
                  <div><strong>First Image:</strong> {product.images?.[0] || 'None'}</div>
                  <div><strong>Processed URL:</strong> {getImageUrl(product.images?.[0])}</div>
                </div>
              </div>
            </div>
            
            {/* Image Display Test */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Image Display Test:</h4>
              <div className="flex flex-wrap gap-4">
                {product.images?.slice(0, 2).map((imagePath, imgIndex) => (
                  <div key={imgIndex} className="text-center">
                    <div className="text-xs mb-1">Image {imgIndex + 1}</div>
                    <img 
                      src={getImageUrl(imagePath)} 
                      alt={`${product.name} - ${imgIndex + 1}`}
                      className="w-32 h-32 object-contain border border-gray-300 rounded"
                      onLoad={() => console.log(`✅ Image loaded: ${imagePath}`)}
                      onError={(e) => {
                        console.error(`❌ Image failed: ${imagePath}`);
                        e.target.style.border = '2px solid red';
                      }}
                    />
                    <div className="text-xs mt-1 text-gray-600">
                      {imagePath?.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Raw JSON Dump */}
      <div className="mt-8 p-4 bg-gray-900 text-green-400 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-white">Raw API Response:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(apiData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DebugInternalComponents;