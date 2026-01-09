import React from 'react';
import { getAriaAttributes } from '../../utils/validation';

const ValidatedSelect = ({
  name,
  label,
  value = '',
  error,
  touched,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  className = '',
  options = [],
  placeholder = 'Select an option',
  ...props
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  const handleBlur = () => {
    onBlur(name);
  };

  const baseClasses = `
    w-full px-4 py-3 rounded-lg border transition-all duration-200 
    focus:outline-none focus:ring-2 focus:border-transparent appearance-none text-brand-dark
    ${disabled ? 'bg-brand-cream/50 cursor-not-allowed' : 'bg-white cursor-pointer'}
    ${hasError 
      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
      : isValid 
        ? 'border-green-300 focus:ring-green-200 focus:border-green-500'
        : 'border-brand-lightBlue focus:ring-brand-blue/20 focus:border-brand-blue'
    }
  `.trim();

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
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={baseClasses}
          {...getAriaAttributes(name, error, touched)}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value || option} 
              value={option.value || option}
            >
              {option.label || option}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {touched && hasError ? (
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : touched && isValid ? (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {hasError && (
        <p 
          id={`${name}-error`}
          className="text-sm text-red-600 flex items-start break-words"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="break-words overflow-wrap-anywhere">{error}</span>
        </p>
      )}
      
      {/* Success message */}
      {isValid && (
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

export default ValidatedSelect;