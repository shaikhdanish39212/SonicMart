import React, { useState } from 'react';
import ImageUpload from '../components/form/ImageUpload';

const NewImageUploadTest = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

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

  const simulateFormSubmission = () => {
    console.log('Would submit these image paths to backend:', images);
    alert(`Simulating form submission with ${images.length} images:\n${images.join('\n')}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            New Image Upload Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test uploading NEW images (not existing product images). This should work with blob URLs for preview.
          </p>

          {/* Status Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-900 mb-2">Test Instructions:</h3>
            <ol className="text-green-800 space-y-1 list-decimal list-inside">
              <li>Click "Drop images here or click to browse" below</li>
              <li>Select some image files from your computer</li>
              <li>Verify that the uploaded images show as thumbnails (not broken icons)</li>
              <li>Check that the console doesn't show image loading errors</li>
              <li>Verify the blob URLs are working for preview</li>
            </ol>
          </div>

          {/* Image Upload Component */}
          <div className="space-y-6">
            <ImageUpload
              name="newImages"
              label="Upload New Images (Test)"
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

          {/* Test Controls */}
          <div className="mt-8 space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setImages([]);
                  setError(null);
                  setTouched(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={simulateFormSubmission}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Simulate Form Submit
              </button>
            </div>
          </div>

          {/* Debug Information */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Debug Information:</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Images Array Length:</strong> {images.length}</div>
              <div><strong>Error:</strong> {error || 'None'}</div>
              <div><strong>Touched:</strong> {touched ? 'Yes' : 'No'}</div>
              {images.length > 0 && (
                <div>
                  <strong>Image Paths:</strong>
                  <pre className="mt-1 text-xs bg-white p-2 rounded overflow-x-auto">
{JSON.stringify(images, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Expected vs Actual Behavior */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">✅ Expected Behavior:</h3>
              <ul className="text-green-800 space-y-1 text-sm">
                <li>• New images show as thumbnails immediately</li>
                <li>• No broken image icons</li>
                <li>• No console errors about failed image loading</li>
                <li>• Image paths are saved for backend submission</li>
                <li>• Component doesn't reinitialize and lose blob URLs</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">❌ Problem We're Fixing:</h3>
              <ul className="text-red-800 space-y-1 text-sm">
                <li>• New uploads showing as broken image icons</li>
                <li>• Console errors about failed /images/filename.png loads</li>
                <li>• Component reinitializing and losing blob URLs</li>
                <li>• Trying to load files that don't exist on server yet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewImageUploadTest;