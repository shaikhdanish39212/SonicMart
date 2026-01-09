import React, { useState } from 'react';

const BulkActions = ({ 
  selectedItems, 
  onClearSelection, 
  onBulkAction, 
  actionType = 'users', // 'users' or 'products'
  isLoading = false 
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [bulkUpdateData, setBulkUpdateData] = useState({});

  const selectedCount = selectedItems.length;

  const userActions = [
    { id: 'activate', label: 'Activate Users', icon: '✅', confirmRequired: false },
    { id: 'deactivate', label: 'Deactivate Users', icon: '❌', confirmRequired: true },
    { id: 'suspend', label: 'Suspend Users', icon: '⏸️', confirmRequired: true },
    { id: 'delete', label: 'Delete Users', icon: '🗑️', confirmRequired: true, dangerous: true },
    { id: 'change-role', label: 'Change Role', icon: '👤', confirmRequired: false, hasOptions: true },
    { id: 'send-email', label: 'Send Email', icon: '📧', confirmRequired: false, hasOptions: true }
  ];

  const productActions = [
    { id: 'activate', label: 'Activate Products', icon: '✅', confirmRequired: false },
    { id: 'deactivate', label: 'Deactivate Products', icon: '❌', confirmRequired: true },
    { id: 'delete', label: 'Delete Products', icon: '🗑️', confirmRequired: true, dangerous: true },
    { id: 'update-category', label: 'Update Category', icon: '📂', confirmRequired: false, hasOptions: true },
    { id: 'update-price', label: 'Update Prices', icon: '💰', confirmRequired: false, hasOptions: true },
    { id: 'update-stock', label: 'Update Stock', icon: '📦', confirmRequired: false, hasOptions: true },
    { id: 'export', label: 'Export Selected', icon: '📤', confirmRequired: false }
  ];

  const actions = actionType === 'users' ? userActions : productActions;

  const handleActionClick = (action) => {
    if (action.confirmRequired || action.hasOptions) {
      setPendingAction(action);
      setShowConfirmModal(true);
      if (action.hasOptions) {
        setBulkUpdateData({});
      }
    } else {
      onBulkAction(action.id, selectedItems);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      onBulkAction(pendingAction.id, selectedItems, bulkUpdateData);
      setShowConfirmModal(false);
      setPendingAction(null);
      setBulkUpdateData({});
    }
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
    setBulkUpdateData({});
  };

  const renderActionOptions = () => {
    if (!pendingAction?.hasOptions) return null;

    switch (pendingAction.id) {
      case 'change-role':
        return (
          <div className="mb-4">
            <label htmlFor="bulk-role-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select New Role:
            </label>
            <select
              id="bulk-role-select"
              name="bulkRoleSelect"
              value={bulkUpdateData.role || ''}
              onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        );

      case 'send-email':
        return (
          <div className="mb-4 space-y-3">
            <div>
              <label htmlFor="bulk-email-subject" className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject:
              </label>
              <input
                id="bulk-email-subject"
                name="bulkEmailSubject"
                type="text"
                value={bulkUpdateData.subject || ''}
                onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <label htmlFor="bulk-email-message" className="block text-sm font-medium text-gray-700 mb-2">
                Email Message:
              </label>
              <textarea
                id="bulk-email-message"
                name="bulkEmailMessage"
                value={bulkUpdateData.message || ''}
                onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
                rows={4}
                placeholder="Enter email message"
              />
            </div>
          </div>
        );

      case 'update-category':
        return (
          <div className="mb-4">
            <label htmlFor="bulk-category-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select New Category:
            </label>
            <select
              id="bulk-category-select"
              name="bulkCategorySelect"
              value={bulkUpdateData.category || ''}
              onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
            </select>
          </div>
        );

      case 'update-price':
        return (
          <div className="mb-4 space-y-3">
            <div>
              <label htmlFor="bulk-price-type" className="block text-sm font-medium text-gray-700 mb-2">
                Price Update Type:
              </label>
              <select
                id="bulk-price-type"
                name="bulkPriceType"
                value={bulkUpdateData.priceType || ''}
                onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, priceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="">Select Update Type</option>
                <option value="percentage">Percentage Change</option>
                <option value="fixed">Fixed Amount Change</option>
                <option value="set">Set Fixed Price</option>
              </select>
            </div>
            <div>
              <label htmlFor="bulk-price-value" className="block text-sm font-medium text-gray-700 mb-2">
                Value:
              </label>
              <input
                id="bulk-price-value"
                name="bulkPriceValue"
                type="number"
                value={bulkUpdateData.priceValue || ''}
                onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, priceValue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
                placeholder="Enter value"
              />
            </div>
          </div>
        );

      case 'update-stock':
        return (
          <div className="mb-4 space-y-3">
            <div>
              <label htmlFor="bulk-stock-type" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Update Type:
              </label>
              <select
                id="bulk-stock-type"
                name="bulkStockType"
                value={bulkUpdateData.stockType || ''}
                onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, stockType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="">Select Update Type</option>
                <option value="add">Add to Stock</option>
                <option value="subtract">Subtract from Stock</option>
                <option value="set">Set Stock Level</option>
              </select>
            </div>
            <div>
              <label htmlFor="bulk-stock-value" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity:
              </label>
              <input
                id="bulk-stock-value"
                name="bulkStockValue"
                type="number"
                value={bulkUpdateData.stockValue || ''}
                onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, stockValue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
                placeholder="Enter quantity"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="bg-coral/5 border border-coral/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-coral">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-sm text-coral hover:text-coral-dark underline"
            >
              Clear selection
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  action.dangerous
                    ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
                    : 'bg-coral text-white hover:bg-coral-dark disabled:bg-coral/50'
                } disabled:cursor-not-allowed`}
              >
                <span className="mr-1">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {pendingAction?.label}
            </h3>
            
            {pendingAction?.confirmRequired && (
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to {pendingAction.label.toLowerCase()} {selectedCount} item{selectedCount !== 1 ? 's' : ''}?
                {pendingAction.dangerous && (
                  <span className="block mt-2 text-red-600 font-medium">
                    This action cannot be undone.
                  </span>
                )}
              </p>
            )}

            {renderActionOptions()}

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelAction}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  pendingAction?.dangerous
                    ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
                    : 'bg-coral text-white hover:bg-coral-dark disabled:bg-coral/50'
                } disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;