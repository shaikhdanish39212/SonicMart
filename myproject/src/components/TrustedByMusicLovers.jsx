import React from 'react';
const TrustedByMusicLovers = () => {
  ;
const stats = [ { number: "50K+", label: "Happy Customers", color: "text-brand-coral" }, { number: "1000+", label: "Products Sold", color: "text-brand-coral" }, { number: "98%", label: "Satisfaction Rate", color: "text-brand-coral" }, { number: "24/7", label: "Support Available", color: "text-brand-coral" } ];
  return (
    <div className="bg-gradient-to-r from-brand-navy to-gray-900 rounded-3xl p-6 lg:p-10 mx-auto max-w-screen-2xl my-8 shadow-xl overflow-hidden relative min-h-[200px] lg:min-h-[220px]"> {/* Background Pattern */
}
<div className="absolute inset-0 opacity-10">
<div className="absolute top-0 left-0 w-40 h-40 bg-brand-coral/20 rounded-full transform -translate-x-20 -translate-y-20">
</div>
<div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-coral/30 rounded-full transform translate-x-16 translate-y-16">
</div>
</div> {/* Content Container */
}
<div className="relative z-10 h-full flex flex-col justify-center"> {/* Header */
}
<div className="text-center mb-8">
<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"> Trusted by Music Lovers </h2>
<p className="text-lg text-white/80"> Join thousands of satisfied customers across India </p>
</div> {/* Stats Grid */
}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"> {stats.map((stat, index) => (
          <div key={`stat-${stat.number}-${index}`} className="text-center">
<div className={`text-3xl md:text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
<div className="text-sm md:text-base text-white/70 font-medium">{stat.label}</div>
</div> ))
}
</div>
</div>
</div>
  );
};

export default TrustedByMusicLovers;