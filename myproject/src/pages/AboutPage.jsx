import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-coral to-brand-navy text-white py-3 sm:py-4 lg:py-6">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4">About SonicMart</h1>
          <p className="text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
            India's premier destination for premium audio equipment since 2020
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-navy mb-3 sm:mb-4">Our Story</h2>
              <p className="text-sm sm:text-base text-brand-navy/80 mb-3 sm:mb-4">
                Founded in 2020, SonicMart began as a passion project by audio enthusiasts who couldn't find premium quality headphones, earphones, and speakers at accessible prices in India. What started as a small venture has now grown into India's most trusted audio accessories retailer.
              </p>
              <p className="text-sm sm:text-base text-brand-navy/80 mb-3 sm:mb-4">
                We specialize in curating the finest audio accessories from leading global brands - from studio-grade headphones and wireless earbuds to powerful speakers and professional audio equipment. Every product in our collection is personally tested by our audio experts.
              </p>
              <p className="text-lg text-brand-navy/80">
                Today, we serve over 100,000+ satisfied customers across India with our authentic products, expert advice, and exceptional after-sales support. Your perfect sound experience is our mission.
              </p>
            </div>
            <div className="bg-brand-coral/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                To make premium audio equipment accessible to every Indian music enthusiast while maintaining the highest standards of quality and service.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become India's #1 audio equipment destination, known for authenticity, quality, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-brand-navy mb-4 sm:mb-6">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-brand-navy transition-colors">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">Premium Quality</h3>
              <p className="text-sm sm:text-base text-brand-navy/70">Every headphone, speaker, and audio accessory is carefully curated for superior sound quality and durability.</p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-brand-teal rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-navy transition-colors">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Expert Support</h3>
              <p className="text-brand-navy/70">Our audio specialists provide personalized recommendations and technical support for all your sound needs.</p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-navy transition-colors">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Authenticity Guaranteed</h3>
              <p className="text-brand-navy/70">100% original products from Sony, Bose, JBL, Marshall, and other leading audio brands with full warranty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-4 sm:py-6 lg:py-8 bg-brand-gray">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-brand-navy mb-4 sm:mb-6">Meet Our Audio Experts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-brand-coral to-brand-navy rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-lg sm:text-2xl font-bold text-white">AM</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-1">Arun Mehta</h3>
              <p className="text-brand-coral font-medium mb-2 text-sm sm:text-base">Founder & Chief Audio Officer</p>
              <p className="text-brand-navy/70 text-sm">Former Sound Engineer at T-Series with 20+ years in professional audio equipment</p>
            </div>
            <div className="text-center bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-brand-teal to-brand-navy rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-lg sm:text-2xl font-bold text-white">ST</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-1">Sneha Tiwari</h3>
              <p className="text-brand-coral font-medium mb-2 text-sm sm:text-base">Head of Product Curation</p>
              <p className="text-brand-navy/70">Audiophile & former Sony India Product Manager specializing in premium headphones</p>
            </div>
            <div className="text-center bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-32 h-32 bg-gradient-to-br from-brand-coral to-brand-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">VK</span>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-1">Vikram Khanna</h3>
              <p className="text-brand-coral font-medium mb-2">Customer Experience Lead</p>
              <p className="text-brand-navy/70">DJ & audio consultant helping customers find their perfect sound signature</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-navy text-white py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-4 sm:mb-6">SonicMart by the Numbers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-coral mb-2 group-hover:text-brand-teal transition-colors">1L+</div>
              <div className="text-sm sm:text-base text-brand-cream/80">Audio Enthusiasts</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-coral mb-2 group-hover:text-brand-teal transition-colors">5000+</div>
              <div className="text-sm sm:text-base text-brand-cream/80">Premium Products</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-coral mb-2 group-hover:text-brand-teal transition-colors">99%</div>
              <div className="text-sm sm:text-base text-brand-cream/80">Customer Satisfaction</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-coral mb-2 group-hover:text-brand-teal transition-colors">50+</div>
              <div className="text-sm sm:text-base text-brand-cream/80">Top Audio Brands</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;