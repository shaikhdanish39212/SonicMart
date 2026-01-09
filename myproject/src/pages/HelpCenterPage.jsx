import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'All Topics', icon: '🔍' },
    { id: 'orders', name: 'Orders & Shipping', icon: '📦' },
    { id: 'returns', name: 'Returns & Refunds', icon: '↩️' },
    { id: 'products', name: 'Product Support', icon: '🎧' },
    { id: 'account', name: 'Account & Billing', icon: '👤' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
    { id: 'warranty', name: 'Warranty', icon: '🛡️' }
  ];

  const helpTopics = [
    {
      id: 1,
      title: "How to track my headphone order?",
      category: "orders",
      answer: "Once your SonicMart order is placed, you'll receive a tracking number via email and SMS. Track your premium audio equipment from our dashboard or use the real-time tracking link provided.",
      popularity: "high"
    },
    {
      id: 2,
      title: "What is SonicMart's return policy for audio products?",
      category: "returns",
      answer: "We offer 30-day hassle-free returns on all headphones, speakers, and audio accessories. Items must be in original condition with all accessories and original packaging. Note: Hygiene caps must be unused for in-ear products.",
      popularity: "high"
    },
    {
      id: 3,
      title: "How to claim warranty on Sony/Bose headphones?",
      category: "warranty",
      answer: "Login to your SonicMart account, go to 'My Orders', select your audio product, and click 'Warranty Claim'. Upload purchase invoice and product photos. Our audio experts will guide you through manufacturer warranty process.",
      popularity: "high"
    },
    {
      id: 4,
      title: "My Bluetooth headphones won't connect",
      category: "technical",
      answer: "Try these audio troubleshooting steps: 1) Reset Bluetooth on your device 2) Clear pairing history 3) Hold power+volume down for 10 seconds to reset headphones 4) Check battery level. Our audio specialists can help if issues persist.",
      popularity: "medium"
    },
    {
      id: 5,
      title: "How to change delivery address for speaker orders?",
      category: "orders",
      answer: "Change delivery address before your SonicMart order ships. Go to 'My Orders', find your audio equipment order, and click 'Edit Address'. For heavy speakers already shipped, contact our logistics team immediately.",
      popularity: "medium"
    },
    {
      id: 6,
      title: "Payment methods for premium audio equipment",
      category: "account",
      answer: "SonicMart accepts Credit/Debit cards, Net Banking, UPI, Digital Wallets (Paytm, PhonePe), EMI options for expensive audio gear, and Cash on Delivery (COD) for orders under ₹25,000.",
      popularity: "medium"
    },
    {
      id: 7,
      title: "How to cancel my headphone order?",
      category: "orders",
      answer: "Cancel SonicMart orders within 1 hour of placement if not processed. Go to 'My Orders' and click 'Cancel Order'. For custom audio setups already in production, cancellation fees may apply.",
      popularity: "high"
    },
    {
      id: 8,
      title: "Audio equipment comparison guide",
      category: "products",
      answer: "Use our SonicMart comparison tool to compare headphone specs, speaker power ratings, and audio quality features. Click 'Compare' on product pages or visit our Audio Comparison Center.",
      popularity: "low"
    }
  ];

  const filteredTopics = helpTopics.filter(topic => {
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-coral to-brand-navy text-white py-3 sm:py-4 lg:py-6">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">SonicMart Help Center</h1>
          <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 max-w-2xl mx-auto">
            Get expert help with your audio equipment and find answers to your sound questions
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-4 sm:py-6 lg:py-8 bg-white">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-navy mb-4 sm:mb-6 text-center">Quick Audio Support Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Link to="/orders" className="bg-gradient-to-br from-brand-cream to-brand-gray p-3 sm:p-4 lg:p-6 rounded-xl border border-brand-teal hover:shadow-lg transition-shadow group">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎧</div>
              <h3 className="font-semibold text-brand-navy mb-2 text-sm sm:text-base">Track Audio Order</h3>
              <p className="text-sm text-gray-600 group-hover:text-brand-teal transition-colors">Check your headphone/speaker delivery status</p>
            </Link>
            <Link to="/returns" className="bg-gradient-to-br from-brand-cream to-brand-gray p-6 rounded-xl border border-brand-coral hover:shadow-lg transition-shadow group">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-semibold text-brand-navy mb-2">Return Audio Gear</h3>
              <p className="text-sm text-gray-600 group-hover:text-brand-coral transition-colors">Return or exchange audio equipment</p>
            </Link>
            <Link to="/warranty" className="bg-gradient-to-br from-brand-cream to-brand-gray p-6 rounded-xl border border-brand-teal hover:shadow-lg transition-shadow group">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-brand-navy mb-2">Audio Warranty</h3>
              <p className="text-sm text-gray-600 group-hover:text-brand-teal transition-colors">Claim warranty on Sony, Bose & more</p>
            </Link>
            <Link to="/contact" className="bg-gradient-to-br from-brand-cream to-brand-gray p-6 rounded-xl border border-brand-coral hover:shadow-lg transition-shadow group">
              <div className="text-3xl mb-3">�</div>
              <h3 className="font-semibold text-brand-navy mb-2">Audio Expert Help</h3>
              <p className="text-sm text-gray-600 group-hover:text-brand-coral transition-colors">Get help from our sound specialists</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="py-16">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Help Categories</h3>
                <div className="space-y-2">
                  {helpCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        activeCategory === category.id
                          ? 'bg-brand-teal bg-opacity-20 text-brand-teal font-medium'
                          : 'hover:bg-brand-gray text-brand-navy'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Help Topics */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <div key={topic.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <details className="group">
                        <summary className="p-6 cursor-pointer hover:bg-brand-gray transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <h3 className="text-lg font-medium text-brand-navy group-open:text-brand-teal">
                                {topic.title}
                              </h3>
                              {topic.popularity === 'high' && (
                                <span className="bg-brand-coral bg-opacity-20 text-brand-coral text-xs px-2 py-1 rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        </summary>
                        <div className="px-6 pb-6">
                          <div className="pt-4 border-t border-brand-gray">
                            <p className="text-gray-700 leading-relaxed">{topic.answer}</p>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="text-4xl mb-4">🎵</div>
                    <h3 className="text-lg font-medium text-brand-navy mb-2">No audio help topics found</h3>
                    <p className="text-gray-600">Try different keywords or browse our audio equipment categories</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-gradient-to-r from-brand-coral to-brand-navy py-16">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still Need Audio Expert Help?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our sound specialists are here to help with any headphone, speaker, or audio equipment questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-brand-coral px-8 py-3 rounded-lg font-medium hover:bg-brand-cream transition-colors"
            >
              Contact Audio Experts
            </Link>
            <a
              href="tel:1800SONIC01"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-coral transition-colors"
            >
              Call 1800-SONIC-01
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;