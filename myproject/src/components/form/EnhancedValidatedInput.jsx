import React, { useState, useEffect } from 'react';
import { getAriaAttributes } from '../../utils/validation';

const EnhancedValidatedInput = ({
  name,
  label,
  type = 'text',
  value = '',
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  formatter,
  icon,
  additionalComponent,
  validationRules = [],
  showRealTimeValidation = false,
  showPasswordStrength = false,
  confirmPasswordFor = null, // For password confirmation fields
  ...props
}) => {
  const [realtimeError, setRealtimeError] = useState(null);
  const [validationState, setValidationState] = useState('idle'); // idle, validating, valid, invalid
  
  const hasError = touched && Boolean(error);
  const isValid = touched && !error && Boolean(value);
  const showRealtimeError = showRealTimeValidation && realtimeError && value && !touched;
  
  // Real-time validation
  useEffect(() => {
    if (!showRealTimeValidation || !value) {
      setRealtimeError(null);
      setValidationState('idle');
      return;
    }
    
    setValidationState('validating');
    
    const debounceTimer = setTimeout(() => {
      let validationError = null;
      
      for (const rule of validationRules) {
        if (confirmPasswordFor) {
          // Special handling for password confirmation
          validationError = rule(value, confirmPasswordFor);
        } else {
          validationError = rule(value);
        }
        
        if (validationError) break;
      }
      
      setRealtimeError(validationError);
      setValidationState(validationError ? 'invalid' : 'valid');
    }, 300); // Debounce validation
    
    return () => clearTimeout(debounceTimer);
  }, [value, validationRules, showRealTimeValidation, confirmPasswordFor]);

  const handleChange = (e) => {
    let inputValue = e.target.value;
    if (formatter) {
      inputValue = formatter(inputValue);
    }
    onChange(name, inputValue);
  };

  const handleBlur = () => {
    onBlur(name);
  };

  const getInputClasses = () => {
    const baseClasses = `
      w-full px-4 py-3 rounded-lg border transition-all duration-200 
      focus:outline-none focus:ring-2 focus:border-transparent text-brand-dark
      ${disabled ? 'bg-brand-cream/50 cursor-not-allowed' : 'bg-white'}
    `;
    
    if (hasError || showRealtimeError) {
      return `${baseClasses} border-red-300 focus:ring-red-200 focus:border-red-500`;
    } else if (isValid || (showRealTimeValidation && validationState === 'valid')) {
      return `${baseClasses} border-green-300 focus:ring-green-200 focus:border-green-500`;
    } else if (validationState === 'validating') {
      return `${baseClasses} border-blue-300 focus:ring-blue-200 focus:border-blue-500`;
    } else {
      return `${baseClasses} border-brand-lightBlue focus:ring-brand-blue/20 focus:border-brand-blue`;
    }
  };

  const getIconColor = () => {
    if (hasError || showRealtimeError) return 'text-red-400';
    if (isValid || (showRealTimeValidation && validationState === 'valid')) return 'text-green-400';
    if (validationState === 'validating') return 'text-blue-400';
    return 'text-brand-dark/40';
  };

  const getValidationIcon = () => {
    if (validationState === 'validating') {
      return (
        <svg className="animate-spin w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    if (hasError || showRealtimeError) {
      return (
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    
    if (isValid || (showRealTimeValidation && validationState === 'valid')) {
      return (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    
    return null;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-brand-dark"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={getIconColor()}>
              {icon}
            </span>
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${getInputClasses()} ${icon ? 'pl-10' : ''} ${additionalComponent ? 'pr-16' : (touched || showRealTimeValidation) ? 'pr-10' : ''} input-overflow-control ${type === 'number' ? 'no-spinner' : ''}`}
          {...getAriaAttributes(name, error || realtimeError, touched || showRealtimeError)}
          {...props}
        />
        
        {/* Additional component (like password toggle) */}
        {additionalComponent}
        
        {/* Validation icons */}
        {(touched || showRealTimeValidation) && (
          <div className={`absolute inset-y-0 right-0 pr-3 flex items-center ${additionalComponent ? 'mr-10' : ''}`}>
            {getValidationIcon()}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {(hasError || showRealtimeError) && (
        <p 
          id={`${name}-error`}
          className="text-sm text-red-600 flex items-start break-words"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="break-words overflow-wrap-anywhere">{error || realtimeError}</span>
        </p>
      )}
      
      {/* Success message */}
      {(isValid || (showRealTimeValidation && validationState === 'valid' && !hasError)) && (
        <p className="text-sm text-green-600 flex items-center break-words">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Valid</span>
        </p>
      )}
    </div>
  );
};

export default EnhancedValidatedInput;