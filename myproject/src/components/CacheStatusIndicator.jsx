import React from 'react';
import { FaClock, FaCheckCircle } from 'react-icons/fa';

const CacheStatusIndicator = ({ isFromCache, dataType = 'data' }) => {
  if (!isFromCache) return null;

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200 mb-4">
      <FaCheckCircle className="text-green-600" size={14} />
      <span>
        Loaded {dataType} instantly from cache
      </span>
      <FaClock size={12} className="text-green-500" />
    </div>
  );
};

export default CacheStatusIndicator;