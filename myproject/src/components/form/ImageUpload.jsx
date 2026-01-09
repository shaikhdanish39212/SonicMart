import React, { useState, useEffect, useCallback, useRef } from 'react';

const ImageUpload = ({
  name,
  label = "Product Images",
  images = [],
  onChange,
  onBlur,
  error,
  touched,
  maxImages = 5,
  maxSizePerImageMB = 5,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  required = false,
  disabled = false,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const fileInputRef = useRef(null);
  const onChangeRef = useRef(onChange);

  const hasError = touched && Boolean(error);
  const isValid = touched && !error && previewImages.length > 0;

  // Show notification function
  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000); // Auto-hide after 4 seconds
  };

  // Update onChange ref
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Stable onChange function to prevent infinite loops
  const stableOnChange = useCallback((fieldName, paths) => {
    if (onChangeRef.current && typeof onChangeRef.current === 'function') {
      setTimeout(() => {
        onChangeRef.current(fieldName, paths);
      }, 0);
    }
  }, []);

  // Initialize preview images from existing product images - NO parent notification
  useEffect(() => {
    console.log('ImageUpload: initializing with images:', images);
    console.log('ImageUpload: current previewImages count:', previewImages.length);
    
    // Only initialize if we don't already have preview images loaded
    // This prevents reinitializing with new file paths that don't exist yet
    if (images && images.length > 0 && previewImages.length === 0) {
      const imageObjects = images.map((url, index) => {
        const filename = url.split('/').pop() || `image-${index + 1}`;
        
        // Properly construct the URL for existing images
        let displayUrl = url;
        if (!url.startsWith('http') && !url.startsWith('blob:')) {
          // For local images, ensure they start with / for Vite static serving
          displayUrl = url.startsWith('/') ? url : `/${url}`;
        }
        
        return {
          id: `existing-${index}`,
          url: displayUrl,
          type: 'existing',
          name: filename,
          size: null,
          fullPath: `c:\\Users\\Danish Shaikh\\Downloads\\Project-20250920T184416Z-1-001\\Project\\myproject\\public\\images\\${filename}`,
          originalUrl: url, // Keep original for backend saving
          errorAttempted: false
        };
      });
      console.log('ImageUpload: setting preview images:', imageObjects);
      setPreviewImages(imageObjects);
    } else if (!images || images.length === 0) {
      console.log('ImageUpload: no images, clearing preview');
      // Clean up blob URLs before clearing
      previewImages.forEach(img => {
        if (img.url && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
      setPreviewImages([]);
    } else {
      console.log('ImageUpload: preserving existing preview images to avoid losing blob URLs');
      // We already have preview images and parent is sending new images
      // This typically happens when new images are uploaded and component gets re-rendered
      // We preserve existing preview images to avoid losing blob URLs for newly uploaded files
    }
    // If previewImages.length > 0 and images.length > 0, we don't reinitialize
    // This preserves blob URLs for newly uploaded files
  }, [JSON.stringify(images)]);

  const validateFile = (file) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    
    // Check file size
    const maxSizeBytes = maxSizePerImageMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${maxSizePerImageMB}MB`;
    }
    
    return null;
  };

  const handleFiles = (files) => {
    if (disabled || uploading) return;
    
    const fileArray = Array.from(files);
    
    // Check total file limit
    if (previewImages.length + fileArray.length > maxImages) {
      showNotification(`Maximum ${maxImages} images allowed. You can add ${maxImages - previewImages.length} more.`);
      return;
    }

    setUploading(true);
    const newImageObjects = [];
    const errors = [];

    fileArray.forEach((file, index) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      const imageObject = {
        id: `new-${Date.now()}-${index}`,
        url: blobUrl, // Blob URL for immediate preview
        type: 'new',
        file: file,
        name: file.name,
        size: file.size,
        fullPath: `c:\\Users\\Danish Shaikh\\Downloads\\Project-20250920T184416Z-1-001\\Project\\myproject\\public\\images\\${file.name}`,
        originalUrl: `/images/${file.name}`, // What gets saved to database
        errorAttempted: false
      };
      newImageObjects.push(imageObject);
    });

    if (errors.length > 0) {
      showNotification('File validation errors: ' + errors.join(', '));
      setUploading(false);
      return;
    }

    if (newImageObjects.length > 0) {
      console.log('Adding new images:', newImageObjects.map(img => ({ id: img.id, name: img.name, url: img.url })));
      
      setPreviewImages(prev => {
        const updatedImages = [...prev, ...newImageObjects];
        console.log('Updated preview images:', updatedImages.length);
        
        // Generate paths for the parent component
        const allPaths = updatedImages.map(img => img.originalUrl);
        console.log('Sending paths to parent:', allPaths);
        
        // Call parent onChange
        setTimeout(() => {
          stableOnChange(name, allPaths);
        }, 0);
        
        return updatedImages;
      });
    }
    
    setUploading(false);
  };

  const removeImage = (imageId) => {
    if (disabled) return;
    
    const imageToRemove = previewImages.find(img => img.id === imageId);
    
    // Clean up blob URL if it's a new image
    if (imageToRemove && imageToRemove.type === 'new' && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    const updatedImages = previewImages.filter(img => img.id !== imageId);
    setPreviewImages(updatedImages);

    // Update parent with remaining paths
    const allPaths = updatedImages.map(img => img.originalUrl);
    stableOnChange(name, allPaths);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
    // Clear input so same file can be selected again
    e.target.value = '';
  };

  const handleImageError = (imageId, event) => {
    console.log('Image error for ID:', imageId, 'src:', event.target.src);
    
    const imageIndex = previewImages.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return;

    const image = previewImages[imageIndex];
    
    // Don't handle errors for blob URLs (new images) - they should work
    if (image.type === 'new' && image.url.startsWith('blob:')) {
      console.log('Blob URL error - this should not happen:', image.url);
      return;
    }
    
    // Prevent infinite loops
    if (image.errorAttempted) {
      console.log('Image error already attempted for:', imageId);
      return;
    }
    
    // For existing images, try different URL formats
    if (image.type === 'existing') {
      const updatedImages = [...previewImages];
      const imageToUpdate = updatedImages[imageIndex];
      
      // Try removing the leading slash
      let fallbackUrl = imageToUpdate.originalUrl;
      if (fallbackUrl.startsWith('/')) {
        fallbackUrl = fallbackUrl.substring(1);
      } else {
        // Try adding the leading slash
        fallbackUrl = `/${fallbackUrl}`;
      }
      
      console.log('Attempting fallback URL for existing image:', fallbackUrl);
      
      imageToUpdate.url = fallbackUrl;
      imageToUpdate.errorAttempted = true;
      
      setPreviewImages(updatedImages);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <label className={`block text-sm font-medium ${hasError ? 'text-red-700' : 'text-gray-700'}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center space-x-2">
          {isValid && (
            <span className="text-green-600 text-sm">✓ Valid</span>
          )}
          <span className="text-sm text-gray-500">
            {previewImages.length}/{maxImages} images selected
          </span>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : hasError
            ? 'border-red-300 bg-red-50'
            : isValid
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileInput}
          onBlur={onBlur}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="text-center">
          <svg
            className={`mx-auto h-12 w-12 ${
              dragActive ? 'text-blue-400' : hasError ? 'text-red-400' : 'text-gray-400'
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <p className={`text-sm ${dragActive ? 'text-blue-600' : 'text-gray-600'}`}>
              <span className="font-medium">
                {dragActive ? 'Drop images here' : 'Drop images here or click to browse'}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {maxImages} images max • {maxSizePerImageMB}MB each • {allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Custom Notification */}
      {notification.show && (
        <div className={`p-4 rounded-lg border flex items-center space-x-3 ${
          notification.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex-shrink-0">
            {notification.type === 'error' ? (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification({ show: false, message: '', type: '' })}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Image Previews Section */}
      {previewImages.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-700">
                  Image Previews ({previewImages.length})
                </h3>
              </div>
              <span className="text-xs text-gray-500">Hover to remove</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {previewImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 aspect-square hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                >
                  {/* Image */}
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(image.id, e)}
                    onLoad={() => {
                      // Reset error state on successful load
                      if (image.errorAttempted) {
                        const imageIndex = previewImages.findIndex(img => img.id === image.id);
                        if (imageIndex !== -1) {
                          const updatedImages = [...previewImages];
                          updatedImages[imageIndex] = { ...image, errorAttempted: false };
                          setPreviewImages(updatedImages);
                        }
                      }
                    }}
                  />
                  
                  {/* Badges - Single badge logic */}
                  <div className="absolute top-1 left-1">
                    {index === 0 ? (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium shadow-sm">
                        P
                      </span>
                    ) : (
                      <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-medium shadow-sm">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-all duration-200 shadow-sm"
                    type="button"
                    disabled={disabled}
                    title="Remove image"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Image Name on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="text-white text-xs truncate font-medium">{image.name}</div>
                    {image.size && (
                      <div className="text-gray-300 text-xs">{(image.size / 1024).toFixed(1)}KB</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full File Paths Section */}
      {previewImages.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-amber-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4l2 2 4-4" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-700">Full File Paths</h3>
            </div>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-100">
            {previewImages.map((image, index) => (
              <div key={image.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {/* Image thumbnail and badge */}
                  <div className="flex-shrink-0 relative">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                      onError={(e) => {
                        // Simple fallback for thumbnails
                        if (image.type === 'existing' && image.url.startsWith('/')) {
                          e.target.src = image.url.substring(1);
                        } else {
                          e.target.style.display = 'none';
                        }
                      }}
                    />
                    {/* Badge overlay */}
                    <div className="absolute -top-1 -right-1">
                      {index === 0 ? (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm">P</span>
                      ) : (
                        <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium shadow-sm">{index + 1}</span>
                      )}
                    </div>
                  </div>
                  {/* All file info in one line with proper spacing */}
                  <div className="flex-1 min-w-0 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500">📁</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded border text-gray-800 truncate max-w-48">
                        {image.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500">📁</span>
                      <span className="text-xs font-mono bg-blue-50 px-2 py-1 rounded border text-blue-800 break-all leading-relaxed max-w-96">
                        {image.fullPath}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500">🔗</span>
                      <span className="font-mono bg-green-50 px-2 py-1 rounded border text-green-800 truncate">
                        {image.originalUrl}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-700">
            <strong>💡 Tip:</strong> Upload images and see their complete file paths from your computer. The first image will be marked as PRIMARY.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
