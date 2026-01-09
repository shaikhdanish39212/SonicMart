import React, { useState, useEffect } from 'react';
import { useFormValidation, validationRules } from '../../utils/validation';
import ValidatedInput from '../form/ValidatedInput';
import ValidatedTextarea from '../form/ValidatedTextarea';
import ValidatedSelect from '../form/ValidatedSelect';
import ImageUpload from '../form/ImageUpload';

const ProductForm = ({ product, onSave, onCancel }) => {
  // Simple SKU generator function (inline) - Easy to read format
  const generateSKUFromProduct = (brand = '', productName = '', length = 8) => {
    try {
      // Create more readable, user-friendly SKUs
      
      // Extract meaningful parts from brand and product
      const brandPart = (brand || '').replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 3);
      const productWords = (productName || '').split(' ').filter(word => word.length > 0);
      
      // Get first letter of each significant word from product name
      let productPart = '';
      if (productWords.length > 0) {
        productPart = productWords.slice(0, 2) // Take first 2 words
          .map(word => word.charAt(0).toUpperCase())
          .join('');
      }
      
      // Create a readable prefix (brand + product initials)
      let prefix = brandPart + productPart;
      
      // Fallback if no meaningful prefix
      if (!prefix || prefix.length < 3) {
        prefix = 'PRD'; // Default prefix
      }
      
      // Ensure prefix is not too long
      prefix = prefix.substring(0, 5);
      
      // Add sequential-style numbers (easier to read than random)
      const timestamp = Date.now().toString().slice(-3); // Last 3 digits of timestamp
      let result = prefix + timestamp;
      
      // Adjust length to exactly 8 characters
      if (result.length > 8) {
        result = result.substring(0, 8);
      } else if (result.length < 8) {
        // Add simple incremental numbers instead of random
        const numbers = '123456789';
        while (result.length < 8) {
          result += numbers.charAt((result.length - prefix.length) % numbers.length);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error generating SKU:', error);
      // Simple fallback format: PRD + 5 numbers
      const simpleNum = Math.floor(10000 + Math.random() * 90000);
      return 'PRD' + simpleNum.toString();
    }
  };
  // Form validation setup
  const validationSchema = {
    name: [validationRules.productName],
    description: [validationRules.required, validationRules.minLength(10), validationRules.maxLength(1000)],
    price: [validationRules.productPrice],
    category: [validationRules.required],
    stock: [validationRules.stockQuantity],
    brand: [validationRules.brandName],
    images: [validationRules.imageArrayLength(1, 5), validationRules.imageUrls],
    sku: [validationRules.productSKU]
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors
  } = useFormValidation(
    {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      brand: '',
      images: [],
      sku: ''
    },
    validationSchema
  );

  useEffect(() => {
    if (product) {
      console.log('Loading product data:', product);
      console.log('Product image:', product.image);
      console.log('Product galleryImages:', product.galleryImages);
      
      // Combine all image fields into a single images array
      let combinedImages = [];
      
      // Add main image first
      if (product.image) {
        combinedImages.push(product.image);
      }
      
      // Add gallery images
      if (product.galleryImages && product.galleryImages.length > 0) {
        combinedImages = [...combinedImages, ...product.galleryImages];
      }
      
      // Add any images from the images array (if exists)
      if (product.images && product.images.length > 0) {
        combinedImages = [...combinedImages, ...product.images];
      }
      
      // Remove duplicates and filter out empty images
      combinedImages = [...new Set(combinedImages)].filter(img => img);
      
      console.log('Combined images for form:', combinedImages);
      
      // Map product fields to form fields
      const mappedProduct = {
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || product.stockQuantity || '',
        brand: product.brand || '',
        images: combinedImages,
        sku: product.sku || ''
      };
      
      console.log('Mapped product for form:', mappedProduct);
      
      setValues(mappedProduct);
      // Clear any existing errors when loading product data
      setErrors({});
    }
  }, [product, setValues, setErrors]);

  const onSubmit = (formData) => {
    console.log('ProductForm onSubmit called with:', formData);
    
    // Debug image handling
    console.log('Form images:', formData.images);
    console.log('Form SKU:', formData.sku);
    console.log('Images type:', typeof formData.images);
    console.log('Images array:', Array.isArray(formData.images));
    
    // Convert images array back to the expected backend format
    const processedData = {
      ...formData,
      // Ensure we have the main image (or null if none)
      image: formData.images && formData.images.length > 0 ? formData.images[0] : null,
      // Set gallery images (everything except the first one)
      galleryImages: formData.images && formData.images.length > 1 ? formData.images.slice(1) : [],
      // Ensure SKU is included and properly formatted
      sku: formData.sku ? formData.sku.toUpperCase() : ''
    };
    
    console.log('Processed data for backend:', processedData);
    console.log('Main image:', processedData.image);
    console.log('Gallery images:', processedData.galleryImages);
    console.log('SKU to update:', processedData.sku);
    
    onSave(processedData);
  };

  const categories = [
    { value: 'headphones', label: 'Headphones' },
    { value: 'speakers', label: 'Speakers' },
    { value: 'microphones', label: 'Microphones' },
    { value: 'keyboards-pianos', label: 'Keyboards & Pianos' },
    { value: 'guitars-basses', label: 'Guitars & Basses' },
    { value: 'drums-percussion', label: 'Drums & Percussion' },
    { value: 'studio-equipment', label: 'Studio Equipment' },
    { value: 'dj-speakers', label: 'DJ Speakers' },
    { value: 'earbuds', label: 'Earbuds' },
    { value: 'earphones', label: 'Earphones' },
    { value: 'home-theater', label: 'Home Theater' },
    { value: 'loud-speakers', label: 'Loud Speakers' },
    { value: 'neckband-earphones', label: 'Neckband Earphones' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-brand-lightBlue w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-brand-dark/40 hover:text-brand-dark transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          console.log('Form submit event triggered');
          console.log('Current form values:', values);
          console.log('Current form errors:', errors);
          handleSubmit(onSubmit);
        }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-1 min-w-0 max-w-full">
              <ValidatedInput
                name="name"
                label="Product Name"
                value={values.name}
                error={errors.name}
                touched={touched.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter product name"
                required
                className="min-w-0 max-w-full"
              />
            </div>

            <div className="space-y-1 min-w-0 max-w-full">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <ValidatedInput
                    name="sku"
                    label="SKU"
                    value={values.sku}
                    error={errors.sku}
                    touched={touched.sku}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., ABC12345XY (8-12 alphanumeric chars)"
                    required
                    className="min-w-0 max-w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      console.log('Auto Generate clicked!');
                      console.log('Brand:', values.brand);
                      console.log('Name:', values.name);
                      
                      const newSKU = generateSKUFromProduct(values.brand || '', values.name || '', 8);
                      console.log('Generated SKU:', newSKU);
                      
                      if (newSKU && newSKU.length >= 8 && newSKU.length <= 12) {
                        console.log('Setting SKU:', newSKU);
                        
                        // CORRECT METHOD: ValidatedInput expects onChange(name, value)
                        handleChange('sku', newSKU);
                        
                        console.log('SKU updated successfully');
                        
                        // Verify the update
                        setTimeout(() => {
                          console.log('Final form values:', values);
                        }, 100);
                        
                      } else {
                        console.error('Generated SKU is invalid:', newSKU);
                        alert('Failed to generate valid SKU. Please try again.');
                      }
                    } catch (error) {
                      console.error('Error in auto-generate:', error);
                      alert('Error generating SKU. Please enter manually.');
                    }
                  }}
                  disabled={false} // Always enabled for testing
                  className="px-3 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap transition-colors duration-200 shadow-sm hover:shadow-md"
                  title="Generate SKU automatically"
                >
                  Auto Generate
                </button>
              </div>
              {!values.brand && !values.name && (
                <p className="text-xs text-gray-500">
                  Tip: Fill in the brand and product name first, then click "Auto Generate" for a suggested SKU
                </p>
              )}
            </div>

            <div className="space-y-1 min-w-0 max-w-full">
              <ValidatedInput
                name="brand"
                label="Brand"
                value={values.brand}
                error={errors.brand}
                touched={touched.brand}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter brand name"
                required
                className="min-w-0 max-w-full"
              />
            </div>

            <div className="space-y-1 min-w-0 max-w-full">
              <ValidatedSelect
                name="category"
                label="Category"
                value={values.category}
                error={errors.category}
                touched={touched.category}
                onChange={handleChange}
                onBlur={handleBlur}
                options={categories}
                placeholder="Select a category"
                required
                className="min-w-0 max-w-full"
              />
            </div>

            <div className="space-y-1 min-w-0 max-w-full">
              <ValidatedInput
                name="price"
                label="Price (₹)"
                type="number"
                step="0.01"
                min="0"
                value={values.price}
                error={errors.price}
                touched={touched.price}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                required
                className="min-w-0 max-w-full"
              />
            </div>

            <div className="space-y-1 min-w-0 max-w-full">
              <ValidatedInput
                name="stock"
                label="Stock Quantity"
                type="number"
                min="0"
                value={values.stock}
                error={errors.stock}
                touched={touched.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0"
                required
                className="min-w-0 max-w-full"
              />
            </div>
          </div>

          <div className="space-y-6">
            <ValidatedTextarea
              name="description"
              label="Description"
              value={values.description}
              error={errors.description}
              touched={touched.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter product description..."
              rows={4}
              required
              className="min-w-0"
            />
          </div>

          {/* Image Upload Section - Full Width */}
          <div className="col-span-1 lg:col-span-2">
            <ImageUpload
              key={product?._id || 'new-product'} // Force re-render when product changes
              name="images"
              label="Product Images"
              images={values.images}
              error={errors.images}
              touched={touched.images}
              onChange={handleChange}
              onBlur={handleBlur}
              maxImages={5}
              maxSizePerImageMB={5}
              required
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-brand-lightBlue col-span-1 lg:col-span-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-brand-lightBlue text-brand-dark rounded-xl hover:bg-brand-cream/30 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-brand-blue to-brand-coral text-white rounded-xl hover:from-brand-coral hover:to-brand-blue disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
