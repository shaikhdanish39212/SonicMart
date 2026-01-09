import React from 'react';

const PasswordStrengthMeter = ({ password, className = '' }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const feedback = [];
    
    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');
    
    if (password.length >= 12) score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('Add numbers');
    
    if (/[@$!%*?&#^()_+=\-{}[\]|\\:";'<>?,./]/.test(password)) score += 1;
    else feedback.push('Add special characters');
    
    // Bonus points for variety and length
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.6) score += 1; // Good character diversity
    
    // Penalty for common patterns
    if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 1; // Sequential patterns
    
    score = Math.max(0, Math.min(7, score)); // Clamp between 0-7
    
    const strengthLevels = [
      { min: 0, max: 1, label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-600' },
      { min: 2, max: 3, label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-600' },
      { min: 4, max: 4, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
      { min: 5, max: 5, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600' },
      { min: 6, max: 6, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' },
      { min: 7, max: 7, label: 'Very Strong', color: 'bg-green-600', textColor: 'text-green-700' }
    ];
    
    const level = strengthLevels.find(l => score >= l.min && score <= l.max) || strengthLevels[0];
    
    return {
      score,
      label: level.label,
      color: level.color,
      textColor: level.textColor,
      feedback: feedback.slice(0, 3), // Show max 3 suggestions
      percentage: Math.round((score / 7) * 100)
    };
  };
  
  const strength = getPasswordStrength(password);
  
  if (!password) return null;
  
  return (
    <div className={`mt-2 ${className}`}>
      {/* Strength bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.percentage}%` }}
        ></div>
      </div>
      
      {/* Strength label */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${strength.textColor}`}>
          Password strength: {strength.label}
        </span>
        <span className="text-gray-500">
          {strength.percentage}%
        </span>
      </div>
      
      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-1">To improve your password:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            {strength.feedback.map((tip, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;