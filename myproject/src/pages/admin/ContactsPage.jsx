import React, { useEffect, useState } from 'react';
import adminAPI from '../../utils/adminAPI';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });

  // Date formatting function
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getContacts(filters);
      console.log('Contacts API Response:', response.data); // Debug log
      if (response.data && response.data.data && response.data.data.contacts) {
        setContacts(response.data.data.contacts);
      } else {
        setContacts([]);
      }
      setError(null);
    } catch (error) {
      setError('Failed to load contacts');
      console.error('Failed to fetch contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contactId) => {
    try {
      const response = await adminAPI.getContactById(contactId);
      console.log('Contact details response:', response.data); // Debug log
      if (response.data && response.data.data) {
        setSelectedContact(response.data.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch contact details:', error);
    }
  };

  const handleUpdateStatus = async (contactId, newStatus) => {
    try {
      await adminAPI.updateContact(contactId, { status: newStatus });
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    setContactToDelete(contactId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    
    setIsDeleting(true);
    try {
      await adminAPI.deleteContact(contactToDelete);
      await fetchContacts(); // Refresh the contact list
      setDeleteModalOpen(false);
      setContactToDelete(null);
      
      // Show success notification
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = '✅ Contact deleted successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Failed to delete contact:', error);
      setError('Failed to delete contact. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setContactToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    <div className="p-4 sm:p-6 bg-brand-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-white mb-4 sm:mb-6" style={{background: 'linear-gradient(to right, #2C3E50, #34495e, #20B2AA)'}}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-3 sm:mb-4 lg:mb-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Contact Management</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
              Manage customer inquiries and support requests
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border border-white/20">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{contacts.length}</div>
              <div className="text-xs sm:text-sm opacity-90">Total Contacts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-3 sm:mb-4">
        <div className="flex flex-wrap gap-2 sm:gap-4 p-3 sm:p-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-gray-900 admin-form-input text-sm"
            style={{ backgroundColor: '#ffffff', color: '#1f2937', colorScheme: 'light' }}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={fetchContacts}
            className="px-4 py-1.5 bg-brand-coral text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {contacts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-base">No contacts found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-sm">Name</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-sm">Email</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-sm">Subject</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-sm">Priority</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-sm">Date</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600 text-sm">{contact.email}</div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="text-gray-900 max-w-xs truncate text-sm">{contact.subject}</div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(contact.priority)}`}>
                        {contact.priority}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="text-gray-600 text-xs sm:text-sm">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="flex space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleViewContact(contact._id)}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs font-medium transition-colors"
                        >
                          View
                        </button>
                        <select
                          value={contact.status}
                          onChange={(e) => handleUpdateStatus(contact._id, e.target.value)}
                          className="px-1 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-brand-teal bg-white text-gray-900 admin-form-input"
                          style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
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

      {/* Contact Details Modal */}
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{selectedContact.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{selectedContact.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900">{selectedContact.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Message</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedContact.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(selectedContact.status)}`}>
                      {selectedContact.status}
                    </span>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(selectedContact.priority)}`}>
                      {selectedContact.priority}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Date Submitted</label>
                <p className="text-gray-900">{new Date(selectedContact.createdAt).toLocaleString()}</p>
              </div>

              {selectedContact.adminNotes && selectedContact.adminNotes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Admin Notes</label>
                  <div className="space-y-2">
                    {selectedContact.adminNotes.map((note, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-900">{note.note}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By {note.addedBy} on {new Date(note.addedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                Delete Contact
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this contact? This action cannot be undone and will permanently remove the contact message from your system.
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
                    'Delete Contact'
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

export default ContactsPage;