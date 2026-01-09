import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaEye, 
  FaEyeSlash, 
  FaLock, 
  FaEnvelope,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useFormValidation, validationRules } from '../utils/validation';
import EnhancedValidatedInput from '../components/form/EnhancedValidatedInput';
import ValidatedCheckbox from '../components/form/ValidatedCheckbox';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Form validation setup
  const validationSchema = {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required, (value) => {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return null;
    }]
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues
  } = useFormValidation(
    { email: '', password: '', rememberMe: false },
    validationSchema
  );

  useEffect(() => {
    // Clear any previous authentication errors when component mounts
    clearError();
    
    // Redirect if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate, clearError]);

  const onSubmit = async (formData) => {
    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      // Only navigate if login was successful
      if (result && result.success) {
        navigate('/');
      }
      // If login failed, the error will be shown via the AuthContext error state
      // and the user will stay on the login page
    } catch (error) {
      console.error('Login failed:', error);
      // Don't navigate on error - stay on login page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-lightBlue py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Logo and Header - Spacious */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            {/* Inline SVG icon for sharper rendering and perfect centering */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-lightBlue shadow-lg grid place-items-center overflow-hidden shrink-0">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                className="text-white"
                aria-hidden="true"
              >
                {/* Shackle */}
                <path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Body */}
                <rect x="4.5" y="10.5" width="15" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
                {/* Keyhole */}
                <path d="M12 14.75v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="13.5" r="0.9" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-brand-dark">
            Sign in to your account
          </h2>
          
          <p className="mt-2 text-sm text-brand-dark/70">
            Or{' '}
            <Link 
              to="/register" 
              className="font-medium text-brand-blue hover:text-brand-dark"
              onClick={clearError}
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-8 shadow-xl border border-brand-lightBlue rounded-xl">
          {/* Error Display - Compact */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-4 w-4 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Sign in failed
                  </h3>
                  <div className="mt-1 text-xs text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Form - Spacious Layout */}
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}>
            <EnhancedValidatedInput
              name="email"
              label="Email address"
              type="email"
              value={values.email}
              error={errors.email}
              touched={touched.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              required
              autoComplete="email"
              icon={<FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5" />}
              validationRules={validationSchema.email}
              showRealTimeValidation={true}
            />

            <EnhancedValidatedInput
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              error={errors.password}
              touched={touched.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              icon={<FaLock className="h-4 w-4 sm:h-5 sm:w-5" />}
              validationRules={validationSchema.password}
              showRealTimeValidation={true}
              additionalComponent={
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 touch-target p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              }
            />

            {/* Compact flex layout */}
            <div className="flex items-center justify-between">
              <ValidatedCheckbox
                name="rememberMe"
                label="Remember me"
                checked={values.rememberMe}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-brand-blue hover:text-brand-coral transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || isSubmitting || Object.keys(errors).length > 0}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-brand-blue to-brand-coral hover:from-brand-coral hover:to-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaLock className="h-4 w-4 text-white/80 group-hover:text-white" aria-hidden="true" />
                </span>
                {loading || isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : 'Sign in'}
              </button>
            </div>
          </form>
          
          <p className="mt-4 text-center text-sm text-brand-dark/70">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-brand-blue hover:text-brand-coral transition-colors duration-200"
              onClick={clearError}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
