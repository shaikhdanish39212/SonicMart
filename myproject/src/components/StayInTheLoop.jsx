import React, { useState } from 'react';

const StayInTheLoop = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Subscribing email:', email);
      setIsSubscribed(true);
      setEmail('');
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-brand-navy/5 to-brand-cyan/5 py-16 px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-brand-coral/20 rounded-full transform -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-coral/30 rounded-full transform translate-x-16 translate-y-16"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-midnight mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get the latest updates on new products, exclusive deals, and audio tips delivered to your inbox
          </p>
        </div>

        {/* Subscription Form */}
        <div className="w-full max-w-md mx-auto">
          {isSubscribed ? (
            <div className="bg-brand-coral/10 border border-brand-coral text-brand-coral px-6 py-4 rounded-lg">
              <p className="font-medium">Thank you for subscribing!</p>
              <p className="text-sm">You'll receive our latest updates soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent text-gray-700 bg-white"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors duration-300 transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-sm text-gray-500 mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StayInTheLoop;