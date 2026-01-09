import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { returnsAPI } from '../utils/api';

const ReturnsPage = () => {
  const [activeTab, setActiveTab] = useState('policy');
  const [returnForm, setReturnForm] = useState({
    orderNumber: '',
    email: '',
    reason: '',
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleInputChange = (e) => {
    setReturnForm({
      ...returnForm,
      [e.target.name]: e.target.value
    });
  };

  const handleReturnRequest = async (e) => {
    e.preventDefault();
    
    if (!returnForm.orderNumber.trim() || !returnForm.email.trim() || !returnForm.reason) {
      setStatus({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const response = await returnsAPI.submitReturn(returnForm);
      
      if (response.success) {
        setStatus({ 
          message: response.message || 'Return request submitted successfully! You will receive an email confirmation within 24 hours.', 
          type: 'success' 
        });
        setReturnForm({ orderNumber: '', email: '', reason: '', comments: '' });
      } else {
        setStatus({ 
          message: response.message || 'Failed to submit return request. Please try again.', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Return request error:', error);
      setStatus({ 
        message: error.message || 'Failed to submit return request. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-coral to-brand-navy text-white py-3 sm:py-4 lg:py-6">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">Audio Equipment Returns & Exchanges</h1>
          <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Hassle-free returns within 30 days for all headphones, speakers, and audio accessories. We understand audio preferences are personal.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('policy')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'policy'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-brand-navy hover:border-brand-gray'
              }`}
            >
              Audio Return Policy
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'process'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-brand-navy hover:border-brand-gray'
              }`}
            >
              How to Return Audio Gear
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'request'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-brand-navy hover:border-brand-gray'
              }`}
            >
              Start Audio Return
            </button>
            <button
              onClick={() => setActiveTab('exchanges')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'exchanges'
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-gray-500 hover:text-brand-navy hover:border-brand-gray'
              }`}
            >
              Audio Exchanges
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          
          {/* Return Policy Tab */}
          {activeTab === 'policy' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-brand-navy mb-6">SonicMart Audio Return Policy</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy mb-3">30-Day Audio Equipment Return Window</h3>
                    <p className="text-gray-700 mb-4">
                      We offer a 30-day return period for all headphones, speakers, and audio accessories from delivery date. Audio equipment must be returned in original condition with all cables, cases, and documentation.
                    </p>
                    <div className="bg-brand-teal bg-opacity-10 border border-brand-teal rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-brand-teal mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <p className="ml-2 text-sm text-brand-teal">
                          <strong>Audio Note:</strong> Return period starts from delivery date. Hygiene caps must be unused for in-ear monitors and earphones.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy mb-3">Audio Equipment Eligibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-brand-teal mb-2">✓ Returnable Audio Products</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Over-ear & On-ear Headphones</li>
                          <li>• Bluetooth & Wired Speakers</li>
                          <li>• Audio Cables & Adapters</li>
                          <li>• Defective Sony/Bose products</li>
                          <li>• Wrong audio equipment received</li>
                          <li>• Soundbars & Home Audio Systems</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-brand-coral mb-2">✗ Non-Returnable Audio Items</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• In-ear monitors with used hygiene caps</li>
                          <li>• Custom audio configurations</li>
                          <li>• Audio equipment damaged by misuse</li>
                          <li>• Products without original audio cases</li>
                          <li>• Items past 30-day audio return window</li>
                          <li>• Opened earphone hygiene accessories</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy mb-3">Audio Equipment Condition Requirements</h3>
                    <div className="bg-brand-cream rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="w-12 h-12 bg-brand-teal bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                          <h4 className="font-medium text-brand-navy mb-1">Original Audio Condition</h4>
                          <p className="text-sm text-gray-600">Untested with all cables & cases</p>
                        </div>
                        <div>
                          <div className="w-12 h-12 bg-brand-teal bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">Complete Package</h4>
                          <p className="text-sm text-gray-600">All accessories included</p>
                        </div>
                        <div>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">Original Packaging</h4>
                          <p className="text-sm text-gray-600">Box and documentation</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Process</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-green-600">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Inspection (1-2 days)</h4>
                          <p className="text-sm text-gray-600">We inspect returned items upon receipt</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-green-600">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Refund Processing (3-5 days)</h4>
                          <p className="text-sm text-gray-600">Approved refunds are processed to original payment method</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-green-600">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Bank Processing (5-7 days)</h4>
                          <p className="text-sm text-gray-600">Your bank may take additional time to reflect the refund</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How to Return Tab */}
          {activeTab === 'process' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return Your Order</h2>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Step-by-step process */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Process</h3>
                      <div className="space-y-6">
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <span className="font-medium text-green-600">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Initiate Return</h4>
                            <p className="text-sm text-gray-600">Go to 'My Orders' or use the 'Start Return' tab on this page</p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <span className="font-medium text-green-600">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Print Return Label</h4>
                            <p className="text-sm text-gray-600">Download and print the prepaid return shipping label</p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <span className="font-medium text-green-600">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Pack Securely</h4>
                            <p className="text-sm text-gray-600">Use original packaging and include all accessories</p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <span className="font-medium text-green-600">4</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Schedule Pickup</h4>
                            <p className="text-sm text-gray-600">Schedule a free pickup or drop at nearest courier center</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What to include */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Include</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-sm text-gray-700">Product in original packaging</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-sm text-gray-700">All accessories and cables</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-sm text-gray-700">User manual and documentation</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-sm text-gray-700">Original invoice (if available)</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-sm text-gray-700">Return slip (generated online)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Return Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Free Pickup</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Schedule a free pickup from your address at your convenience.</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Available in major cities</li>
                          <li>• Pickup within 24-48 hours</li>
                          <li>• SMS/Email confirmation</li>
                        </ul>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Drop-off Center</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Drop your return package at the nearest authorized center.</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• 500+ locations nationwide</li>
                          <li>• Extended hours available</li>
                          <li>• Instant receipt confirmation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Start Return Tab */}
          {activeTab === 'request' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Your Return</h2>
                
                <form onSubmit={handleReturnRequest} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Order Number *</label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={returnForm.orderNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                      placeholder="e.g., ORD123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={returnForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Reason for Return *</label>
                    <select
                      name="reason"
                      value={returnForm.reason}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    >
                      <option value="">Select a reason</option>
                      <option value="defective">Product is defective</option>
                      <option value="damaged-shipping">Item arrived damaged</option>
                      <option value="wrong-item">Wrong item received</option>
                      <option value="not-as-described">Not as described</option>
                      <option value="changed-mind">Changed my mind</option>
                      <option value="compatibility-issues">Compatibility issues</option>
                      <option value="poor-quality">Poor quality</option>
                      <option value="other">Other reason</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Additional Comments</label>
                    <textarea
                      name="comments"
                      value={returnForm.comments}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                      placeholder="Please provide any additional details about your return..."
                    ></textarea>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 mb-1">What happens next?</p>
                        <p className="text-blue-700">
                          After submitting this form, we'll email you a prepaid return label and pickup instructions within 2 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Message */}
                  {status.message && (
                    <div className={`p-4 rounded-lg ${
                      status.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center">
                        {status.type === 'success' ? (
                          <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                        )}
                        <p className="font-medium">{status.message}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${
                      loading 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Request...
                      </div>
                    ) : (
                      'Submit Return Request'
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    Need help? <Link to="/contact" className="text-green-600 hover:text-green-700 font-medium">Contact our support team</Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Exchanges Tab */}
          {activeTab === 'exchanges' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Exchanges</h2>
                
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Exchange Policy</h3>
                    <p className="text-blue-800">
                      We offer exchanges for size, color, or model changes within 30 days of delivery. 
                      The exchange item must be available in stock and of equal or higher value.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How Exchanges Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                            <path fillRule="evenodd" d="M3 8a2 2 0 012-2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Select Exchange Item</h4>
                        <p className="text-sm text-gray-600">Choose the new product you want in exchange</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2L3 8v10h14V8l-7-6zM8 18v-5h4v5H8z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Send Original Back</h4>
                        <p className="text-sm text-gray-600">Pack and ship your original item using our prepaid label</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414L15 8.414V9a1 1 0 102 0V7a1 1 0 00-1-1H8z"/>
                            <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414L5 12.586V12a1 1 0 10-2 0v2a1 1 0 001 1h8z"/>
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Receive New Item</h4>
                        <p className="text-sm text-gray-600">Your exchange item will be shipped once we receive the original</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Options</h3>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Same Product, Different Size/Color</h4>
                            <p className="text-sm text-gray-600 mt-1">Exchange for the same model in different specifications</p>
                          </div>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Free</span>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Different Product, Same Price</h4>
                            <p className="text-sm text-gray-600 mt-1">Exchange for a different model of equal value</p>
                          </div>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Free</span>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Upgrade to Higher Value Product</h4>
                            <p className="text-sm text-gray-600 mt-1">Exchange for a more expensive model</p>
                          </div>
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">Pay Difference</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <h4 className="font-medium text-amber-900 mb-1">Exchange Limitations</h4>
                        <ul className="text-sm text-amber-800 space-y-1">
                          <li>• Exchanges are subject to product availability</li>
                          <li>• Original item must be in returnable condition</li>
                          <li>• Price differences are non-refundable if exchanging for lower value item</li>
                          <li>• Exchanges cannot be processed for discontinued products</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setActiveTab('request')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 mr-4"
                    >
                      Start Exchange Process
                    </button>
                    <Link
                      to="/contact"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Need Help with Exchange?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReturnsPage;