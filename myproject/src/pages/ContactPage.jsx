import React, { useState } from 'react';
import { footerAPI } from '../utils/api';
import { contactInfo } from '../config/contactInfo';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', type: '' });
    
    try {
      const response = await footerAPI.submitContact(formData);
      setStatus({
        loading: false,
        message: response.message || 'Thank you for your message! We\'ll get back to you within 24 hours.',
        type: 'success'
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        loading: false,
        message: error.message || 'Failed to send message. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-coral to-brand-navy text-white py-3 sm:py-4 lg:py-6">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">Contact SonicMart</h1>
          <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Connect with our audio specialists. Whether you need product recommendations, technical support, or have questions about your order, we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-brand-navy mb-8">Connect With Our Audio Experts</h2>
              
              <div className="space-y-6">
                {/* Phone (from footer data) */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-brand-navy">Phone Support</h3>
                    <p className="text-brand-navy/70">📞 {contactInfo.phone.primary}</p>
                    <p className="text-sm text-brand-teal font-medium mt-1">{contactInfo.phone.hours}</p>
                  </div>
                </div>

                {/* Email (from footer data) */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-brand-teal rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-brand-navy">Email Support</h3>
                    <p className="text-brand-navy/70">✉️ {contactInfo.email.support}</p>
                    <p className="text-sm text-brand-teal font-medium mt-1">We respond quickly (usually within 1 hour)</p>
                  </div>
                </div>

                {/* Address (from footer data) */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-brand-navy">Experience Center</h3>
                    <p className="text-brand-navy/70">🏢 {contactInfo.address.label}</p>
                    <p className="text-brand-navy/70">📍 {contactInfo.address.full}</p>
                    <p className="text-sm text-brand-teal font-medium mt-1">{contactInfo.address.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social Media (from footer data) */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-brand-navy mb-4">Follow SonicMart</h3>
                <div className="flex space-x-4">
                  <a href={contactInfo.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand-coral rounded-lg flex items-center justify-center text-white hover:bg-brand-navy transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href={contactInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand-teal rounded-lg flex items-center justify-center text-white hover:bg-brand-navy transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href={contactInfo.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href={contactInfo.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white hover:bg-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Get Audio Expert Help</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brand-navy mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-navy mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brand-navy mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-navy mb-2">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                      >
                        <option value="">Select audio help topic</option>
                        <option value="headphone-inquiry">Headphone Recommendations</option>
                        <option value="speaker-setup">Speaker Setup & Installation</option>
                        <option value="technical-help">Audio Equipment Troubleshooting</option>
                        <option value="warranty">Audio Product Warranty</option>
                        <option value="order-support">Order & Delivery Support</option>
                        <option value="bulk-purchase">Bulk/Corporate Audio Purchase</option>
                        <option value="other">Other Audio Questions</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                      placeholder="Describe your audio needs or technical issue..."
                    ></textarea>
                  </div>

                  {status.message && (
                    <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-brand-teal bg-opacity-20 text-brand-teal border border-brand-teal' : 'bg-brand-coral bg-opacity-20 text-brand-coral border border-brand-coral'}`}>
                      {status.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full bg-brand-coral text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-navy transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status.loading ? 'Contacting Audio Experts...' : 'Get Audio Expert Help'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-center text-brand-navy mb-12">Audio Support FAQs</h2>
          <div className="space-y-6">
            <div className="border border-brand-teal rounded-lg p-6 bg-white">
              <h3 className="text-lg font-medium text-brand-navy mb-2">What are SonicMart's audio expert hours?</h3>
              <p className="text-gray-600">Our audio specialists are available Monday to Sunday from 10 AM to 9 PM IST. For urgent technical issues, email help@sonicmart.in anytime.</p>
            </div>
            <div className="border border-brand-teal rounded-lg p-6 bg-white">
              <h3 className="text-lg font-medium text-brand-navy mb-2">Can I test headphones before buying?</h3>
              <p className="text-gray-600">Absolutely! Visit our Experience Center in Koramangala, Bangalore for hands-on demos of Sony, Bose, JBL and all premium audio brands. Our specialists will help you find the perfect sound.</p>
            </div>
            <div className="border border-brand-teal rounded-lg p-6 bg-white">
              <h3 className="text-lg font-medium text-brand-navy mb-2">How do I track my headphone/speaker order?</h3>
              <p className="text-gray-600">Once your SonicMart order ships, you'll receive real-time tracking via email and SMS. Track your premium audio equipment from your dashboard or the provided link.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;