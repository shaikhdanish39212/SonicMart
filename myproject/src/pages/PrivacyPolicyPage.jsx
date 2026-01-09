import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-coral to-brand-navy text-white py-3 sm:py-4 lg:py-6">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">SonicMart Privacy Policy</h1>
          <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Your audio preferences and privacy are important to us. Learn how we protect your personal information while delivering the best audio experience.
          </p>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 sm:mt-3">Last updated: September 26, 2025</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-gray-700 text-lg leading-relaxed">
                SonicMart Private Limited ("we," "our," or "us") is committed to protecting your privacy and personal information 
                while providing India's best audio equipment shopping experience. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website <strong>www.sonicmart.in</strong>, use our mobile 
                application, or interact with our audio specialists at our Experience Centers.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-brand-navy mb-6">Audio Information We Collect</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-4">Personal & Audio Preference Information</h3>
                  <div className="bg-brand-cream rounded-lg p-6 border border-brand-teal">
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Contact Information:</strong> Name, email address, phone number, delivery address for audio equipment</li>
                      <li>• <strong>Audio Account Information:</strong> Username, password, audio preferences, wishlist</li>
                      <li>• <strong>Payment Information:</strong> Credit/debit card details, billing address, audio equipment purchase history</li>
                      <li>• <strong>Audio Preferences:</strong> Headphone types, speaker preferences, brand preferences (Sony, Bose, JBL)</li>
                      <li>• <strong>Identity Information:</strong> Government-issued ID for high-value audio equipment verification</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-4">Automatically Collected Audio Usage Information</h3>
                  <div className="bg-brand-teal bg-opacity-10 rounded-lg p-6 border border-brand-teal">
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Device Information:</strong> IP address, browser type, mobile device for audio app usage</li>
                      <li>• <strong>Audio Shopping Data:</strong> Headphone searches, speaker comparisons, audio category preferences</li>
                      <li>• <strong>Location Data:</strong> Approximate location for Experience Center recommendations and audio delivery</li>
                      <li>• <strong>Audio Cookies:</strong> Session data, audio product preferences, personalized recommendations</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-brand-navy mb-4">Information from Audio Partners</h3>
                  <div className="bg-brand-coral bg-opacity-10 rounded-lg p-6 border border-brand-coral">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Sony, Bose, JBL and other premium audio brand partnerships</li>
                      <li>• Payment processors for high-value audio equipment purchases</li>
                      <li>• Audio equipment delivery and logistics partners</li>
                      <li>• Audio marketing partners and audiophile communities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Service Delivery</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Process and fulfill orders</li>
                    <li>• Provide customer support</li>
                    <li>• Send order confirmations and updates</li>
                    <li>• Handle returns and exchanges</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Account Management</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create and manage your account</li>
                    <li>• Authenticate your identity</li>
                    <li>• Personalize your experience</li>
                    <li>• Save your preferences</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Marketing & Communication</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Send promotional emails (with consent)</li>
                    <li>• Show relevant advertisements</li>
                    <li>• Conduct surveys and research</li>
                    <li>• Announce new products and offers</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Business Operations</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Analyze website usage and performance</li>
                    <li>• Prevent fraud and abuse</li>
                    <li>• Comply with legal obligations</li>
                    <li>• Improve our services</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Share Your Information</h2>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-amber-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">We Never Sell Your Personal Data</h4>
                    <p className="text-amber-800 text-sm">
                      We do not sell, rent, or lease your personal information to third parties for their marketing purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Service Providers</h4>
                  <p className="text-gray-600 text-sm mb-2">We share information with trusted partners who help us operate our business:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Payment processors (Razorpay, Stripe)</li>
                    <li>• Shipping and delivery companies</li>
                    <li>• Cloud storage and hosting providers</li>
                    <li>• Analytics and marketing platforms</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Legal Requirements</h4>
                  <p className="text-gray-600 text-sm">
                    We may disclose your information when required by law, to protect our rights, 
                    or to comply with legal processes such as court orders or government requests.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Business Transfers</h4>
                  <p className="text-gray-600 text-sm">
                    In case of merger, acquisition, or sale of assets, your information may be 
                    transferred as part of the business transaction.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security</h2>
              
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm text-gray-700">SSL Encryption</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm text-gray-700">Secure Data Centers</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm text-gray-700">Access Controls</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm text-gray-700">Regular Audits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights and Choices</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Access and Update</h4>
                  <p className="text-gray-600 text-sm">
                    You can access and update your personal information through your account settings 
                    or by contacting our customer support team.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Marketing Communications</h4>
                  <p className="text-gray-600 text-sm">
                    You can opt out of marketing emails by clicking the unsubscribe link in any email 
                    or updating your preferences in your account settings.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Data Deletion</h4>
                  <p className="text-gray-600 text-sm">
                    You can request deletion of your account and personal data by contacting us. 
                    Some information may be retained for legal or business purposes.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Cookie Management</h4>
                  <p className="text-gray-600 text-sm">
                    You can control cookie settings through your browser preferences. Note that 
                    disabling cookies may affect website functionality.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookies Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies and Tracking Technologies</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your browsing experience:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900">Essential Cookies</h5>
                    <p className="text-sm text-gray-600">Required for basic website functionality and security</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Analytics Cookies</h5>
                    <p className="text-sm text-gray-600">Help us understand how visitors interact with our website</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Marketing Cookies</h5>
                    <p className="text-sm text-gray-600">Enable personalized advertisements and promotions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Policy</h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the updated policy on our website and updating the 
                  "Last Updated" date. Continued use of our services after changes constitutes 
                  acceptance of the updated policy.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <div className="bg-gradient-to-r from-brand-coral to-red-500 rounded-lg p-6 text-white">
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Email</h4>
                    <p className="text-sm opacity-90">privacy@sonicmart.in</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Phone</h4>
                    <p className="text-sm opacity-90">1800-SONIC-01 (Toll Free)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Address</h4>
                    <p className="text-sm opacity-90">
                      SonicMart Private Limited<br/>
                      Electronic City, Bangalore<br/>
                      Karnataka - 560100, India
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                    <p className="text-sm opacity-90">dpo@sonicmart.in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;