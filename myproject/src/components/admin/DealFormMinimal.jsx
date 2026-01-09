import React, { useState, useEffect } from 'react';
import adminAPI from '../../utils/adminAPI';
import productsAPI from '../../utils/productsAPI';

const DealFormMinimal = ({ deal, onSuccess, onSave, onCancel }) => {
  console.log('🔴 DealFormMinimal mounted with deal:', deal);
  console.log('🔴 Deal type:', typeof deal);
  console.log('🔴 Deal keys:', deal ? Object.keys(deal) : 'null');
  console.log('🔴 Props received:', { onSuccess: typeof onSuccess, onSave: typeof onSave, onCancel: typeof onCancel });

  // Use onSuccess if provided, otherwise fall back to onSave
  const successCallback = onSuccess || onSave;

  const [formData, setFormData] = useState({
    category: '',
    selectedProducts: [],
    discountPercentage: '',
    startDate: '',
    endDate: ''
  });

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formInitialized, setFormInitialized] = useState(false);

  // All 15 categories including internal-components
  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'dj-speakers', label: 'DJ Speakers' },
    { value: 'drums-percussion', label: 'Drums & Percussion' },
    { value: 'earbuds', label: 'Earbuds' },
    { value: 'earphones', label: 'Earphones' },
    { value: 'guitars-basses', label: 'Guitars & Basses' },
    { value: 'headphones', label: 'Headphones' },
    { value: 'home-theater', label: 'Home Theater' },
    { value: 'internal-components', label: 'Internal Components' },
    { value: 'keyboards-pianos', label: 'Keyboards & Pianos' },
    { value: 'loud-speakers', label: 'Loud Speakers' },
    { value: 'microphones', label: 'Microphones' },
    { value: 'neckband-earphones', label: 'Neckband Earphones' },
    { value: 'speakers', label: 'Speakers' },
    { value: 'studio-equipment', label: 'Studio Equipment' }
  ];

  // Reset form when modal opens/closes or when switching between create/edit
  useEffect(() => {
    if (!deal) {
      // Reset form for new deal creation
      setFormData({
        category: '',
        selectedProducts: [],
        discountPercentage: '',
        startDate: '',
        endDate: ''
      });
      setFormInitialized(false);
      setFilteredProducts([]);
      setErrors({});
      console.log('🆕 Form completely reset for new deal creation');
    } else {
      // When switching to edit mode, reset the initialization flag
      setFormInitialized(false);
      setErrors({});
      console.log('🔄 Switching to edit mode, will initialize with deal data');
    }
  }, [deal]);

  // Initialize form when deal prop changes and products are loaded
  useEffect(() => {
    if (deal && allProducts.length > 0 && !formInitialized) {
      console.log('🔧 Initializing form with deal data:', deal);
      console.log('🏷️ Deal category:', deal.category);
      console.log('📦 Deal products:', deal.applicableProducts);
      console.log('💰 Deal discount:', deal.discountValue);
      console.log('📅 Deal dates:', deal.validFrom, 'to', deal.validUntil);
      
      // Handle category mapping - some deals might have 'all' category or categories not in our list
      let dealCategory = '';
      
      if (deal.category && deal.category !== 'all' && categories.some(c => c.value === deal.category)) {
        // Deal has a valid specific category that exists in our dropdown
        dealCategory = deal.category;
        console.log('✅ Using deal category directly:', dealCategory);
      } else if (deal.applicableProducts && deal.applicableProducts.length > 0 && allProducts.length > 0) {
        // Deal category is 'all' or invalid, try to infer from first product
        const firstProductId = typeof deal.applicableProducts[0] === 'object' 
          ? deal.applicableProducts[0]._id || deal.applicableProducts[0].id
          : deal.applicableProducts[0];
        
        const firstProduct = allProducts.find(p => p._id === firstProductId);
        if (firstProduct && categories.some(c => c.value === firstProduct.category)) {
          dealCategory = firstProduct.category;
          console.log('🔍 Inferred category from first product:', dealCategory);
        } else {
          console.log('❌ Could not find valid category from first product');
        }
      } else {
        console.log('❌ No valid category found, deal might not have applicable products');
        // For deals without specific products, default to first category for user selection
        if (deal.category === 'all') {
          console.log('🔄 Deal has "all" category, user will need to select specific category');
          dealCategory = ''; // Leave empty so user can select
        }
      }
      
      // Handle product IDs - extract IDs from objects if needed
      let productIds = [];
      if (deal.applicableProducts && Array.isArray(deal.applicableProducts)) {
        productIds = deal.applicableProducts.map(product => {
          if (typeof product === 'object') {
            return product._id || product.id;
          }
          return product;
        }).filter(id => id); // Remove any undefined/null values
        console.log('📦 Extracted product IDs:', productIds);
      }
      
      // Ensure date formatting is correct for HTML date inputs
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          // Check if date is valid
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error formatting date:', error);
          return '';
        }
      };
      
      const newFormData = {
        category: dealCategory,
        selectedProducts: productIds,
        discountPercentage: deal.discountValue?.toString() || '',
        startDate: formatDateForInput(deal.validFrom),
        endDate: formatDateForInput(deal.validUntil)
      };
      
      console.log('📋 Setting form data:', newFormData);
      setFormData(newFormData);
      setFormInitialized(true);
      
      console.log('✅ Form data set with improved category and product handling:', newFormData);
    }
  }, [deal, allProducts, formInitialized]);

  // Trigger filtering immediately after form is initialized with deal data
  useEffect(() => {
    if (formInitialized && deal && formData.category && allProducts.length > 0) {
      console.log('🚀 Triggering immediate filtering after deal initialization');
      // This will trigger the category filtering useEffect above
      // which will properly set filteredProducts and maintain selected products
    }
  }, [formInitialized, deal, formData.category, allProducts.length]);

  // Deal prop tracking
  useEffect(() => {
    if (deal) {
      console.log('🔵 Deal prop changed:', deal);
      console.log('🔵 Deal structure:', { 
        _id: deal._id, 
        title: deal.title, 
        category: deal.category, 
        applicableProducts: deal.applicableProducts, 
        discountValue: deal.discountValue, 
        validFrom: deal.validFrom, 
        validUntil: deal.validUntil 
      });
      console.log('🔵 Deal category value exactly:', `"${deal.category}"`);
      console.log('🔵 Available categories:', categories.map(c => `"${c.value}"`));
      console.log('🔵 Category exists in dropdown?', categories.some(c => c.value === deal.category));
      console.log('🔵 Applicable products array:', deal.applicableProducts);
      console.log('🔵 Applicable products length:', deal.applicableProducts?.length);
    }
  }, [deal]);

  // Filter products based on selected category
  useEffect(() => {
    console.log('🔄 Category filter triggered');
    console.log('📂 Selected category:', formData.category);
    console.log('📦 All products count:', allProducts.length);
    console.log('🎯 Currently selected products:', formData.selectedProducts);
    
    if (formData.category && Array.isArray(allProducts) && allProducts.length > 0) {
      console.log('🔍 Starting product filtering for category:', formData.category);
      
      // Filter by specific category
      const filtered = allProducts.filter(product => {
        const match = product.category === formData.category;
        // Log details for debugging
        if (formData.category === 'headphones' || formData.category === 'earbuds') {
          console.log(`🎯 Product: "${product.name}", Category: "${product.category}", Match: ${match}`);
        }
        return match;
      });
      
      console.log(`✅ Filtered products for "${formData.category}":`, filtered.length);
      console.log('🎯 First few filtered products:', filtered.slice(0, 3).map(p => ({ name: p.name, category: p.category, id: p._id })));
      setFilteredProducts(filtered);

      // When editing a deal, preserve selected products if they belong to the filtered category
      if (deal && formInitialized) {
        // Check if currently selected products are still valid for this category
        const validSelectedProducts = formData.selectedProducts.filter(productId => 
          filtered.some(product => product._id === productId)
        );
        
        // If some selected products are not valid for current category, update the selection
        if (validSelectedProducts.length !== formData.selectedProducts.length) {
          console.log('🔄 Updating selected products to match category filter');
          console.log('🔄 Valid products:', validSelectedProducts);
          setFormData(prev => ({ 
            ...prev, 
            selectedProducts: validSelectedProducts 
          }));
        }
      }
    } else {
      console.log('❌ No filtering - reason:', {
        hasCategory: !!formData.category,
        isArray: Array.isArray(allProducts),
        hasProducts: allProducts.length > 0
      });
      setFilteredProducts([]);
    }
    
    // Only reset selected products if this is NOT an edit deal AND form is not initialized
    if (!deal && !formInitialized && !formData.category) {
      setFormData(prev => ({ ...prev, selectedProducts: [] }));
    }
  }, [formData.category, allProducts, deal, formInitialized]);

  // Fetch all products on mount
  useEffect(() => {
    console.log('🔄 Starting to fetch products...');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts({ limit: 200 });
      
      console.log('✅ API Response received:', response);
      console.log('📦 Raw response data:', response.data);
      console.log('🗂️ Response keys:', Object.keys(response.data));
      console.log('📊 Products array (data.data):', response.data.data);
      console.log('📊 Products array (direct data):', response.data.products);
      console.log('🔢 Fetched products count:', response.data.products?.length);

      let products = [];
      
      // Handle different response structures
      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        products = response.data.products;
        console.log('🎯 Found products in: data.products');
        console.log('🎯 Sample product categories:', products.slice(0, 5).map(p => ({ name: p.name, category: p.category })));
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        products = response.data.data;
        console.log('🎯 Found products in: data.data');
      } else {
        console.error('❌ Unexpected response structure:', response.data);
      }

      // Category distribution analysis
      const categoryCount = {};
      products.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      });
      console.log('📈 Category distribution:', categoryCount);

      // Check for earbuds specifically
      const earbudsProducts = products.filter(p => p.category === 'earbuds');
      console.log('🎧 Earbuds products found:', earbudsProducts.length);
      console.log('🎧 Earbuds sample:', earbudsProducts.slice(0, 3).map(p => ({ name: p.name, category: p.category, price: p.price })));

      setAllProducts(products);
      setLoading(false);
      
      console.log('✅ Fetch products completed');
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setErrors({ fetch: 'Failed to load products' });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for category change
    if (name === 'category') {
      console.log('🔄 Category changed from', formData.category, 'to', value);
      
      // When category changes, clear selected products (except during initial form setup)
      if (formInitialized) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          selectedProducts: [] // Clear selection when category changes after initialization
        }));
        console.log('🧹 Cleared selected products due to category change');
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        console.log('🔧 Category set during initialization, preserving selected products');
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProductSelect = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    console.log('🛒 Products selected:', selectedValues);
    console.log('🛒 Product names:', selectedValues.map(id => {
      const product = filteredProducts.find(p => p._id === id);
      return product ? product.name : id;
    }));
    
    setFormData(prev => ({ ...prev, selectedProducts: selectedValues }));
    
    if (errors.selectedProducts) {
      setErrors(prev => ({ ...prev, selectedProducts: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.selectedProducts || formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = 'Please select at least one product';
    }

    if (!formData.discountPercentage) {
      newErrors.discountPercentage = 'Please enter discount percentage';
    } else {
      const discount = parseFloat(formData.discountPercentage);
      if (isNaN(discount) || discount < 1 || discount > 90) {
        newErrors.discountPercentage = 'Discount must be between 1 and 90';
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    // Validate date format and logic
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for date-only comparison
      
      if (isNaN(startDate.getTime())) {
        newErrors.startDate = 'Invalid start date format';
      }
      
      if (isNaN(endDate.getTime())) {
        newErrors.endDate = 'Invalid end date format';
      }
      
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      
      if (startDate >= endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
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
      // Map frontend categories to backend-compatible categories or use 'all' for product-specific deals
      const getCategoryForBackend = (frontendCategory) => {
        const categoryMap = {
          'guitars-basses': 'guitars-basses',
          'keyboards-pianos': 'keyboards-pianos',
          'drums-percussion': 'drums-percussion',
          'studio-equipment': 'studio-equipment',
          'microphones': 'microphones',
          'speakers': 'speakers-monitors',
          'loud-speakers': 'speakers-monitors',
          'dj-speakers': 'speakers-monitors'
        };
        
        // For product-specific deals with categories not in backend enum, use 'all'
        return categoryMap[frontendCategory] || 'all';
      };

      const dealData = {
        title: `${formData.discountPercentage}% Off ${categories.find(c => c.value === formData.category)?.label}`,
        description: `Get ${formData.discountPercentage}% discount on selected ${formData.category}`,
        type: 'percentage',
        discountValue: parseFloat(formData.discountPercentage),
        category: getCategoryForBackend(formData.category),
        applicableProducts: formData.selectedProducts,
        validFrom: new Date(formData.startDate).toISOString(),
        validUntil: new Date(formData.endDate).toISOString(),
        isActive: true
      };

      console.log('🔄 Submitting deal data:', dealData);
      console.log('🔄 Category mapping:', formData.category, '->', dealData.category);
      console.log('🔄 Deal validation check:');
      console.log('  - Title:', dealData.title);
      console.log('  - Description:', dealData.description);
      console.log('  - Discount:', dealData.discountValue);
      console.log('  - Category (backend):', dealData.category);
      console.log('  - Products:', dealData.applicableProducts);
      console.log('  - Valid From:', dealData.validFrom);
      console.log('  - Valid Until:', dealData.validUntil);

      let response;
      if (deal && deal._id) {
        console.log('🔄 Updating existing deal with ID:', deal._id);
        response = await adminAPI.updateDeal(deal._id, dealData);
        console.log('✅ Deal updated successfully:', response);
      } else {
        console.log('🔄 Creating new deal');
        response = await adminAPI.createDeal(dealData);
        console.log('✅ Deal created successfully:', response);
      }

      // Call success callback if provided
      if (typeof successCallback === 'function') {
        console.log('✅ Calling success callback');
        successCallback();
      } else {
        console.log('⚠️ No success callback provided');
        // If no callback, at least show success message
        alert('Deal saved successfully!');
      }
    } catch (error) {
      console.error('❌ Error saving deal:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error response data:', error.response?.data);
      console.error('❌ Error message:', error.response?.data?.message);
      console.error('❌ Error details:', error.response?.data?.details);
      console.error('❌ Full error object:', JSON.stringify(error.response?.data, null, 2));
      
      setErrors({ 
        submit: error.response?.data?.message || 
                error.response?.data?.error || 
                error.message || 
                'Failed to save deal' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {deal ? 'Edit Deal' : 'Create New Deal'}
              {deal && formInitialized && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Pre-populated
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {deal ? 'Modify the deal details below' : 'Fill in exactly these 4 details to create a deal'}
              {deal && !formInitialized && (
                <span className="text-blue-600 ml-1">Loading deal data...</span>
              )}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Select Category *
                  {deal && formInitialized && formData.category && (
                    <span className="ml-2 text-xs text-green-600">
                      (Pre-selected: {categories.find(c => c.value === formData.category)?.label})
                    </span>
                  )}
                  {deal && formInitialized && !formData.category && (
                    <span className="ml-2 text-xs text-amber-600">
                      (⚠️ Please select - deal had category "{deal.category}")
                    </span>
                  )}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent text-lg bg-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {formData.category && (
                  <p className="mt-1 text-xs text-green-600">✅ Selected: {categories.find(c => c.value === formData.category)?.label}</p>
                )}
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* 2. Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Select Products from {formData.category ? categories.find(c => c.value === formData.category)?.label : 'Category'} *
                  {formData.category && filteredProducts.length > 0 && (
                    <span className="text-coral ml-2">({filteredProducts.length} available)</span>
                  )}
                </label>
                {formData.category ? (
                  filteredProducts.length > 0 ? (
                    <div className="deal-form">
                      <select
                        multiple
                        value={formData.selectedProducts}
                        onChange={handleProductSelect}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent h-32 bg-white text-gray-900"
                        size={Math.min(filteredProducts.length, 8)}
                      >
                        {filteredProducts.map(product => {
                          const isSelected = formData.selectedProducts.includes(product._id);
                          return (
                            <option 
                              key={product._id} 
                              value={product._id} 
                              className={`py-2 px-2 ${isSelected ? 'font-semibold' : ''}`}
                              style={{
                                backgroundColor: isSelected ? '#20B2AA' : 'transparent',
                                color: isSelected ? 'white' : '#1f2937',
                                fontWeight: isSelected ? 'bold' : 'normal'
                              }}
                            >
                              {isSelected ? '✓ ' : ''}{product.name} - ₹{product.price}
                            </option>
                          );
                        })}
                      </select>
                      {formData.selectedProducts.length > 0 && (
                        <p className="mt-1 text-xs text-green-600">
                          ✅ Selected: {formData.selectedProducts.length} product{formData.selectedProducts.length !== 1 ? 's' : ''}
                          {deal && formInitialized && (
                            <span className="ml-1">(Pre-loaded from deal)</span>
                          )}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="w-full px-4 py-6 border border-gray-300 rounded-lg bg-gray-50 text-center text-gray-500">
                      No products found in this category
                    </div>
                  )
                ) : (
                  <div className="w-full px-4 py-6 border border-gray-300 rounded-lg bg-gray-50 text-center text-gray-500">
                    Please select a category first
                  </div>
                )}
                {errors.selectedProducts && (
                  <p className="mt-1 text-sm text-red-600">{errors.selectedProducts}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple products</p>
              </div>

              {/* 3. Discount Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. Discount Percentage (1-100%) *
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  placeholder="Enter discount percentage"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent text-lg bg-white"
                />
                {errors.discountPercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.discountPercentage}</p>
                )}
              </div>

              {/* 4. Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    4. Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent bg-white with-calendar"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    5. End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent bg-white with-calendar"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Submit Error Display */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error saving deal
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {errors.submit}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof onCancel === 'function') {
                      onCancel();
                    } else {
                      console.log('⚠️ No cancel callback provided');
                      // Fallback behavior - could close modal or navigate back
                    }
                  }}
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
    </div>
  );
};

export default DealFormMinimal;