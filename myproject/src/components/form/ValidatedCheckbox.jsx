import React from 'react';
import { getAriaAttributes } from '../../utils/validation';

const ValidatedCheckbox = ({
  name,
  label,
  checked = false,
  error,
  touched,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  className = '',
  description,
  ...props
}) => {
  const hasError = touched && error;

  const handleChange = (e) => {
    onChange(name, e.target.checked);
  };

  const handleBlur = () => {
    onBlur(name);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`
              w-4 h-4 rounded border transition-all duration-200 
              focus:ring-2 focus:ring-offset-2
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${hasError 
                ? 'border-red-300 text-red-600 focus:ring-red-200' 
                : 'border-gray-300 text-blue-600 focus:ring-blue-200'
              }
            `}
            {...getAriaAttributes(name, error, touched)}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label 
            htmlFor={name}
            className={`font-medium cursor-pointer ${
              disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
            }`}
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
          {description && (
            <p className="text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {hasError && (
        <p 
          id={`${name}-error`}
          className="text-sm text-red-600 flex items-center ml-7"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default ValidatedCheckbox;