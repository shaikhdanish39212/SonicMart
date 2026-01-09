import React, { useState, useEffect } from 'react';
import adminAPI from '../../utils/adminAPI';
import { getImageUrl } from '../../utils/imageUrl';

const DealFormSimple = ({ deal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountValue: '',
    validFrom: '',
    validUntil: '',
    category: '',
    selectedProducts: []
  });

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // All 14 categories
  const categories = [
    { key: '', name: 'Select Category' },
    { key: 'dj-speakers', name: 'DJ Speakers' },
    { key: 'drums-percussion', name: 'Drums & Percussion' },
    { key: 'earbuds', name: 'Earbuds' },
    { key: 'earphones', name: 'Earphones' },
    { key: 'guitars-basses', name: 'Guitars & Basses' },
    { key: 'headphones', name: 'Headphones' },
    { key: 'home-theater', name: 'Home Theater' },
    { key: 'keyboards-pianos', name: 'Keyboards & Pianos' },
    { key: 'loud-speakers', name: 'Loud Speakers' },
    { key: 'microphones', name: 'Microphones' },
    { key: 'neckband-earphones', name: 'Neckband Earphones' },
    { key: 'speakers', name: 'Speakers' },
    { key: 'studio-equipment', name: 'Studio Equipment' }
  ];

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by category
  useEffect(() => {
    if (formData.category && Array.isArray(products)) {
      const filtered = products.filter(product => 
        product.category === formData.category
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
    // Reset selected products when category changes
    setFormData(prev => ({ ...prev, selectedProducts: [] }));
  }, [formData.category, products]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await adminAPI.getProducts();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
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
        validUntil: deal.validUntil ? new Date(deal.validUntil).toISOString().split('T')[0] : '',
        category: deal.category || '',
        selectedProducts: deal.applicableProducts || []
      });
    }
  }, [deal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProductSelect = (productId) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.discountValue || formData.discountValue <= 0 || formData.discountValue > 100) {
      newErrors.discountValue = 'Discount must be between 1 and 100';
    }

    if (!formData.validFrom) {
      newErrors.validFrom = 'Start date is required';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'End date is required';
    }

    if (formData.validFrom && formData.validUntil && new Date(formData.validFrom) >= new Date(formData.validUntil)) {
      newErrors.validUntil = 'End date must be after start date';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = 'Please select at least one product';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dealData = {
        title: formData.title,
        description: formData.description,
        discountValue: parseFloat(formData.discountValue),
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        applicableProducts: formData.selectedProducts,
        isActive: true
      };

      let response;
      if (deal && deal._id) {
        response = await adminAPI.updateDeal(deal._id, dealData);
      } else {
        response = await adminAPI.createDeal(dealData);
      }

      if (response.status === 'success') {
        onSave();
      } else {
        setErrors({ submit: 'Failed to save deal' });
      }
    } catch (error) {
      console.error('Error saving deal:', error);
      setErrors({ submit: error.response?.data?.message || 'Failed to save deal' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {deal ? 'Edit Deal' : 'Create New Deal'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
            placeholder="Enter deal title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
            placeholder="Enter deal description"
          />
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Percentage *
          </label>
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleInputChange}
            min="1"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
            placeholder="Enter discount percentage (1-100)"
          />
          {errors.discountValue && (
            <p className="mt-1 text-sm text-red-600">{errors.discountValue}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="validFrom"
              value={formData.validFrom}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent with-calendar"
            />
            {errors.validFrom && (
              <p className="mt-1 text-sm text-red-600">{errors.validFrom}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent with-calendar"
            />
            {errors.validUntil && (
              <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Product Selection */}
        {formData.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Products * ({formData.selectedProducts.length} selected)
            </label>
            {loadingProducts ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-coral mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No products found in this category
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedProducts.includes(product._id)}
                      onChange={() => handleProductSelect(product._id)}
                      className="mr-3 h-4 w-4 text-coral focus:ring-coral border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] && (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{product.price} | SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.selectedProducts && (
              <p className="mt-1 text-sm text-red-600">{errors.selectedProducts}</p>
            )}
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-coral text-white rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : (deal ? 'Update Deal' : 'Create Deal')}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default DealFormSimple;