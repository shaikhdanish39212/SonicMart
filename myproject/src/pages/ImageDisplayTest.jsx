import React, { useState } from 'react';
import ImageUpload from '../components/form/ImageUpload';

const ImageDisplayTest = () => {
  // Test with actual product image paths that exist in the public/images directory
  const [images, setImages] = useState([
    "/images/DJSpeaker1.png",
    "/images/HeadPhones1.png", 
    "/images/Microphone1.png"
  ]);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(true); // Set to true to show validation states

  const handleImageChange = (name, newImages) => {
    console.log('Images changed:', newImages);
    setImages(newImages);
  };

  const handleImageBlur = (name, errorMessage) => {
    console.log('Image blur:', name, errorMessage);
    setTouched(true);
    if (errorMessage) {
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            Image Display Test - Product Upload Modal Fix
          </h1>
          <p className="text-gray-600 mb-8">
            Testing the ImageUpload component with existing product images to verify the fix for image visibility issues.
          </p>

          {/* Status Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Current Test Status:</h3>
            <ul className="text-blue-800 space-y-1">
              <li><strong>Current Images:</strong> {images.length} loaded</li>
              <li><strong>Test Images:</strong> DJ Speaker, HeadPhones, Microphone</li>
              <li><strong>Expected Behavior:</strong> All images should display as thumbnails with no broken image icons</li>
              <li><strong>Error Status:</strong> {error ? `❌ ${error}` : '✅ No errors'}</li>
            </ul>
          </div>

          {/* Image Upload Component Test */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">ImageUpload Component Test:</h2>
            
            <ImageUpload
              name="testImages"
              label="Product Images (Test)"
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
          </div>

          {/* Manual Test Controls */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Manual Test Controls:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setImages(["/images/DJSpeaker1.png", "/images/DJSpeaker1.1.png", "/images/DJSpeaker1.2.png"])}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Load DJ Speaker Set
              </button>
              <button
                onClick={() => setImages(["/images/HeadPhones1.png", "/images/HeadPhones1.1.png", "/images/HeadPhones1.2.png"])}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Load HeadPhone Set
              </button>
              <button
                onClick={() => setImages([])}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear All Images
              </button>
            </div>
          </div>

          {/* Debug Information */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">Debug Information:</h3>
            <div className="text-sm text-yellow-800 space-y-2">
              <div><strong>Current Images:</strong></div>
              <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
{JSON.stringify(images, null, 2)}
              </pre>
              <div><strong>Component Error:</strong> {error || 'None'}</div>
              <div><strong>Touched State:</strong> {touched ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Expected Behavior Guide */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">✅ What Should Work Now:</h3>
            <ul className="text-green-800 space-y-1 text-sm">
              <li>• All existing product images should display as thumbnails (no broken image icons)</li>
              <li>• Image previews should show in the grid layout</li>
              <li>• Full file paths should be visible in the detailed section</li>
              <li>• Primary image should be marked with "P" badge</li>
              <li>• Hover effects should work on image thumbnails</li>
              <li>• Console should show successful image loading (check browser dev tools)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplayTest;