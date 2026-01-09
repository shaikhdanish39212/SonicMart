import React, { useEffect, useState, useCallback, useMemo } from 'react';
import adminAPI from '../../utils/adminAPI';
import ProductForm from '../../components/admin/ProductForm';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { formatPrice } from '../../utils/currency';
import { getImageUrl } from '../../utils/imageUrl';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Fixed items per page for performance

  // Paginated products for rendering
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getProducts();
      setProducts(response.data.data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    // Skip confirmation for now, directly delete
    try {
      console.log('Attempting to delete product with ID:', id);
      const response = await adminAPI.deleteProduct(id);
      console.log('Delete response:', response);
      
      // Show success message
      alert('Product deleted successfully!');
      
      // Refresh the product list
      await fetchProducts();
    } catch (err) {
      console.error('Delete product error:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete product';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      console.log('Deleting product:', productToDelete.name);
      const response = await adminAPI.deleteProduct(productToDelete._id);
      console.log('Delete response:', response);
      
      // Close modal
      closeDeleteModal();
      
      // Refresh the product list
      await fetchProducts();
      
      // Show success message (you can replace this with a toast notification)
      setError(null);
      
    } catch (err) {
      console.error('Delete product error:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete product';
      setError(errorMessage);
      
      // Close modal even on error
      closeDeleteModal();
    }
  };

  // Restore deleted product
  const restoreProduct = async (productId) => {
    try {
      console.log('Restoring product with ID:', productId);
      const response = await adminAPI.restoreProduct(productId);
      console.log('Restore response:', response);
      
      // Refresh the product list
      await fetchProducts();
      
      // Clear any errors
      setError(null);
      
    } catch (err) {
      console.error('Restore product error:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to restore product';
      setError(errorMessage);
    }
  };

  const handleSave = async (productData) => {
    try {
      console.log('Saving product data:', productData);
      console.log('Editing product:', editingProduct);
      
      if (editingProduct) {
        console.log('Updating product with ID:', editingProduct._id);
        const response = await adminAPI.updateProduct(editingProduct._id, productData);
        console.log('Update response:', response);
      } else {
        console.log('Creating new product');
        const response = await adminAPI.createProduct(productData);
        console.log('Create response:', response);
      }
      
      console.log('Fetching updated products...');
      await fetchProducts();
      setIsModalOpen(false);
      console.log('Product save completed successfully');
    } catch (err) {
      console.error('Error saving product:', err);
      console.error('Error response:', err.response?.data);
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center p-8">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-coral rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-coral to-red-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-navy mb-2">Loading Products</h3>
        <p className="text-gray-500">Fetching your product inventory...</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-coral rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-coral rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-coral rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-coral to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-navy mb-3">Error Loading Products</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <div className="flex space-x-3">
          <button 
            onClick={fetchProducts}
            className="flex-1 bg-gradient-to-r from-coral to-red-500 hover:from-red-600 hover:to-coral text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-navy px-4 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white" style={{background: 'linear-gradient(to right, #2C3E50, #34495e, #20B2AA)'}}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 sm:mb-6 lg:mb-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Product Management</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Manage your inventory, track stock levels, and optimize your product catalog
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={handleAdd} 
              className="bg-coral hover:bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Products Table */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-6 sm:py-8 lg:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
              Get started by adding your first product to the inventory.
            </p>
            <button 
              onClick={handleAdd}
              className="bg-gradient-to-r from-coral to-red-500 hover:from-red-500 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="border-b border-gray-100 px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center">
                <h3 className="text-base font-semibold text-navy flex items-center">
                  <svg className="w-4 h-4 mr-2 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Products ({products.length})
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white" style={{background: 'linear-gradient(to right, #2C3E50, #34495e)'}}>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm uppercase tracking-wider">Product</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm uppercase tracking-wider">Category</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm uppercase tracking-wider">Price</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm uppercase tracking-wider">Stock</th>
                    <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm uppercase tracking-wider">Status</th>
                    <th className="text-center py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {paginatedProducts.map((product, index) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-2 sm:mr-3 border border-gray-200 group-hover:scale-105 transition-transform">
                            {product.image ? (
                              <img 
                                src={getImageUrl(product.image)} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`${product.image ? 'hidden' : 'flex'} items-center justify-center text-navy font-bold text-sm`}>
                              {product.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-navy text-sm mb-1 truncate">{product.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-2 max-w-xs">
                              {product.description || 'No description available'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal/10 text-navy border border-teal/30">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <div className="font-bold text-navy text-sm">{formatPrice(product.price)}</div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</div>
                        )}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4">
                        <div className="flex items-center">
                          <div className="font-semibold text-navy mr-2 text-sm">{product.stock}</div>
                          <div className={`w-2 h-2 rounded-full ${
                            product.stock > 10 ? 'bg-green-400' : product.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                          !product.isActive
                            ? 'bg-gray-50 text-gray-700 border-gray-200'
                            : product.stock > 10 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : product.stock > 0 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {!product.isActive 
                            ? '🗑️ Deleted' 
                            : product.stock > 10 
                            ? '✅ In Stock' 
                            : product.stock > 0 
                            ? '⚠️ Low Stock' 
                            : '❌ Out of Stock'
                          }
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleEdit(product)} 
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md flex items-center space-x-1"
                            style={{background: 'linear-gradient(to right, #20B2AA, #06b6d4)'}}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          
                          {product.isActive ? (
                            <button 
                              onClick={() => openDeleteModal(product)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md flex items-center space-x-1"
                              style={{background: 'linear-gradient(to right, #FF6B6B, #ef4444)'}}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => restoreProduct(product._id)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md flex items-center space-x-1"
                              style={{background: 'linear-gradient(to right, #10b981, #059669)'}}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 13l-3-3-3 3m3-3v12" />
                              </svg>
                              <span>Restore</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {products.length > itemsPerPage && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => i + 1)
                      .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === Math.ceil(products.length / itemsPerPage))
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-3 py-2 text-sm text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              currentPage === page
                                ? 'bg-coral text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {isModalOpen && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ProductsPage;
