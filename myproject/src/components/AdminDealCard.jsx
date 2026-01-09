import React from 'react';
import { Clock, Tag, Star, ShoppingBag } from 'lucide-react';

const AdminDealCard = ({ deal }) => {
  const timeLeft = () => {
    const now = new Date();
    const endDate = new Date(deal.validUntil);
    const timeDiff = endDate - now;
    
    if (timeDiff <= 0) return 'Expired';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="admin-deal-card relative overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{ 
          background: 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 50%, #FF6B6B 100%)'
        }}
      />
      
      {/* Content */}
      <div className="relative p-6 text-white">
        {/* Deal Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
            🔥 SPECIAL DEAL
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold mb-2 leading-tight">
          {deal.name}
        </h3>
        
        {/* Description */}
        <p className="text-white/90 mb-4 text-sm leading-relaxed">
          {deal.description}
        </p>
        
        {/* Deal Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Discount */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span className="font-bold text-lg">{deal.discount}% OFF</span>
              </div>
            </div>
            
            {/* Timer */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-sm">{timeLeft()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <button 
          className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-all duration-200 transform hover:scale-95 active:scale-90 shadow-lg"
          onClick={() => {
            // For now, just scroll to products. Later we can implement deal-specific logic
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <ShoppingBag className="inline mr-2" size={18} />
          Shop This Deal
        </button>
        
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default AdminDealCard;