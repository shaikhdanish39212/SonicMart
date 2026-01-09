import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const CookiePolicyPage = () => {
  // Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <>
      <Helmet>
        <title>Cookie Policy - SonicMart</title>
        <meta name="description" content="Learn about how SonicMart uses cookies to improve your browsing experience and protect your privacy." />
      </Helmet>

      <div className="min-h-screen bg-brand-gray py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-navy mb-2 sm:mb-3">Cookie Policy</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Last updated: September 26, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and improving site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-brand-coral pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Essential Cookies</h3>
                  <p className="text-gray-700">
                    These cookies are necessary for the website to function properly. They enable basic features like secure login, shopping cart functionality, and payment processing.
                  </p>
                </div>
                
                <div className="border-l-4 border-brand-teal pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Analytics Cookies</h3>
                  <p className="text-gray-700">
                    We use analytics cookies to understand how visitors interact with our website, helping us improve user experience and site performance.
                  </p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Marketing Cookies</h3>
                  <p className="text-gray-700">
                    These cookies help us deliver relevant advertisements and track the effectiveness of our marketing campaigns.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-2">Personalization Cookies</h3>
                  <p className="text-gray-700">
                    We use these cookies to remember your preferences, such as language settings, recently viewed products, and wishlist items.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Types of Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-brand-gray">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-brand-navy">Cookie Type</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-brand-navy">Purpose</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-brand-navy">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">Session Cookies</td>
                      <td className="border border-gray-300 px-4 py-3">Maintain your login session and shopping cart</td>
                      <td className="border border-gray-300 px-4 py-3">Until browser closes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">Persistent Cookies</td>
                      <td className="border border-gray-300 px-4 py-3">Remember your preferences and settings</td>
                      <td className="border border-gray-300 px-4 py-3">Up to 2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">Third-party Cookies</td>
                      <td className="border border-gray-300 px-4 py-3">Analytics, advertising, and social media integration</td>
                      <td className="border border-gray-300 px-4 py-3">Varies by provider</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Managing Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete existing ones through their settings menu.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Cookie Preferences:</strong> Use our cookie preference center to customize which types of cookies you allow.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brand-coral rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Third-party Opt-out:</strong> Visit third-party websites to opt out of their tracking cookies.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We work with trusted third-party services that may set cookies on our website:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-brand-gray p-4 rounded-lg">
                  <h4 className="font-semibold text-brand-navy mb-2">Google Analytics</h4>
                  <p className="text-sm text-gray-600">Website traffic and usage analytics</p>
                </div>
                <div className="bg-brand-gray p-4 rounded-lg">
                  <h4 className="font-semibold text-brand-navy mb-2">Payment Processors</h4>
                  <p className="text-sm text-gray-600">Secure payment processing and fraud prevention</p>
                </div>
                <div className="bg-brand-gray p-4 rounded-lg">
                  <h4 className="font-semibold text-brand-navy mb-2">Social Media</h4>
                  <p className="text-sm text-gray-600">Social sharing and login functionality</p>
                </div>
                <div className="bg-brand-gray p-4 rounded-lg">
                  <h4 className="font-semibold text-brand-navy mb-2">Customer Support</h4>
                  <p className="text-sm text-gray-600">Live chat and help desk services</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under data protection laws, you have the right to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Be informed about cookie usage</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Give or withdraw consent for non-essential cookies</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Access and delete your personal data</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Opt out of marketing communications</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-navy mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about our cookie policy or how we handle your data, please contact us:
              </p>
              <div className="bg-brand-gray p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-brand-navy mb-2">Email</h4>
                    <p className="text-gray-700">privacy@sonicmart.in</p>
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
              <h2 className="text-xl font-semibold text-brand-navy mb-4">Updates to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this cookie policy from time to time to reflect changes in our practices or applicable laws. When we make material changes, we will notify you by updating the date at the top of this policy and, where appropriate, provide additional notice.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicyPage;