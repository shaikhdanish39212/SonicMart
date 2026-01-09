import React, { useState } from 'react';
import ImageUpload from '../components/form/ImageUpload';
import { validationRules } from '../utils/validation';

const ImageUploadTest = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleImageChange = (name, value) => {
    console.log('Image change:', name, value);
    setImages(value);
    
    // Validate images
    const validationError = validationRules.imageUrls(value, 'Images');
    setError(validationError);
  };

  const handleImageBlur = (name, errorMessage) => {
    console.log('Image blur:', name, errorMessage);
    setTouched(true);
    if (errorMessage) {
      setError(errorMessage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with images:', images);
    console.log('Current error:', error);
    
    if (!error && images.length > 0) {
      alert(`Success! ${images.length} images uploaded:\n${images.join('\n')}`);
    } else {
      alert('Please fix the errors before submitting');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            Full File Path Display System
          </h1>
          <p className="text-gray-600 mb-8">
            Upload image files and see their complete file paths from your computer. 
            Perfect for tracking exactly where your files are located!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ImageUpload
              name="images"
              label="Product Images"
              images={images}
              error={error}
              touched={touched}
              onChange={handleImageChange}
              onBlur={handleImageBlur}
              maxImages={5}
              maxSizePerImageMB={5}
              required
              className="w-full"
            />

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>Current images: {images.length}</p>
                <p>Validation status: {error ? '❌ Error' : images.length > 0 ? '✅ Valid' : '⚠️ No images'}</p>
              </div>
              
              <div className="space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setImages([]);
                    setError(null);
                    setTouched(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </form>

          {/* Debug Information */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Debug Information:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Images Array:</strong>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-x-auto">
                  {JSON.stringify(images, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Error:</strong> 
                <span className={`ml-2 ${error ? 'text-red-600' : 'text-green-600'}`}>
                  {error || 'None'}
                </span>
              </div>
              <div>
                <strong>Touched:</strong> 
                <span className={`ml-2 ${touched ? 'text-blue-600' : 'text-gray-600'}`}>
                  {touched ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-brand-dark mb-2">Features to Test:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>� <strong>File Upload:</strong> Click to select images from your device</li>
              <li>⤴️ <strong>Drag & Drop:</strong> Drag images directly onto the upload area</li>
              <li>🔗 <strong>Auto URL Generation:</strong> URLs are automatically created when you upload</li>
              <li>📂 <strong>Full File Path Display:</strong> See complete file paths from your computer</li>
              <li>� <strong>Image Path Display:</strong> See paths in /images/filename format</li>
              <li>🖼️ <strong>Preview:</strong> Visual preview with image management</li>
              <li>🔄 <strong>Reorder:</strong> Drag images to reorder them</li>
              <li>❌ <strong>Remove:</strong> Delete individual images</li>
              <li>✅ <strong>Validation:</strong> Real-time validation with error messages</li>
              <li>🏷️ <strong>Primary Image:</strong> First image becomes the main product image</li>
              <li>📊 <strong>Limits:</strong> Max 5 images, 5MB each</li>
              <li>🎯 <strong>Type Support:</strong> JPEG, PNG, WebP</li>
              <li>⚡ <strong>Upload Simulation:</strong> Simulates real server upload with progress</li>
            </ul>
          </div>

          {/* Usage Instructions */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-brand-dark mb-2">How to Use:</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>1. Upload Images:</strong> Click the upload area or drag & drop images</p>
              <p><strong>2. Auto URL Generation:</strong> Watch as URLs are automatically created (e.g., <code className="bg-white px-1 rounded">/uploads/products/1695123456_image.jpg</code>)</p>
              <p><strong>3. Manage Images:</strong> Reorder by dragging, remove unwanted images</p>
              <p><strong>4. Submit:</strong> URLs are ready for saving to your database</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadTest;