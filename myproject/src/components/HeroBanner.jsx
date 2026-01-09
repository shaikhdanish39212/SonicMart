import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
const HeroBanner = () => {
  ;
const [currentSlide, setCurrentSlide] = useState(1);
const slides = [
    {
      id: 1,
      title: ['Audio', 'Drivers'],
      subtitle: 'High-Performance Sound Components',
      buttonText: 'Shop Drivers',
      buttonLink: '/internal-components',
      image: '/images/internal_components/images/Speakers_Driver3.png',
      offer: '15% OFF',
      badge: 'Pro Grade',
      category: 'audio-drivers'
    },
    {
      id: 2,
      title: ['Cables &', 'Connectors'],
      subtitle: 'Professional Audio Connections',
      buttonText: 'Shop Connectors',
      buttonLink: '/internal-components',
      image: '/images/internal_components/images/HeadPhonesCables6.png',
      offer: 'Free Shipping',
      badge: 'Essential',
      category: 'audio-connectors'
    },
    {
      id: 3,
      title: ['Premium', 'Headphones'],
      subtitle: 'Professional Audio Experience',
      buttonText: 'Shop Headphones',
      buttonLink: '/category/headphones',
      image: '/images/HeadPhones1.png',
      offer: '25% OFF',
      badge: 'Best Seller',
      category: 'headphones'
    },
    {
      id: 4,
      title: ['Wireless', 'Earbuds'],
      subtitle: 'True Wireless Freedom',
      buttonText: 'Shop Earbuds',
      buttonLink: '/category/earbuds',
      image: '/images/EarBuds1.png',
      offer: 'Free Shipping',
      badge: 'New Arrival',
      category: 'earbuds'
    },
    {
      id: 5,
      title: ['Powerful', 'Speakers'],
      subtitle: 'Crystal Clear Sound Quality',
      buttonText: 'Shop Speakers',
      buttonLink: '/category/speakers',
      image: '/images/Speakers1.png',
      offer: '30% OFF',
      badge: 'Limited Time',
      category: 'speakers'
    },
    {
      id: 6,
      title: ['Studio', 'Microphones'],
      subtitle: 'Professional Recording Quality',
      buttonText: 'Shop Microphones',
      buttonLink: '/category/microphones',
      image: '/images/Microphone1.png',
      offer: 'Buy 1 Get 1',
      badge: 'Special Deal',
      category: 'microphones'
    }
  ];
const nextSlide = () => {
  setCurrentSlide((prev) => (prev === slides.length ? 1 : prev + 1));
};
const prevSlide = () => {
  setCurrentSlide((prev) => (prev === 1 ? slides.length : prev - 1));
};

  // Auto-scroll functionality - advance to next slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
  return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full overflow-hidden border-b-2" style={{ backgroundColor: '#FEFCF3', borderColor: '#20B2AA' }}>
      {slides.map((slide) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            currentSlide === slide.id ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Mobile Layout */}
          <div className="lg:hidden h-full flex flex-col px-4 sm:px-6 py-8">
            {/* Mobile Content - Stack vertically */}
            <div className="flex-1 flex flex-col justify-center space-y-6 text-center">
              {/* Badge */}
              <div className="inline-block self-center">
                <span 
                  className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg text-white"
                  style={{ backgroundColor: '#FF6B6B' }}
                >{slide.badge}</span>
              </div>
              
              {/* Title and Subtitle */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ color: '#2C3E50' }}>
                  {slide.title[0]} <br /> 
                  <span style={{ color: '#FF6B6B' }}>{slide.title[1]}</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base" style={{ color: '#2C3E50' }}>{slide.subtitle}</p>
              </div>

              {/* Mobile Image - Compact */}
              <div className="flex justify-center py-4">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  <div className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: '#20B2AA' }}></div>
                  <img
                    src={getImageUrl(slide.image)}
                    alt={`${slide.title.join(' ')}`}
                    className="relative z-10 w-full h-full object-contain drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Offer */}
              <div className="border-l-4 p-3 rounded-r-lg mx-4" style={{ backgroundColor: '#F8F9FA', borderColor: '#FF6B6B' }}>
                <p className="text-lg sm:text-xl font-bold" style={{ color: '#FF6B6B' }}>{slide.offer}</p>
                <p className="text-xs sm:text-sm" style={{ color: '#2C3E50' }}>Limited time offer</p>
              </div>

              {/* CTA Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 px-4">
                <Link
                  to={slide.buttonLink}
                  className="inline-block rounded-lg px-6 py-3 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
                  style={{ backgroundColor: '#FF6B6B' }}
                >{slide.buttonText}</Link>
                <button 
                  className="px-6 py-3 border-2 rounded-lg transition-colors font-semibold text-sm sm:text-base"
                  style={{ 
                    borderColor: '#20B2AA', 
                    color: '#2C3E50',
                    backgroundColor: 'transparent'
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Side by side */}
          <div className="hidden lg:flex h-full items-center justify-between px-8 md:px-20">
            {/* Left Content */}
            <div className="z-10 max-w-xl space-y-6">
              {/* Badge */}
              <div className="inline-block">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-semibold shadow-lg text-white"
                  style={{ backgroundColor: '#FF6B6B' }}
                >{slide.badge}</span>
              </div>
              
              {/* Title and Subtitle */}
              <div>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: '#2C3E50' }}>
                  {slide.title[0]} <br /> 
                  <span style={{ color: '#FF6B6B' }}>{slide.title[1]}</span>
                </h2>
                <p className="mt-4 text-lg md:text-xl" style={{ color: '#2C3E50' }}>{slide.subtitle}</p>
              </div>

              {/* Offer */}
              <div className="border-l-4 p-4 rounded-r-lg" style={{ backgroundColor: '#F8F9FA', borderColor: '#FF6B6B' }}>
                <p className="text-2xl font-bold" style={{ color: '#FF6B6B' }}>{slide.offer}</p>
                <p className="text-sm" style={{ color: '#2C3E50' }}>Limited time offer</p>
              </div>

              {/* CTA Button */}
              <div className="flex space-x-4">
                <Link
                  to={slide.buttonLink}
                  className="inline-block rounded-lg px-8 py-4 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#FF6B6B' }}
                >{slide.buttonText}</Link>
                <button 
                  className="px-6 py-4 border-2 rounded-lg transition-colors font-semibold"
                  style={{ 
                    borderColor: '#20B2AA', 
                    color: '#2C3E50',
                    backgroundColor: 'transparent'
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-full w-1/2 flex items-center justify-center">
              {/* Background decoration */}
              <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'rgba(32, 178, 170, 0.05)' }}></div>
              
              <img
                src={getImageUrl(slide.image)}
                alt={`${slide.title.join(' ')}`}
                className="relative z-10 h-[350px] md:h-[450px] w-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              
              {/* Floating elements */}
              <div className="absolute top-10 right-10 bg-white p-3 rounded-full shadow-lg animate-bounce">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.076-1.343-4.243a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.988 3.988 0 00-.172-1.172 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute bottom-20 right-20 p-2 rounded-full" style={{ backgroundColor: 'rgba(255, 107, 107, 0.2)' }}>
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 transform rounded-full p-2 sm:p-3 shadow-lg transition-colors text-white"
        style={{ backgroundColor: '#20B2AA' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4 sm:h-6 sm:w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 transform rounded-full p-2 sm:p-3 shadow-lg transition-colors text-white"
        style={{ backgroundColor: '#20B2AA' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4 sm:h-6 sm:w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-20 flex -translate-x-1/2 transform space-x-2 sm:space-x-3">
        {slides.map((slide) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(slide.id)}
            className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
              currentSlide === slide.id 
                ? 'scale-125 shadow-lg' 
                : 'hover:scale-110'
            }`}
            style={{
              backgroundColor: currentSlide === slide.id ? '#FF6B6B' : 'rgba(255, 255, 255, 0.5)'
            }}
          />
        ))}
      </div>

      {/* Promotional Banner - Hide on small screens */}
      <div className="hidden sm:block absolute top-4 right-4 z-20 px-4 py-2 rounded-full shadow-lg text-white" style={{ backgroundColor: '#FF6B6B' }}>
        <span className="text-sm font-bold">FLASH SALE</span>
      </div>
    </div>
  );
};

export default HeroBanner;