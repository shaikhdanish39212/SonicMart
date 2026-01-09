import React, { useEffect, useState } from 'react';
import adminAPI from '../../utils/adminAPI';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    maxUsage: '',
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCoupons();
      setCoupons(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to load coupons');
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      maxUsage: '',
      validFrom: '',
      validUntil: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      maxUsage: coupon.maxUsage || '',
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : '',
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : '',
      isActive: coupon.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const couponData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
        validFrom: formData.validFrom ? new Date(formData.validFrom) : new Date(),
        validUntil: new Date(formData.validUntil)
      };

      if (editingCoupon) {
        await adminAPI.updateCoupon(editingCoupon._id, couponData);
      } else {
        await adminAPI.createCoupon(couponData);
      }

      setIsModalOpen(false);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to save coupon:', error);
      alert('Failed to save coupon. Please try again.');
    }
  };

  const handleDelete = async (couponId) => {
    setCouponToDelete(couponId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    
    setIsDeleting(true);
    try {
      await adminAPI.deleteCoupon(couponToDelete);
      await fetchCoupons(); // Refresh the coupon list
      setDeleteModalOpen(false);
      setCouponToDelete(null);
      
      // Show success notification
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = '✅ Coupon deleted successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      setError('Failed to delete coupon. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCouponToDelete(null);
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-50 text-green-700 border border-green-200' 
      : 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-brand-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-coral to-brand-navy rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-white mb-4 sm:mb-6">
        <div className="flex flex-col space-y-2 sm:space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-white">Coupon Management</h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg">
              Create and manage discount coupons for your store
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 sm:py-3 border border-white/20 min-w-[120px] sm:min-w-[140px] text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{coupons.length}</div>
              <div className="text-xs sm:text-sm text-white/90 whitespace-nowrap">Total Coupons</div>
            </div>
            <button
              onClick={handleAdd}
              className="bg-brand-teal hover:bg-brand-navy text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2 whitespace-nowrap text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add New Coupon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {coupons.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-base mb-3">No coupons found</div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-brand-coral text-white rounded-lg hover:bg-brand-navy transition-colors text-sm"
            >
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Code</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Discount</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Min Order</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Usage</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Valid Until</th>
                  <th className="text-center p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Status</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-brand-teal/10 text-brand-navy border border-brand-teal/20">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="font-medium text-gray-900 text-sm">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}%` 
                          : `₹${coupon.discountValue}`
                        }
                      </div>
                      {coupon.maxDiscountAmount && (
                        <div className="text-xs text-gray-500">Max: ₹{coupon.maxDiscountAmount}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900">₹{coupon.minOrderAmount || 0}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900">
                        {coupon.usageCount || 0}
                        {coupon.maxUsage ? ` / ${coupon.maxUsage}` : ' / ∞'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`text-sm ${isExpired(coupon.validUntil) ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDateTime(coupon.validUntil)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(coupon.isActive)}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${coupon.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {isExpired(coupon.validUntil) && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <div className="w-2 h-2 rounded-full mr-2 bg-red-500"></div>
                            Expired
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Coupon Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input"
                    style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                    placeholder="SAVE20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input"
                    style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step={formData.discountType === 'percentage' ? '0.01' : '1'}
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input"
                    style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                    placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.discountType === 'percentage' ? 'Percentage (0-100)' : 'Amount in ₹'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input"
                    style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input"
                    style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                    placeholder="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no limit</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Usage Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({...formData, maxUsage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input"
                    style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input"
                    style={{ backgroundColor: '#ffffff', color: '#1f2937', colorScheme: 'light' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input"
                    style={{ backgroundColor: '#ffffff', color: '#1f2937', colorScheme: 'light' }}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-brand-teal border-gray-300 rounded focus:ring-brand-teal"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (coupon can be used)
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-coral text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Modal Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Coupon
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this coupon? This action cannot be undone and will permanently remove the coupon from your store.
              </p>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Coupon'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;