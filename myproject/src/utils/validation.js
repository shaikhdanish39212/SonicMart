// Centralized validation utility
import { useState, useCallback } from 'react';

// Validation rules
export const validationRules = {
  required: (value, fieldName = 'Field') => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return 'Email address is required';
    
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    
    // More sophisticated email validation
    const advancedEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!advancedEmailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    
    // Check for common typos
    const commonTypos = [
      { pattern: /@gmai\./, suggestion: '@gmail.' },
      { pattern: /@gmial\./, suggestion: '@gmail.' },
      { pattern: /@gamail\./, suggestion: '@gmail.' },
      { pattern: /@yaho\./, suggestion: '@yahoo.' },
      { pattern: /@yahooo\./, suggestion: '@yahoo.' },
      { pattern: /@hotmial\./, suggestion: '@hotmail.' },
      { pattern: /@hotmil\./, suggestion: '@hotmail.' },
      { pattern: /@outlok\./, suggestion: '@outlook.' },
      { pattern: /@outllok\./, suggestion: '@outlook.' }
    ];
    
    for (const typo of commonTypos) {
      if (typo.pattern.test(value)) {
        return `Did you mean "${value.replace(typo.pattern, typo.suggestion)}"?`;
      }
    }
    
    // Check for suspicious patterns
    if (value.includes('..')) {
      return 'Email address cannot contain consecutive dots';
    }
    
    if (value.startsWith('.') || value.endsWith('.')) {
      return 'Email address cannot start or end with a dot';
    }
    
    // Length check
    if (value.length > 254) {
      return 'Email address is too long';
    }
    
    return null;
  },

  phone: (value) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    
    // Length requirements
    if (value.length < 8) return 'Password must be at least 8 characters long';
    if (value.length > 128) return 'Password must be less than 128 characters long';
    
    // Character requirements
    const requirements = [];
    if (!/(?=.*[a-z])/.test(value)) requirements.push('one lowercase letter');
    if (!/(?=.*[A-Z])/.test(value)) requirements.push('one uppercase letter');
    if (!/(?=.*\d)/.test(value)) requirements.push('one number');
    if (!/(?=.*[@$!%*?&#^()_+=\-{}[\]|\\:";'<>?,./])/.test(value)) requirements.push('one special character');
    
    if (requirements.length > 0) {
      return `Password must contain at least ${requirements.join(', ')}`;
    }
    
    // Security checks
    const commonPasswords = [
      'password', '123456', '12345678', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'Password',
      'Password1', 'password1', '12345', '123456789', 'qwerty123'
    ];
    
    if (commonPasswords.includes(value.toLowerCase())) {
      return 'This password is too common. Please choose a more secure password';
    }
    
    // Check for keyboard patterns
    const keyboardPatterns = [
      'qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890',
      'qwerty', 'asdfgh', 'zxcvb', '123456', 'abcdef'
    ];
    
    for (const pattern of keyboardPatterns) {
      if (value.toLowerCase().includes(pattern)) {
        return 'Password cannot contain keyboard patterns like "qwerty" or "123456"';
      }
    }
    
    // Check for repeated characters
    if (/(.)\1{2,}/.test(value)) {
      return 'Password cannot contain more than 2 consecutive identical characters';
    }
    
    // Check for personal info patterns (basic)
    if (/^(admin|user|test|demo|guest)/i.test(value)) {
      return 'Password cannot start with common words like "admin", "user", "test"';
    }
    
    return null;
  },

  confirmPassword: (value, originalPassword) => {
    if (!value) return 'Please confirm your password';
    if (value !== originalPassword) return 'Passwords do not match';
    return null;
  },

  // Enhanced name validation for user registration
  fullName: (value) => {
    if (!value) return 'Full name is required';
    
    const trimmedValue = value.trim();
    if (trimmedValue.length < 2) return 'Name must be at least 2 characters long';
    if (trimmedValue.length > 50) return 'Name must be less than 50 characters long';
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-\'\.]+$/.test(trimmedValue)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    // Check for at least one letter
    if (!/[a-zA-Z]/.test(trimmedValue)) {
      return 'Name must contain at least one letter';
    }
    
    // Check for excessive spaces
    if (/\s{2,}/.test(trimmedValue)) {
      return 'Name cannot contain multiple consecutive spaces';
    }
    
    // Check for starting/ending with special characters
    if (/^[\s\-\']|[\s\-\']$/.test(trimmedValue)) {
      return 'Name cannot start or end with spaces, hyphens, or apostrophes';
    }
    
    // Check for gibberish (too many consonants without vowels)
    const letters = trimmedValue.replace(/[^a-zA-Z]/g, '');
    const vowels = (letters.match(/[aeiouAEIOU]/g) || []).length;
    if (letters.length > 4 && vowels === 0) {
      return 'Please enter a valid name';
    }
    
    // Check for repeated patterns
    if (/(.{2,})\1{2,}/.test(trimmedValue)) {
      return 'Please enter a valid name without repeated patterns';
    }
    
    return null;
  },

  // Username validation
  username: (value) => {
    if (!value) return 'Username is required';
    
    const trimmedValue = value.trim();
    if (trimmedValue.length < 3) return 'Username must be at least 3 characters long';
    if (trimmedValue.length > 20) return 'Username must be less than 20 characters long';
    
    // Check for valid characters (alphanumeric, underscore, hyphen)
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedValue)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    
    // Must start with a letter or number
    if (!/^[a-zA-Z0-9]/.test(trimmedValue)) {
      return 'Username must start with a letter or number';
    }
    
    // Cannot end with underscore or hyphen
    if (/[_-]$/.test(trimmedValue)) {
      return 'Username cannot end with underscore or hyphen';
    }
    
    // Check for consecutive special characters
    if (/[_-]{2,}/.test(trimmedValue)) {
      return 'Username cannot contain consecutive underscores or hyphens';
    }
    
    // Check for reserved words
    const reservedWords = [
      'admin', 'administrator', 'root', 'superuser', 'moderator', 'owner',
      'api', 'www', 'mail', 'ftp', 'support', 'help', 'info', 'contact',
      'test', 'demo', 'guest', 'user', 'null', 'undefined'
    ];
    
    if (reservedWords.includes(trimmedValue.toLowerCase())) {
      return 'This username is reserved. Please choose a different one';
    }
    
    return null;
  },

  minLength: (min) => (value, fieldName = 'Field') => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max) => (value, fieldName = 'Field') => {
    if (value && value.length > max) {
      return `${fieldName} must be no more than ${max} characters long`;
    }
    return null;
  },

  numeric: (value, fieldName = 'Field') => {
    if (value && isNaN(value)) {
      return `${fieldName} must be a number`;
    }
    return null;
  },

  positiveNumber: (value, fieldName = 'Field') => {
    if (value && (isNaN(value) || parseFloat(value) <= 0)) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  },

  // Enhanced validation for product names
  productName: (value) => {
    if (!value) return 'Product name is required';
    if (value.length < 3) return 'Product name must be at least 3 characters';
    if (value.length > 100) return 'Product name must be less than 100 characters';
    
    // Check for meaningful content - must have reasonable letter to number ratio
    const letters = (value.match(/[a-zA-Z]/g) || []).length;
    const numbers = (value.match(/[0-9]/g) || []).length;
    const totalLength = value.length;
    
    // If more than 60% of the content is numbers, it's likely gibberish
    if (numbers / totalLength > 0.6) {
      return 'Product name contains too many numbers - please use a meaningful name';
    }
    
    // Must have at least 3 letters for a meaningful name
    if (letters < 3) {
      return 'Product name must contain at least 3 letters';
    }
    
    // Check for repeated patterns (like "dtdtf" or "y8y8y")
    if (/(.{2,})\1{2,}/.test(value)) {
      return 'Product name contains suspicious repeated patterns';
    }
    
    // Check for excessive consonants without vowels (gibberish detection)
    const vowels = (value.match(/[aeiouAEIOU]/g) || []).length;
    if (letters > 5 && vowels < 1) {
      return 'Product name must contain vowels for readability';
    }
    
    // Check for valid characters
    if (!/^[a-zA-Z0-9\s\-\&\.\(\)\']+$/.test(value)) {
      return 'Product name contains invalid characters';
    }
    
    return null;
  },

  // Enhanced validation for brand names
  brandName: (value) => {
    if (!value) return 'Brand name is required';
    if (value.length < 2) return 'Brand name must be at least 2 characters';
    if (value.length > 50) return 'Brand name must be less than 50 characters';
    
    // Check for meaningful content - must have reasonable letter to number ratio
    const letters = (value.match(/[a-zA-Z]/g) || []).length;
    const numbers = (value.match(/[0-9]/g) || []).length;
    const totalLength = value.length;
    
    // If more than 50% of the content is numbers, it's likely not a real brand
    if (numbers / totalLength > 0.5) {
      return 'Brand name contains too many numbers - please use a real brand name';
    }
    
    // Must have at least 2 letters for a meaningful brand name
    if (letters < 2) {
      return 'Brand name must contain at least 2 letters';
    }
    
    // Check for repeated patterns (gibberish detection)
    if (/(.{2,})\1{2,}/.test(value)) {
      return 'Brand name contains suspicious repeated patterns';
    }
    
    // Check for excessive consonants without vowels (gibberish detection)
    const vowels = (value.match(/[aeiouAEIOU]/g) || []).length;
    if (letters > 4 && vowels < 1) {
      return 'Brand name must contain vowels for readability';
    }
    
    // Check for valid characters
    if (!/^[a-zA-Z0-9\s\-\&\.\(\)\']+$/.test(value)) {
      return 'Brand name contains invalid characters';
    }
    
    return null;
  },

  // Enhanced validation for user names
  userName: (value) => {
    if (!value) return 'Full name is required';
    if (value.length < 2) return 'Full name must be at least 2 characters';
    if (value.length > 50) return 'Full name must be less than 50 characters';
    
    // Check for meaningful content - must have reasonable letter content
    const letters = (value.match(/[a-zA-Z]/g) || []).length;
    const numbers = (value.match(/[0-9]/g) || []).length;
    
    // Name should be mostly letters
    if (letters < 2) {
      return 'Full name must contain at least 2 letters';
    }
    
    // Too many numbers in a name is suspicious
    if (numbers > letters) {
      return 'Full name contains too many numbers';
    }
    
    // Check for repeated patterns (gibberish detection)
    if (/(.{2,})\1{2,}/.test(value)) {
      return 'Full name contains suspicious repeated patterns';
    }
    
    // Check for valid characters (letters, spaces, common name punctuation)
    if (!/^[a-zA-Z\s\-\'\.\,]+$/.test(value)) {
      return 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods';
    }
    
    // Must have at least one vowel for readability
    const vowels = (value.match(/[aeiouAEIOU]/g) || []).length;
    if (letters > 3 && vowels < 1) {
      return 'Full name must contain vowels for readability';
    }
    
    return null;
  },

  // Enhanced validation for user emails
  userEmail: (value) => {
    if (!value) return 'Email address is required';
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    
    // Length validation
    if (value.length > 254) {
      return 'Email address is too long';
    }
    
    // Check for suspicious patterns
    const localPart = value.split('@')[0];
    const domain = value.split('@')[1];
    
    // Local part validation
    if (localPart.length > 64) {
      return 'Email local part is too long';
    }
    
    // Domain validation
    if (domain.length > 253) {
      return 'Email domain is too long';
    }
    
    // Check for valid domain format
    if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domain)) {
      return 'Please enter a valid email domain';
    }
    
    // Check for common typos in popular domains
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const suspiciousDomains = ['gmai.com', 'gmial.com', 'yahooo.com', 'hotmial.com'];
    
    if (suspiciousDomains.some(suspicious => domain.toLowerCase() === suspicious)) {
      return 'Please check your email domain for typos';
    }
    
    return null;
  },

  // Enhanced validation for user roles
  userRole: (value) => {
    if (!value) return 'Role is required';
    
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(value)) {
      return 'Role must be either user or admin';
    }
    
    return null;
  },

  // Enhanced phone validation for users (required)
  userPhone: (value) => {
    if (!value || value.trim() === '') {
      return 'Phone number is required';
    }
    
    // Remove any non-digit characters for validation
    const cleanPhone = value.replace(/\D/g, '');
    
    // Must be exactly 10 digits
    if (cleanPhone.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    
    // Should start with a valid digit (not 0 or 1 for US numbers)
    if (cleanPhone.startsWith('0') || cleanPhone.startsWith('1')) {
      return 'Phone number should start with digits 2-9';
    }
    
    return null;
  },

  // Enhanced password validation (stricter than basic)
  userPassword: (value) => {
    if (!value) return 'Password is required';
    
    if (value.length < 8) return 'Password must be at least 8 characters long';
    if (value.length > 128) return 'Password is too long (maximum 128 characters)';
    
    // Character type requirements
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character (@$!%*?&)';
    
    // Check for common weak patterns
    const weakPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i
    ];
    
    if (weakPatterns.some(pattern => pattern.test(value))) {
      return 'Password contains common weak patterns - please choose a stronger password';
    }
    
    // Check for repeated characters (more than 2 in a row)
    if (/(.)\1{2,}/.test(value)) {
      return 'Password should not contain more than 2 repeated characters in a row';
    }
    
    return null;
  },

  // Enhanced validation for SKU (8-12 alphanumeric characters)
  productSKU: (value) => {
    if (!value) return 'SKU is required';
    // SKU should be 8-12 alphanumeric characters only
    if (!/^[A-Z0-9]{8,12}$/i.test(value)) {
      return 'SKU must be 8-12 alphanumeric characters (letters and numbers only)';
    }
    return null;
  },

  // Enhanced validation for price
  productPrice: (value) => {
    if (!value) return 'Price is required';
    const price = parseFloat(value);
    if (isNaN(price)) return 'Price must be a valid number';
    if (price <= 0) return 'Price must be greater than 0';
    if (price > 50000) return 'Price cannot exceed ₹50,000';
    if (price < 1) return 'Price must be at least ₹1';
    // Check for reasonable decimal places (max 2)
    if (value.toString().includes('.') && value.toString().split('.')[1].length > 2) {
      return 'Price can have maximum 2 decimal places';
    }
    return null;
  },

  // Enhanced validation for stock
  stockQuantity: (value) => {
    if (value === '' || value === null || value === undefined) return 'Stock quantity is required';
    const stock = parseInt(value);
    if (isNaN(stock)) return 'Stock must be a valid number';
    if (stock < 0) return 'Stock cannot be negative';
    if (stock > 1000000) return 'Stock quantity seems unreasonably high';
    if (!Number.isInteger(parseFloat(value))) return 'Stock must be a whole number';
    return null;
  },

  url: (value) => {
    try {
      if (value) new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  optionalUrl: (value) => {
    // Debug what we're getting
    console.log('optionalUrl validation - input:', {
      value: value,
      type: typeof value,
      length: value?.length,
      isEmpty: !value,
      isString: typeof value === 'string'
    });
    
    // Handle undefined, null, or empty string cases
    if (value === undefined || value === null || value === '') {
      console.log('optionalUrl: empty value detected, returning valid');
      return null; // Optional field, so empty is valid
    }
    
    // Convert to string and trim
    const stringValue = String(value).trim();
    console.log('optionalUrl: after string conversion and trim:', stringValue);
    
    // Empty after trimming is also valid
    if (stringValue === '') {
      console.log('optionalUrl: empty after trim, returning valid');
      return null;
    }
    
    // Allow relative paths starting with / or ./
    if (stringValue.startsWith('/') || stringValue.startsWith('./') || stringValue.startsWith('../')) {
      console.log('optionalUrl: relative path detected, should be valid');
      return null; // All relative paths are valid
    }
    
    // Allow paths without protocol (might be relative)
    if (!stringValue.includes('://') && !stringValue.startsWith('//')) {
      console.log('optionalUrl: path without protocol, treating as relative');
      return null; // Treat as relative path
    }
    
    // For full URLs, validate with URL constructor
    try {
      new URL(stringValue);
      console.log('optionalUrl: valid URL detected');
      return null;
    } catch (error) {
      console.log('optionalUrl: invalid URL, error:', error.message);
      return 'Please enter a valid URL or relative path (e.g., /images/product.jpg)';
    }
  },

  creditCard: (value) => {
    if (!value) return 'Credit card number is required';
    const cleaned = value.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) {
      return 'Credit card number must be 13-19 digits';
    }
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    if (sum % 10 !== 0) {
      return 'Invalid credit card number';
    }
    return null;
  },

  expiryDate: (value) => {
    if (!value) return 'Expiry date is required';
    const [month, year] = value.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return 'Expiry date must be in MM/YY format';
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) {
      return 'Invalid month';
    }
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'Card has expired';
    }
    return null;
  },

  cvv: (value) => {
    if (!value) return 'CVV is required';
    if (!/^\d{3,4}$/.test(value)) {
      return 'CVV must be 3 or 4 digits';
    }
    return null;
  },

  // Image validation rules
  imageUrls: (value, fieldName = 'Images') => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return `At least one ${fieldName.toLowerCase()} is required`;
    }
    
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const url = value[i];
        const error = validationRules.imageUrl(url);
        if (error) {
          return `Image ${i + 1}: ${error}`;
        }
      }
    } else {
      return validationRules.imageUrl(value);
    }
    
    return null;
  },

  imageUrl: (value) => {
    if (!value || typeof value !== 'string') {
      return 'Image URL is required';
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return 'Image URL cannot be empty';
    }

    // Check for valid image extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (!imageExtensions.test(trimmedValue)) {
      return 'Image URL must end with a valid image extension (.jpg, .jpeg, .png, .gif, .webp, .svg)';
    }

    // Check if it's a valid URL or relative path
    const absoluteUrlPattern = /^https?:\/\/.+/i;
    const relativePathPattern = /^\/[^/].*/;
    const isValidAbsolute = absoluteUrlPattern.test(trimmedValue);
    const isValidRelative = relativePathPattern.test(trimmedValue);

    if (!isValidAbsolute && !isValidRelative) {
      return 'Image must be a valid URL (https://...) or relative path (/images/...)';
    }

    // Additional URL validation for absolute URLs
    if (isValidAbsolute) {
      try {
        new URL(trimmedValue);
      } catch {
        return 'Invalid image URL format';
      }
    }

    return null;
  },

  imageArrayLength: (min = 1, max = 5) => (value, fieldName = 'Images') => {
    if (!Array.isArray(value)) {
      return `${fieldName} must be an array`;
    }
    
    if (value.length < min) {
      return `At least ${min} ${fieldName.toLowerCase()} ${min === 1 ? 'is' : 'are'} required`;
    }
    
    if (value.length > max) {
      return `Maximum ${max} ${fieldName.toLowerCase()} allowed`;
    }
    
    return null;
  },

  imageFile: (file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) => {
    if (!file) {
      return 'Image file is required';
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} not allowed. Use: ${allowedTypes.join(', ')}`;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  }
};

// Custom validation hook
export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value, allValues = values) => {
    const rules = validationSchema[name];
    if (!rules) return null;

    for (const rule of rules) {
      let error;
      if (typeof rule === 'function') {
        error = rule(value, name, allValues);
      } else if (typeof rule === 'object' && rule.validator) {
        error = rule.validator(value, allValues[rule.dependsOn], name);
      }
      if (error) return error;
    }
    return null;
  }, [validationSchema, values]);

  const validateForm = useCallback((formValues = values) => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, formValues[fieldName], formValues);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
      // Don't add null errors to the object
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [validationSchema, validateField, values]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name]; // Remove the field from errors when valid
        }
        return newErrors;
      });
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name]; // Remove the field from errors when valid
      }
      return newErrors;
    });
  }, [validateField, values]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    setTouched(Object.keys(validationSchema).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    const isValid = validateForm();
    if (isValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    setIsSubmitting(false);
    return isValid;
  }, [validateForm, validationSchema, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateForm,
    setValues,
    setErrors
  };
};

// Input formatting utilities
export const formatters = {
  creditCard: (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  },

  expiryDate: (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  },

  phone: (value) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};

// Accessibility helpers
export const getAriaAttributes = (fieldName, error, touched) => ({
  'aria-invalid': touched && error ? 'true' : 'false',
  'aria-describedby': error ? `${fieldName}-error` : undefined
});