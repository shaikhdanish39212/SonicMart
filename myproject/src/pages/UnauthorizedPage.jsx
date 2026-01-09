import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { useRBAC } from '../context/RBACContext';
const UnauthorizedPage = () => {
  ;
const navigate = useNavigate();
const { userRole, ROLES } = useRBAC();
const handleGoBack = () => {
  navigate(-1);
};
const getRoleDisplayName = (role) => { ;
const roleNames = { [ROLES.GUEST]: 'Guest', [ROLES.USER]: 'User', [ROLES.MODERATOR]: 'Moderator', [ROLES.ADMIN]: 'Administrator', [ROLES.SUPER_ADMIN]: 'Super Administrator' };
return roleNames[role] || 'Unknown'; };
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
<div className="max-w-md w-full"> {/* Error Icon */
}
<div className="text-center mb-8">
<div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
<FaExclamationTriangle className="w-10 h-10 text-red-600" />
</div>
<h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
<p className="text-gray-600"> You don't have permission to access this page </p>
</div> {/* Error Details */
}
<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
<div className="flex items-center mb-4">
<FaShieldAlt className="w-5 h-5 text-gray-400 mr-2" />
<span className="text-sm font-medium text-gray-700">Current Role</span>
</div>
<div className="bg-gray-50 rounded-lg p-3 mb-4">
<span className="text-lg font-semibold text-gray-900"> {getRoleDisplayName(userRole)
}
</span>
</div>
<div className="text-sm text-gray-600">
<p className="mb-2"> This page requires higher privileges than your current role allows. </p>
<p> If you believe this is an error, please contact your administrator. </p>
</div>
</div> {/* Action Buttons */
}
<div className="space-y-3">
<button onClick={handleGoBack} className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200" >
<FaArrowLeft className="w-4 h-4 mr-2" /> Go Back </button>
<Link to="/" className="w-full flex items-center justify-center px-4 py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-medium rounded-lg transition-colors duration-200" >
<FaHome className="w-4 h-4 mr-2" /> Return to Home </Link>
</div> {/* Help Section */
}
<div className="mt-8 text-center">
<p className="text-sm text-gray-500 mb-2"> Need help? </p>
<div className="flex justify-center space-x-4 text-sm">
<Link to="/contact" className="text-brand-coral hover:text-brand-coral/80 transition-colors" > Contact Support </Link>
<span className="text-gray-300">|</span>
<Link to="/help" className="text-brand-coral hover:text-brand-coral/80 transition-colors" > Help Center </Link>
</div>
</div> {/* Role Information */
}
<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
<h3 className="text-sm font-medium text-blue-900 mb-2"> Role Permissions </h3>
<div className="text-xs text-blue-700">
<p className="mb-1">
<strong>User:</strong> View products, manage personal orders </p>
<p className="mb-1">
<strong>Moderator:</strong> Manage products, moderate content </p>
<p>
<strong>Admin:</strong> Full system access, user management </p>
</div>
</div>
</div>
</div>
  );
};

export default UnauthorizedPage;