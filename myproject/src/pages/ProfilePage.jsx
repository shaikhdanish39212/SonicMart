import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaLock, 
  FaCog, 
  FaBell, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaEye, 
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaGenderless,
  FaMapMarkerAlt,
  FaTrash,
  FaShieldAlt,
  FaKey,
  FaUserShield,
  FaExclamationTriangle,
  FaExclamationCircle
} from 'react-icons/fa';
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    password: '',
    confirmText: '',
    isDeleting: false
  });
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    avatar: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, strength: 'Very Weak', color: 'text-red-500', feedback: [] };
    
    let score = 0;
    const feedback = [];
    
    if (password.length >= 8) score++;
    else feedback.push('at least 8 characters');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('lowercase letters');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('uppercase letters');
    
    if (/\d/.test(password)) score++;
    else feedback.push('numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('special characters');
    
    const strengthLevels = [
      { strength: 'Very Weak', color: 'text-red-500' },
      { strength: 'Weak', color: 'text-red-400' },
      { strength: 'Fair', color: 'text-yellow-500' },
      { strength: 'Good', color: 'text-blue-500' },
      { strength: 'Strong', color: 'text-green-500' }
    ];
    
    return {
      score,
      ...strengthLevels[score],
      feedback
    };
  };

  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);

  useEffect(() => {
    if (user) {
      const newFormData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: user.address ? (typeof user.address === 'string' ? user.address : user.address.street || '') : '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      };
      
      setFormData(newFormData);
      
      // Clear any validation errors when loading user data
      setValidationErrors({});
      
      // Don't validate existing data on load - only validate when user is actively editing
      // This prevents annoying error messages for incomplete but optional profile fields
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Dynamic input filtering and validation
    let filteredValue = value;
    
    switch (name) {
      case 'name':
        // Only allow letters, spaces, hyphens, apostrophes
        filteredValue = value.replace(/[^a-zA-Z\s'-]/g, '');
        // Prevent excessive repeated characters
        filteredValue = filteredValue.replace(/(.)\1{3,}/g, '$1$1');
        // Prevent multiple consecutive spaces
        filteredValue = filteredValue.replace(/\s{2,}/g, ' ');
        // Limit length
        if (filteredValue.length > 50) filteredValue = filteredValue.substring(0, 50);
        break;
        
      case 'phone':
        // Only allow digits
        filteredValue = value.replace(/\D/g, '');
        // Limit to 10 digits
        if (filteredValue.length > 10) filteredValue = filteredValue.substring(0, 10);
        break;
        
      case 'address':
        // Allow address-appropriate characters
        filteredValue = value.replace(/[^a-zA-Z0-9\s,.\-#/()\n]/g, '');
        // Prevent excessive repeated characters (more strict)
        filteredValue = filteredValue.replace(/(.)\1{3,}/g, '$1$1');
        // Prevent keyboard patterns and gibberish sequences
        const addressGibberishPatterns = [
          /qwerty|asdf|zxcv|hjkl|uiop|bnm|fgh|rty|dfg|cvb|xcv|vbn|ghj|tyu|hjk|jkl|lkj|poi|oiu|iuy|yui/gi,
          /[bcdfghjklmnpqrstvwxyz]{8,}/gi, // Too many consecutive consonants
        ];
        addressGibberishPatterns.forEach(pattern => {
          filteredValue = filteredValue.replace(pattern, '');
        });
        // Limit length
        if (filteredValue.length > 200) filteredValue = filteredValue.substring(0, 200);
        break;
        
      case 'bio':
        // Allow bio-appropriate characters
        filteredValue = value.replace(/[^a-zA-Z0-9\s.,!?'"\-():;&@#$%\n]/g, '');
        // Prevent excessive repeated characters (more strict)
        filteredValue = filteredValue.replace(/(.)\1{3,}/g, '$1$1');
        // Prevent keyboard patterns and gibberish sequences
        const gibberishPatterns = [
          /qwerty|asdf|zxcv|hjkl|uiop|bnm|fgh|rty|dfg|cvb|xcv|vbn|ghj|tyu|hjk|jkl|lkj|poi|oiu|iuy|yui/gi,
          /[bcdfghjklmnpqrstvwxyz]{8,}/gi, // Too many consecutive consonants
          /[aeiou]{6,}/gi, // Too many consecutive vowels
        ];
        gibberishPatterns.forEach(pattern => {
          filteredValue = filteredValue.replace(pattern, '');
        });
        // Limit length
        if (filteredValue.length > 500) filteredValue = filteredValue.substring(0, 500);
        break;
    }
    
    // Update form data with filtered value
    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));

    // Real-time validation with filtered value
    validateField(name, filteredValue);
  };

  const validateField = (fieldName, value) => {
    const errors = { ...validationErrors };

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required';
        } else if (value.length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else if (value.length > 50) {
          errors.name = 'Name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        } else if (/(.)\1{2,}/.test(value)) {
          errors.name = 'Name cannot contain repeated characters (like aaa)';
        } else if (!/^[a-zA-Z]/.test(value)) {
          errors.name = 'Name must start with a letter';
        } else if (/\s{2,}/.test(value)) {
          errors.name = 'Name cannot contain multiple consecutive spaces';
        } else if (value.split(' ').some(part => part.length < 2 && part.length > 0)) {
          errors.name = 'Each part of the name must be at least 2 characters';
        } else if (isGibberish(value)) {
          errors.name = 'Please enter a real name';
        } else if (hasRandomPattern(value)) {
          errors.name = 'Name appears to contain random characters';
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else if (value.length > 100) {
          errors.email = 'Email must be less than 100 characters';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = value.replace(/\D/g, '');
        // Phone is optional - only validate if user has entered something
        if (!value || !value.trim()) {
          delete errors.phone; // No error for empty phone
        } else if (!phoneRegex.test(cleanPhone)) {
          errors.phone = 'Please enter a valid 10-digit phone number';
        } else if (/^(.)\1{9}$/.test(cleanPhone)) {
          errors.phone = 'Phone number cannot be all the same digit';
        } else if (['0000000000', '1111111111', '1234567890', '0123456789'].includes(cleanPhone)) {
          errors.phone = 'Please enter a real phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'dateOfBirth':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          const minDate = new Date('1900-01-01');
          const maxAge = 150;
          const minAgeDate = new Date();
          minAgeDate.setFullYear(today.getFullYear() - maxAge);
          
          if (isNaN(selectedDate.getTime())) {
            errors.dateOfBirth = 'Please enter a valid date';
          } else if (selectedDate > today) {
            errors.dateOfBirth = 'Date of birth cannot be in the future';
          } else if (selectedDate < minDate) {
            errors.dateOfBirth = 'Please enter a realistic date of birth';
          } else if (selectedDate < minAgeDate) {
            errors.dateOfBirth = 'Age cannot exceed 150 years';
          } else {
            // Check if user is at least 13 years old
            const minAgeForRegistration = new Date();
            minAgeForRegistration.setFullYear(today.getFullYear() - 13);
            if (selectedDate > minAgeForRegistration) {
              errors.dateOfBirth = 'You must be at least 13 years old';
            } else {
              delete errors.dateOfBirth;
            }
          }
        } else {
          delete errors.dateOfBirth;
        }
        break;
      case 'address':
        if (value && value.trim()) {
          const trimmedValue = value.trim();
          if (trimmedValue.length < 10) {
            errors.address = 'Address must be at least 10 characters';
          } else if (trimmedValue.length > 200) {
            errors.address = 'Address must be less than 200 characters';
          } else if (!/^[a-zA-Z0-9\s,.\-#/()]+$/.test(trimmedValue)) {
            errors.address = 'Address contains invalid characters';
          } else if (/(.)\1{4,}/.test(trimmedValue)) {
            errors.address = 'Address cannot contain long sequences of repeated characters';
          } else if (!/[a-zA-Z]/.test(trimmedValue)) {
            errors.address = 'Address must contain at least some letters';
          } else if (!/\d/.test(trimmedValue) && !/street|road|avenue|lane|drive|way|place|court|circle|blvd|st|rd|ave|ln|dr|pl|ct|cir/i.test(trimmedValue)) {
            errors.address = 'Please enter a complete address with number or street identifier';
          } else if (isGibberish(trimmedValue)) {
            errors.address = 'Please enter a real address';
          } else if (hasRandomPattern(trimmedValue)) {
          } else {

            delete errors.address;
          }
        } else {
          delete errors.address;
        }
        break;
      case 'bio':
        if (value && value.trim()) {
          const trimmedValue = value.trim();
          if (trimmedValue.length > 500) {
            errors.bio = 'Bio must be less than 500 characters';
          } else if (!/^[a-zA-Z0-9\s.,!?'"\-():;&@#$%]*$/.test(trimmedValue)) {
            errors.bio = 'Bio contains invalid characters';
          } else if (/(.)\1{4,}/.test(trimmedValue)) {
            errors.bio = 'Bio cannot contain long sequences of repeated characters';
          } else if (trimmedValue.length < 10) {
            errors.bio = 'Bio must be at least 10 characters if provided';
          } else if (!/[a-zA-Z]/.test(trimmedValue)) {
            errors.bio = 'Bio must contain meaningful text';
          } else if (trimmedValue.split(' ').filter(word => word.length > 2).length < 3) {
            errors.bio = 'Bio must contain at least 3 meaningful words';
          } else if (isGibberish(trimmedValue)) {
            errors.bio = 'Please enter meaningful text about yourself';
          } else if (hasRandomPattern(trimmedValue)) {
          } else {

            delete errors.bio;
          }
        } else {
          delete errors.bio;
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
  };

  // Helper function to detect gibberish
  const isGibberish = (text) => {
    if (!text) return false;
    
    // Check for common gibberish patterns
    const gibberishPatterns = [
      /^[a-z]{20,}$/i, // Long strings of only letters
      /([a-z])\1{3,}/i, // Repeated characters
      /(qwerty|asdf|zxcv|hjkl|uiop|bnm|fgh|rty|dfg|cvb|xcv|vbn|ghj|tyu|hjk|jkl|lkj|poi|oiu|iuy|yui)/i, // Keyboard patterns
      /^[bcdfghjklmnpqrstvwxyz]{10,}$/i, // Too many consonants
      /^[aeiou]{5,}$/i, // Too many vowels
      /(abc|def|ghi|jkl|mno|pqr|stu|vwx|xyz){2,}/i, // Alphabetical sequences
      /(123|456|789|012|345|678|901|234|567|890)/g, // Number sequences
    ];
    
    return gibberishPatterns.some(pattern => pattern.test(text));
  };

  // Helper function to detect random patterns
  const hasRandomPattern = (text) => {
    if (!text || text.length < 10) return false;
    
    // Calculate vowel to consonant ratio
    const vowels = (text.match(/[aeiou]/gi) || []).length;
    const consonants = (text.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
    const total = vowels + consonants;
    
    if (total === 0) return true;
    
    const vowelRatio = vowels / total;
    
    // Normal text should have 30-50% vowels
    if (vowelRatio < 0.1 || vowelRatio > 0.7) return true;
    
    // Check for lack of common English patterns
    const commonPatterns = /(th|he|in|er|an|re|ed|nd|on|en|at|ou|ea|ha|ng|as|or|ti|is|et|it|ar|te|se|hi|of|be|to|de|le|me|ma|ne|we|no|ce|li|la|el|al|ve|co|mp|nt|ll|ss|ee|oo|ff|st|nd|ch|sh)/gi;
    const matches = (text.match(commonPatterns) || []).length;
    const words = text.split(/\s+/).length;
    
    // Expect at least 1 common pattern per 3 characters in normal text
    return matches < (text.length / 5);
  };

  // Handle paste events to prevent gibberish content
  const handlePaste = (e) => {
    const { name } = e.target;
    const pastedText = e.clipboardData.getData('text');
    
    // Check if pasted content is gibberish
    if (isGibberish(pastedText) || hasRandomPattern(pastedText)) {
      e.preventDefault();
      toast.error('Pasted content appears to be invalid. Please enter meaningful text.');
      return;
    }
    
    // Allow paste but filter it through our validation
    e.preventDefault();
    const { target } = e;
    const currentValue = target.value;
    const newValue = currentValue + pastedText;
    
    // Trigger input change with filtered value
    target.value = newValue;
    handleInputChange({ target: { name, value: newValue } });
  };

  // Synchronous validation function for save operation
  const validateFieldSync = (fieldName, value, errors) => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required';
        } else if (value.length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else if (value.length > 50) {
          errors.name = 'Name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        } else if (/(.)\1{2,}/.test(value)) {
          errors.name = 'Name cannot contain repeated characters (like aaa)';
        } else if (!/^[a-zA-Z]/.test(value)) {
          errors.name = 'Name must start with a letter';
        } else if (/\s{2,}/.test(value)) {
          errors.name = 'Name cannot contain multiple consecutive spaces';
        } else if (value.split(' ').some(part => part.length < 2 && part.length > 0)) {
          errors.name = 'Each part of the name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;
      case 'phone':
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = value.replace(/\D/g, '');
        // Phone is optional - only validate if user has entered something
        if (!value || !value.trim()) {
          delete errors.phone; // No error for empty phone
        } else if (!phoneRegex.test(cleanPhone)) {
          errors.phone = 'Please enter a valid 10-digit phone number';
        } else if (/^(.)\1{9}$/.test(cleanPhone)) {
          errors.phone = 'Phone number cannot be all the same digit';
        } else if (['0000000000', '1111111111', '1234567890', '0123456789'].includes(cleanPhone)) {
          errors.phone = 'Please enter a real phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'address':
        if (value && value.trim()) {
          const trimmedValue = value.trim();
          if (trimmedValue.length < 10) {
            errors.address = 'Address must be at least 10 characters';
          } else if (trimmedValue.length > 200) {
            errors.address = 'Address must be less than 200 characters';
          } else if (!/^[a-zA-Z0-9\s,.\-#/()]+$/.test(trimmedValue)) {
            errors.address = 'Address contains invalid characters';
          } else if (/(.)\1{4,}/.test(trimmedValue)) {
            errors.address = 'Address cannot contain long sequences of repeated characters';
          } else if (!/[a-zA-Z]/.test(trimmedValue)) {
            errors.address = 'Address must contain at least some letters';
          } else if (!/\d/.test(trimmedValue) && !/street|road|avenue|lane|drive|way|place|court|circle|blvd|st|rd|ave|ln|dr|pl|ct|cir/i.test(trimmedValue)) {
            errors.address = 'Please enter a complete address with number or street identifier';
          } else if (isGibberish(trimmedValue)) {
            errors.address = 'Please enter a real address';
          } else if (hasRandomPattern(trimmedValue)) {
          } else {

            delete errors.address;
          }
        } else {
          delete errors.address;
        }
        break;
      case 'bio':
        if (value && value.trim()) {
          const trimmedValue = value.trim();
          if (trimmedValue.length > 500) {
            errors.bio = 'Bio must be less than 500 characters';
          } else if (!/^[a-zA-Z0-9\s.,!?'"\-():;&@#$%]*$/.test(trimmedValue)) {
            errors.bio = 'Bio contains invalid characters';
          } else if (/(.)\1{4,}/.test(trimmedValue)) {
            errors.bio = 'Bio cannot contain long sequences of repeated characters';
          } else if (trimmedValue.length < 10) {
            errors.bio = 'Bio must be at least 10 characters if provided';
          } else if (!/[a-zA-Z]/.test(trimmedValue)) {
            errors.bio = 'Bio must contain meaningful text';
          } else if (trimmedValue.split(' ').filter(word => word.length > 2).length < 3) {
            errors.bio = 'Bio must contain at least 3 meaningful words';
          } else if (isGibberish(trimmedValue)) {
            errors.bio = 'Please enter meaningful text about yourself';
          } else if (hasRandomPattern(trimmedValue)) {
          } else {

            delete errors.bio;
          }
        } else {
          delete errors.bio;
        }
        break;
      // Add other cases as needed
      default:
        break;
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate all fields before saving using synchronous validation
      const newErrors = {};
      
      validateFieldSync('name', formData.name, newErrors);
      validateFieldSync('phone', formData.phone, newErrors);
      validateFieldSync('address', formData.address, newErrors);
      validateFieldSync('bio', formData.bio, newErrors);
      
      // Check if there are any validation errors
      const hasErrors = Object.keys(newErrors).some(key => newErrors[key]);
      if (hasErrors) {
        setValidationErrors(newErrors);
        toast.error('Please fix the validation errors before saving');
        return;
      }

      // Format the data properly for backend
      const profileData = {};

      // Only include fields that have values
      if (formData.name && formData.name.trim()) {
        profileData.name = formData.name.trim();
      }

      // Always include phone field (empty string if blank to clear existing phone)
      profileData.phone = formData.phone ? formData.phone.trim() : '';
      
      // Always include dateOfBirth field (empty string if blank to clear existing DOB)
      profileData.dateOfBirth = formData.dateOfBirth || '';
      
      // Always include gender field (empty string if blank to clear existing gender)
      profileData.gender = formData.gender || '';
      
      // Always include address field - send object if has content, empty string if blank to clear existing address
      if (formData.address && formData.address.trim()) {
        profileData.address = {
          street: formData.address.trim(),
          city: '',
          state: '',
          zipCode: '',
          country: 'India'
        };
      } else {
        profileData.address = ''; // Send empty string to clear address
      }
      
      // Always include bio field (empty string if blank to clear existing bio)
      profileData.bio = formData.bio ? formData.bio.trim() : '';

      console.log('Sending profile data:', profileData); // Debug log
      console.log('Form data before save:', formData); // Debug log

      const result = await updateProfile(profileData);
      
      if (result.success) {
        console.log('Profile update successful, refreshing user data...'); // Debug log
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        // Refresh user data to reflect changes
        const refreshResult = await refreshUser();
        console.log('Refresh user result:', refreshResult); // Debug log
      } else {
        const errorMessage = result.error || 'Failed to update profile';
        toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async () => {
    // Reset validation errors
    setValidationErrors(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    if (!passwordData.currentPassword) {
      setValidationErrors(prev => ({
        ...prev,
        currentPassword: 'Current password is required'
      }));
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: 'New passwords do not match'
      }));
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setValidationErrors(prev => ({
        ...prev,
        newPassword: 'New password must be at least 8 characters long'
      }));
      return;
    }

    // Check password strength
    const strength = calculatePasswordStrength(passwordData.newPassword);
    if (strength.score < 3) {
      setValidationErrors(prev => ({
        ...prev,
        newPassword: 'Password is too weak. Please use a stronger password.'
      }));
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      setValidationErrors(prev => ({
        ...prev,
        newPassword: 'New password must be different from current password'
      }));
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        toast.success('Password updated successfully!');
        
        // Refresh user data to get updated information
        await refreshUser();
        
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Clear any validation errors
        setValidationErrors(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        console.error('Password change failed:', data);
        
        // Handle specific validation errors
        if (data.message === 'Current password is incorrect') {
          setValidationErrors(prev => ({
            ...prev,
            currentPassword: 'Current password is incorrect'
          }));
        } else if (data.message && data.message.includes('New password must be')) {
          setValidationErrors(prev => ({
            ...prev,
            newPassword: data.message
          }));
        } else {
          toast.error(data.message || 'Failed to update password');
        }
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = async () => {
    // Validate required fields
    if (!deleteConfirmation.password) {
      setValidationErrors(prev => ({
        ...prev,
        deletePassword: 'Current password is required to delete account'
      }));
      return;
    }

    if (deleteConfirmation.confirmText !== 'DELETE MY ACCOUNT') {
      setValidationErrors(prev => ({
        ...prev,
        deleteConfirmText: 'Please type exactly "DELETE MY ACCOUNT" to confirm'
      }));
      return;
    }

    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: deleteConfirmation.password,
          confirmText: deleteConfirmation.confirmText
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        toast.success('Account deletion initiated. You will receive a confirmation email.');
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        if (data.message === 'Invalid password') {
          setValidationErrors(prev => ({
            ...prev,
            deletePassword: 'Current password is incorrect'
          }));
        } else {
          toast.error(data.message || 'Failed to delete account');
        }
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation({
      password: '',
      confirmText: '',
      isDeleting: false
    });
    setValidationErrors(prev => ({
      ...prev,
      deletePassword: '',
      deleteConfirmText: ''
    }));
  };

  const handleDeleteInputChange = (field, value) => {
    setDeleteConfirmation(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors[`delete${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setValidationErrors(prev => ({
        ...prev,
        [`delete${field.charAt(0).toUpperCase() + field.slice(1)}`]: ''
      }));
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaLock }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="mobile-container sm:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="px-4 py-4 sm:px-8 sm:py-6">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">My Profile</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide px-4 sm:px-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 mr-4 sm:mr-8 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors min-w-0`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-8">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white text-lg sm:text-2xl font-bold overflow-hidden">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        formData.name ? formData.name.charAt(0).toUpperCase() : (user.email?.[0] || 'U').toUpperCase()
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formData.name || user.email}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">{formData.email}</p>
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      Active Member
                    </span>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                      <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  // View Mode
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-center gap-3 p-3 sm:p-0">
                        <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-sm sm:text-base ${validationErrors.name ? 'text-red-600' : 'text-gray-900'}`}>
                              {formData.name || 'Not provided'}
                            </p>
                            {validationErrors.name && (
                              <FaExclamationTriangle className="w-4 h-4 text-red-500" title={validationErrors.name} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 sm:p-0">
                        <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 sm:p-0">
                        <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Phone Number</p>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-sm sm:text-base ${validationErrors.phone ? 'text-red-600' : formData.phone ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                              {formData.phone || 'Add phone number'}
                            </p>
                            {validationErrors.phone && (
                              <FaExclamationTriangle className="w-4 h-4 text-red-500" title={validationErrors.phone} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 sm:p-0">
                        <FaBirthdayCake className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Date of Birth</p>
                          <p className={`font-medium text-sm sm:text-base ${formData.dateOfBirth ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                            {formData.dateOfBirth || 'Add date of birth'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 sm:p-0">
                        <FaGenderless className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                          <p className={`font-medium text-sm sm:text-base ${formData.gender ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                            {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Add gender'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-start gap-3 p-3 sm:p-0">
                        <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Address</p>
                          <div className="flex items-start gap-2">
                            <p className={`font-medium text-sm sm:text-base ${validationErrors.address ? 'text-red-600' : formData.address ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                              {formData.address 
                                ? (typeof formData.address === 'string' 
                                    ? formData.address 
                                    : `${formData.address.street || ''}, ${formData.address.city || ''}, ${formData.address.state || ''} ${formData.address.zipCode || ''}, ${formData.address.country || ''}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '').replace(/^\s*,/, ''))
                                : 'Add address'
                              }
                            </p>
                            {validationErrors.address && (
                              <FaExclamationTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" title={validationErrors.address} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-0">
                        <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Bio</p>
                          <div className="flex items-start gap-2">
                            <p className={`font-medium text-sm sm:text-base ${validationErrors.bio ? 'text-red-600' : formData.bio ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                              {formData.bio || 'Add bio'}
                            </p>
                            {validationErrors.bio && (
                              <FaExclamationTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" title={validationErrors.bio} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onPaste={handlePaste}
                          autoComplete="name"
                          className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base ${
                            validationErrors.name 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-orange-500'
                          }`}
                          placeholder="e.g. John Smith"
                          maxLength="50"
                        />
                        {validationErrors.name && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <FaExclamationCircle className="w-3 h-3" />
                            <span>{validationErrors.name}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          autoComplete="tel"
                          className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base ${
                            validationErrors.phone 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-orange-500'
                          }`}
                          placeholder="e.g. 9876543210"
                          maxLength="10"
                          pattern="[0-9]{10}"
                        />
                        {validationErrors.phone && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <FaExclamationCircle className="w-3 h-3" />
                            <span>{validationErrors.phone}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          autoComplete="bday"
                          className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base ${
                            validationErrors.dateOfBirth 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-orange-500'
                          }`}
                          max={new Date().toISOString().split('T')[0]}
                          min="1900-01-01"
                        />
                        {validationErrors.dateOfBirth && (
                          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                            <FaExclamationCircle className="w-3 h-3" />
                            <span>{validationErrors.dateOfBirth}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          autoComplete="sex"
                          className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Address <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        autoComplete="street-address"
                        rows={3}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none text-gray-900 bg-white text-sm sm:text-base ${
                          validationErrors.address 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-orange-500'
                        }`}
                        placeholder="e.g. 123 Main Street, Apartment 4B, New York, NY 10001"
                        maxLength="200"
                      />
                      {validationErrors.address && (
                        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                          <FaExclamationCircle className="w-3 h-3" />
                          <span>{validationErrors.address}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Bio <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        onPaste={handlePaste}
                        rows={4}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none text-gray-900 bg-white text-sm sm:text-base ${
                          validationErrors.bio 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-orange-500'
                        }`}
                        placeholder="e.g. I'm a software developer who loves music and technology. I enjoy building innovative applications and exploring new programming languages."
                        maxLength="500"
                      />
                      <div className="flex justify-between items-center mt-1">
                        <div>
                          {validationErrors.bio && (
                            <div className="flex items-center gap-1 text-red-500 text-xs">
                              <FaExclamationCircle className="w-3 h-3" />
                              <span>{validationErrors.bio}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{formData.bio.length}/500</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        onClick={handleSave}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        <FaSave className="w-3 h-3 sm:w-4 sm:h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <FaShieldAlt className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Password & Security</h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        <FaKey className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 sm:px-4 sm:py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base transition-all duration-200 ${
                            validationErrors.currentPassword 
                              ? 'border-red-500 focus:ring-red-500 bg-red-50 shake' 
                              : passwordData.currentPassword 
                                ? 'border-green-500 focus:ring-green-500 bg-green-50'
                                : 'border-gray-300 focus:ring-orange-500'
                          }`}
                          placeholder="Enter your current password"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showCurrentPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                        {passwordData.currentPassword && !validationErrors.currentPassword && (
                          <div className="absolute inset-y-0 right-8 flex items-center">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Current Password Validation Error */}
                      {validationErrors.currentPassword && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-xs animate-fadeIn">
                          <FaExclamationCircle className="w-3 h-3" />
                          <span>{validationErrors.currentPassword}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* New Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        <FaLock className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 sm:px-4 sm:py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base transition-all duration-200 ${
                            validationErrors.newPassword 
                              ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                              : passwordData.newPassword && passwordStrength.score >= 3
                                ? 'border-green-500 focus:ring-green-500 bg-green-50'
                                : passwordData.newPassword
                                  ? 'border-yellow-500 focus:ring-yellow-500 bg-yellow-50'
                                  : 'border-gray-300 focus:ring-orange-500'
                          }`}
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNewPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Meter - Enhanced */}
                      {passwordData.newPassword && (
                        <div className="mt-3 space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600">Password Strength</span>
                            <span className={`text-xs font-bold transition-colors ${passwordStrength.color}`}>
                              {passwordStrength.strength}
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                                passwordStrength.score <= 1 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                passwordStrength.score <= 2 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                                passwordStrength.score <= 3 ? 'bg-gradient-to-r from-yellow-500 to-blue-500' :
                                passwordStrength.score <= 4 ? 'bg-gradient-to-r from-blue-500 to-green-500' :
                                'bg-gradient-to-r from-green-500 to-emerald-600'
                              }`}
                              style={{ width: `${Math.max((passwordStrength.score / 5) * 100, 8)}%` }}
                            ></div>
                          </div>
                          
                          {/* Password Requirements Checklist */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className={`flex items-center gap-2 ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                              {passwordData.newPassword.length >= 8 ? 
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              }
                              <span>At least 8 characters</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                              {/[a-z]/.test(passwordData.newPassword) ? 
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              }
                              <span>Lowercase letter</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                              {/[A-Z]/.test(passwordData.newPassword) ? 
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              }
                              <span>Uppercase letter</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${/\d/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                              {/\d/.test(passwordData.newPassword) ? 
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              }
                              <span>Number</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                              {/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              }
                              <span>Special character</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${passwordData.newPassword !== passwordData.currentPassword && passwordData.currentPassword ? 'text-green-600' : 'text-gray-500'}`}>
                              {passwordData.newPassword !== passwordData.currentPassword && passwordData.currentPassword ? 
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              }
                              <span>Different from current</span>
                            </div>
                          </div>
                          
                          {/* Security Tips */}
                          {passwordStrength.score < 3 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div className="text-xs text-yellow-800">
                                  <p className="font-medium">Make your password stronger:</p>
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    {passwordStrength.feedback.map((tip, index) => (
                                      <li key={index}>Add {tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* New Password Validation Error */}
                      {validationErrors.newPassword && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-xs animate-fadeIn">
                          <FaExclamationCircle className="w-3 h-3" />
                          <span>{validationErrors.newPassword}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        <FaLock className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 sm:px-4 sm:py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base transition-all duration-200 ${
                            validationErrors.confirmPassword 
                              ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                              : passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword
                                ? 'border-green-500 focus:ring-green-500 bg-green-50'
                                : passwordData.confirmPassword
                                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                  : 'border-gray-300 focus:ring-orange-500'
                          }`}
                          placeholder="Confirm your new password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                        {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                          <div className="absolute inset-y-0 right-8 flex items-center">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Password Match Indicator */}
                      {passwordData.confirmPassword && (
                        <div className="mt-2 animate-fadeIn">
                          {passwordData.newPassword === passwordData.confirmPassword ? (
                            <div className="flex items-center text-green-600 text-xs">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">Passwords match perfectly</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600 text-xs">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">Passwords do not match</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Confirm Password Validation Error */}
                      {validationErrors.confirmPassword && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-xs animate-fadeIn">
                          <FaExclamationCircle className="w-3 h-3" />
                          <span>{validationErrors.confirmPassword}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Update Password Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={
                          isUpdatingPassword ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword ||
                          passwordData.newPassword !== passwordData.confirmPassword ||
                          passwordStrength.score < 3
                        }
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                          isUpdatingPassword ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword ||
                          passwordData.newPassword !== passwordData.confirmPassword ||
                          passwordStrength.score < 3
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        <FaKey className="w-4 h-4" />
                        {isUpdatingPassword ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Updating Password...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <FaExclamationTriangle className="w-5 h-5" />
                    Danger Zone
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                    <p className="text-red-700 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Secure Delete Account Modal */}
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
          <div className="flex items-center gap-3 text-red-600">
            <FaExclamationTriangle className="w-6 h-6" />
            <h3 className="text-xl font-bold">Delete Account</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ This action is irreversible</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• All your data will be permanently deleted</li>
                <li>• Your orders and transaction history will be removed</li>
                <li>• You will lose access to your wishlist and cart</li>
                <li>• This action cannot be undone</li>
              </ul>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your current password to confirm
              </label>
              <div className="relative">
                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deleteConfirmation.password}
                  onChange={(e) => handleDeleteInputChange('password', e.target.value)}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 ${
                    validationErrors.deletePassword 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-gray-300 focus:ring-red-500 bg-white'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showDeletePassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.deletePassword && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <FaExclamationCircle className="w-3 h-3" />
                  <span>{validationErrors.deletePassword}</span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">"DELETE MY ACCOUNT"</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation.confirmText}
                onChange={(e) => handleDeleteInputChange('confirmText', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 ${
                  validationErrors.deleteConfirmText 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-red-500 bg-white'
                }`}
                placeholder="DELETE MY ACCOUNT"
              />
              {validationErrors.deleteConfirmText && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <FaExclamationCircle className="w-3 h-3" />
                  <span>{validationErrors.deleteConfirmText}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteConfirmation}
              disabled={
                deleteConfirmation.isDeleting ||
                !deleteConfirmation.password ||
                deleteConfirmation.confirmText !== 'DELETE MY ACCOUNT'
              }
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                deleteConfirmation.isDeleting ||
                !deleteConfirmation.password ||
                deleteConfirmation.confirmText !== 'DELETE MY ACCOUNT'
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {deleteConfirmation.isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash className="w-4 h-4" />
                  Delete My Account
                </>
              )}
            </button>
            <button
              onClick={handleDeleteModalClose}
              disabled={deleteConfirmation.isDeleting}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ProfilePage;
