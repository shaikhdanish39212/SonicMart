import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
const PromotionalBanner = () => {
  ;
const navigate = useNavigate();
const handleShopNow = () => {
  navigate('/products?category=headphones');
};
const handleViewDetails = () => {
  navigate('/products/open-back-audiophile-headphones');
};

  return (
    <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-3xl p-6 lg:p-10 mx-auto max-w-screen-2xl my-8 shadow-xl overflow-hidden relative min-h-[450px] lg:min-h-[480px]"> {/* Background Pattern */
}
<div className="absolute inset-0 opacity-10">
<div className="absolute top-0 left-0 w-40 h-40 bg-red-200 rounded-full transform -translate-x-20 -translate-y-20">
</div>
<div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-200 rounded-full transform translate-x-16 translate-y-16">
</div>
</div>
<div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 h-full"> {/* Left Content - Text and Buttons */
}
<div className="flex-1 text-center lg:text-left max-w-xl lg:max-w-2xl"> {/* Limited Time Badge */
}
<div className="inline-block mb-6">
<span className="bg-red-500 text-white text-base font-bold px-6 py-3 rounded-full uppercase tracking-wide"> Limited Time </span>
</div> {/* Main Heading */
}
<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 lg:mb-6 leading-tight"> Today's <span className="text-red-500">Special</span>
</h1> {/* Description */
}
<p className="text-gray-600 text-lg lg:text-xl mb-6 lg:mb-8 leading-relaxed"> Get up to 50% off on selected premium headphones. Quality sound at unbeatable prices! </p> {/* Discount Badge */
}
<div className="mb-6 lg:mb-8">
<span className="text-4xl md:text-6xl lg:text-7xl font-bold text-red-500">50% OFF</span>
</div> {/* Action Buttons */
}
<div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
<button onClick={handleShopNow} className="bg-red-500 hover:bg-red-600 text-white px-10 lg:px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg" > Shop Now </button>
<button onClick={handleViewDetails} className="border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 px-10 lg:px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300" > View Details </button>
</div>
</div> {/* Right Content - Product Image */
}
<div className="flex-1 flex justify-center lg:justify-end items-center">
<div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px]"> {/* Background Circle */
}
<div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-full transform rotate-12 scale-110 opacity-50">
</div> {/* Product Image */
}
<div className="relative z-10 w-full h-full flex items-center justify-center">
<img src={getImageUrl("/images/HeadPhones1.png")
} alt="Premium Headphones" className="w-4/5 h-4/5 object-contain transform hover:scale-105 transition-transform duration-300" onError={(e) => { console.log('Failed to load headphones image'); e.target.src = getImageUrl('/images/DJSpeaker1.png'); }} />
</div> {/* Floating Elements */
}
<div className="absolute top-4 right-4 lg:top-6 lg:right-6 bg-white rounded-full px-4 py-3 shadow-lg animate-bounce">
<span className="text-red-500 font-bold text-sm lg:text-base">NEW ARRIVAL</span>
</div>
<div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 bg-white rounded-full px-4 py-3 shadow-lg">
<span className="text-gray-600 font-bold text-sm lg:text-base">HiFi</span>
</div>
</div>
</div>
</div>
</div>
  );
};

export default PromotionalBanner; 