import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const TermsOfServicePage = () => {
  // Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms of Service - SonicMart</title>
        <meta name="description" content="Read SonicMart's Terms of Service including user responsibilities, service availability, and legal agreements." />
      </Helmet>

      <div className="min-h-screen bg-brand-gray py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-navy mb-2 sm:mb-3">Terms of Service</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Last updated: September 26, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using SonicMart's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Use of the Service</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-brand-coral pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Permitted Use</h3>
                  <p className="text-gray-700 mb-2">You may use our service to:</p>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Browse and purchase audio products and accessories</li>
                    <li>• Create and manage your account</li>
                    <li>• Access customer support services</li>
                    <li>• Participate in reviews and ratings</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Prohibited Activities</h3>
                  <p className="text-gray-700 mb-2">You agree not to:</p>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Use the service for any unlawful purpose</li>
                    <li>• Attempt to gain unauthorized access to any part of the service</li>
                    <li>• Upload malicious content or viruses</li>
                    <li>• Interfere with the proper working of the service</li>
                    <li>• Impersonate any person or entity</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Account Registration</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To access certain features of our service, you must register for an account. When you register, you agree to provide accurate, current, and complete information and to keep your account information updated.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-yellow-800">
                  <strong>Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Product Information & Availability</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We strive to provide accurate product information, but we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, or error-free.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-brand-gray p-4 rounded-lg">
                    <h4 className="font-semibold text-brand-navy mb-2">Product Availability</h4>
                    <p className="text-sm text-gray-600">All products are subject to availability and may be discontinued without notice.</p>
                  </div>
                  <div className="bg-brand-gray p-4 rounded-lg">
                    <h4 className="font-semibold text-brand-navy mb-2">Pricing</h4>
                    <p className="text-sm text-gray-600">Prices are subject to change without notice. We reserve the right to modify prices at any time.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Orders & Payment</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-brand-teal pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Order Acceptance</h3>
                  <p className="text-gray-700">
                    Your receipt of an order confirmation does not signify our acceptance of your order. We reserve the right to accept or decline any order for any reason.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Payment Terms</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Payment is due at the time of purchase</li>
                    <li>• We accept major credit cards, debit cards, and digital wallets</li>
                    <li>• All payments are processed securely through encrypted channels</li>
                    <li>• You are responsible for any applicable taxes and fees</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Shipping & Delivery</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We will make reasonable efforts to deliver products within the estimated timeframes, but delivery dates are not guaranteed. Risk of loss and title pass to you upon delivery to the carrier.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-blue-800">
                  <strong>Shipping Delays:</strong> We are not responsible for delays caused by events beyond our control, including but not limited to weather, natural disasters, or carrier delays.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Returns & Refunds</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our return policy allows for returns within 30 days of purchase for most items. Please refer to our detailed Return Policy for complete terms and conditions.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-brand-gray">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-brand-navy">Product Category</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-brand-navy">Return Window</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-brand-navy">Condition Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">Headphones & Earphones</td>
                      <td className="border border-gray-300 px-4 py-3">30 days</td>
                      <td className="border border-gray-300 px-4 py-3">Unopened packaging</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">Speakers & Audio Systems</td>
                      <td className="border border-gray-300 px-4 py-3">15 days</td>
                      <td className="border border-gray-300 px-4 py-3">Original condition</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">Accessories</td>
                      <td className="border border-gray-300 px-4 py-3">30 days</td>
                      <td className="border border-gray-300 px-4 py-3">Unused condition</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The SonicMart website and its content, including but not limited to text, graphics, logos, images, and software, are the property of SonicMart and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                <p className="text-purple-800">
                  <strong>Usage Rights:</strong> You are granted a limited, non-exclusive license to access and use the site for personal, non-commercial purposes only.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">User-Generated Content</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  When you submit reviews, ratings, or other content to our site, you grant us a perpetual, irrevocable, worldwide license to use, reproduce, modify, and display that content.
                </p>
                <div className="border-l-4 border-orange-400 pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Content Guidelines</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Content must be honest and based on genuine experience</li>
                    <li>• No offensive, defamatory, or inappropriate language</li>
                    <li>• No spam, promotional content, or competitor references</li>
                    <li>• Respect intellectual property rights of others</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the fullest extent permitted by law, SonicMart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
              </p>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="text-red-800">
                  <strong>Maximum Liability:</strong> Our total liability for any claims arising from your use of the service shall not exceed the amount paid by you for the specific product or service giving rise to the claim.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Governing Law</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-brand-gray p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2">Email</h4>
                    <p className="text-gray-700">legal@sonicmart.in</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2">Phone</h4>
                    <p className="text-gray-700">1800-SONIC-01 (Toll Free)</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-brand-navy mb-2">Address</h4>
                    <p className="text-gray-700">SonicMart Technologies Pvt Ltd<br />Electronic City, Bangalore - 560100, India</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-brand-gray p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-brand-navy mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to update these Terms of Service at any time. Material changes will be notified to users via email or prominent site notice. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;