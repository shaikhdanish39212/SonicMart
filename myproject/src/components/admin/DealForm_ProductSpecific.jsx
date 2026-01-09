import React, { useState, useEffect } from 'react';
import adminAPI from '../../utils/adminAPI';
import { getImageUrl } from '../../utils/imageUrl';

const DealFormProductSpecific = ({ deal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountValue: '',
    validFrom: '',
    validUntil: ''
  });

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch products for selection
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await adminAPI.getProducts();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Initialize form data when deal prop changes
  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        description: deal.description || '',
        discountValue: deal.discountValue?.toString() || '',
        validFrom: deal.validFrom ? new Date(deal.validFrom).toISOString().split('T')[0] : '',
        validUntil: deal.validUntil ? new Date(deal.validUntil).toISOString().split('T')[0] : ''
      });
      
      // Set selected products if editing
      if (deal.applicableProducts && deal.applicableProducts.length > 0) {
        const selectedIds = deal.applicableProducts.map(p => p._id || p);
        setSelectedProducts(selectedIds);
      }
    }
  }, [deal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAllProducts = () => {
    const filteredProducts = getFilteredProducts();
    if (Array.isArray(filteredProducts)) {
      const allIds = filteredProducts.map(p => p._id);
      setSelectedProducts(allIds);
    }
  };

  const handleDeselectAllProducts = () => {
    setSelectedProducts([]);
  };

  const getFilteredProducts = () => {
    if (!Array.isArray(products)) return [];
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Check if products are selected
    if (selectedProducts.length === 0) {
      setErrors({ products: 'Please select at least one product for this deal' });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const dealData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        discountValue: parseFloat(formData.discountValue),
        validFrom: new Date(formData.validFrom),
        validUntil: new Date(formData.validUntil),
        type: 'percentage',
        category: 'products', // Changed to indicate product-specific deals
        applicableProducts: selectedProducts
      };
      
      let result;
      if (deal) {
        result = await adminAPI.updateDeal(deal._id, dealData);
      } else {
        result = await adminAPI.createDeal(dealData);
      }
      
      // Success - close form and trigger parent refresh
      onSave();
      
    } catch (error) {
      // Handle backend validation errors
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        
        if (serverError.errors) {
          setErrors(serverError.errors);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {deal ? 'Edit Product Deal' : 'Create Product-Specific Deal'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="space-y-6">
            
            {/* Deal Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent outline-none transition-all bg-white text-gray-900 ${
                  errors.title 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="e.g., Guitar Flash Sale - 25% Off Selected Models"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span> {errors.title}
                </p>
              )}
            </div>

            {/* Deal Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent outline-none transition-all resize-none bg-white text-gray-900 ${
                  errors.description 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Describe the deal, terms and conditions, and what makes it special..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span> {errors.description}
                </p>
              )}
            </div>

            {/* Discount and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Discount Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount % <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    min="1"
                    max="90"
                    step="0.01"
                    className={`w-full px-4 py-3 pr-8 border rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent outline-none transition-all bg-white text-gray-900 ${
                      errors.discountValue 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="25"
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
                {errors.discountValue && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span> {errors.discountValue}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent outline-none transition-all bg-white text-gray-900 with-calendar ${
                    errors.validFrom 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.validFrom && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span> {errors.validFrom}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  min={formData.validFrom || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent outline-none transition-all bg-white text-gray-900 with-calendar ${
                    errors.validUntil 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.validUntil && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span> {errors.validUntil}
                  </p>
                )}
              </div>
            </div>
            
            {/* Product Selection Section */}
            <div className="border-t pt-6 mt-6">
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Select Products for this Deal <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Choose which products this deal should apply to. Customers will see the discount on these specific products.
              </p>
              
              {/* Search and Actions */}
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products by name, brand, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllProducts}
                    className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Select All Filtered
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllProducts}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Selected Count */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-coral">{selectedProducts.length}</span> products selected
                </span>
                {Array.isArray(products) && getFilteredProducts().length > 0 && (
                  <span className="text-sm text-gray-500">
                    Showing {getFilteredProducts().length} of {products.length} products
                  </span>
                )}
              </div>

              {/* Product List */}
              <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
                {loadingProducts ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral mx-auto mb-2"></div>
                    Loading products...
                  </div>
                ) : !Array.isArray(products) || getFilteredProducts().length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    {searchTerm ? 'No products found matching your search' : 'No products available'}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {getFilteredProducts().map((product) => (
                      <div
                        key={product._id}
                        className={`p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedProducts.includes(product._id) ? 'bg-blue-50 border-l-4 border-l-coral' : ''
                        }`}
                        onClick={() => handleProductToggle(product._id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleProductToggle(product._id)}
                          className="h-5 w-5 text-coral focus:ring-coral border-gray-300 rounded"
                        />
                        {product.image ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2H6a2 2 0 00-2-2V6a2 2 0 002 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-xs">No Image</span>
                            </div>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {product.brand} • {product.category.replace('-', ' ')}
                          </div>
                          <div className="text-lg font-semibold text-coral">
                            ₹{product.price}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                          {selectedProducts.includes(product._id) && (
                            <div className="text-sm text-green-600 font-medium">✓ Selected</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.products && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span> {errors.products}
                </p>
              )}
            </div>
            
          </div>
        </form>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-coral hover:bg-red-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-coral transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                deal ? 'Update Deal' : 'Create Deal'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DealFormProductSpecific;