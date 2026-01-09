import React from 'react';
import { FaTruck, FaHeadphones, FaShieldAlt, FaUsers } from 'react-icons/fa';
const WhyChooseSound = () => {
  ;
const features = [ { icon: <FaTruck className="text-3xl text-blue-600" />, title: "Free Shipping", description: "Free delivery on orders above ₹999. Fast and secure shipping across India." }, { icon: <FaHeadphones className="text-3xl text-green-600" />, title: "Premium Quality", description: "High-quality audio products from trusted brands with superior sound experience." }, { icon: <FaShieldAlt className="text-3xl text-purple-600" />, title: "Warranty Protection", description: "Comprehensive warranty coverage and hassle-free replacement guarantee." }, { icon: <FaUsers className="text-3xl text-orange-600" />, title: "24/7 Support", description: "Round-the-clock customer support to help you with any queries or issues." } ];
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 lg:p-10 mx-auto max-w-screen-2xl my-8 shadow-xl overflow-hidden relative min-h-[450px] lg:min-h-[480px]"> {/* Background Pattern */
}
<div className="absolute inset-0 opacity-10">
<div className="absolute top-0 left-0 w-40 h-40 bg-blue-200 rounded-full transform -translate-x-20 -translate-y-20">
</div>
<div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full transform translate-x-16 translate-y-16">
</div>
</div> {/* Content Container */
}
<div className="relative z-10 h-full flex flex-col justify-center"> {/* Header */
}
<div className="text-center mb-8 lg:mb-12">
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"> Why Choose <span className="text-blue-600">Sound</span>? </h2>
<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"> We''re committed to delivering exceptional audio experiences with unmatched service quality. </p>
</div> {/* Features Grid */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"> {features.map((feature, index) => (
          <div key={`feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}-${index}`} className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100" >
<div className="flex flex-col items-center text-center">
<div className="mb-4 p-3 bg-gray-50 rounded-full">{feature.icon}</div>
<h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
<p className="text-gray-600 text-sm lg:text-base leading-relaxed">{feature.description}</p>
</div>
</div> ))
}
</div>
</div>
</div>
  );
};

export default WhyChooseSound;