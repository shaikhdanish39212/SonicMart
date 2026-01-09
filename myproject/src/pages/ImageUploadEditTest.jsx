import React, { useState } from 'react';
import ImageUpload from '../components/form/ImageUpload';

const ImageUploadEditTest = () => {
  // Simulate existing product data with images
  const [productData, setProductData] = useState({
    id: 1,
    name: "Test Product",
    images: [
      "/images/DJSpeaker1.png",
      "/images/HeadPhones1.png",
      "/images/Microphone1.png"
    ]
  });

  const [formImages, setFormImages] = useState(productData.images);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleImageChange = (name, newImages) => {
    console.log('Images changed:', newImages);
    setFormImages(newImages);
    setProductData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleImageBlur = (name, errorMessage) => {
    console.log('Image blur:', name, errorMessage);
    setTouched(true);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError(null);
    }
  };

  const handleSave = () => {
    console.log('Saving product with updated images:', productData);
    alert(`Product saved with ${formImages.length} images!`);
  };

  const handleLoadDifferentProduct = () => {
    // Simulate loading a different product
    const newProduct = {
      id: 2,
      name: "Different Product",
      images: [
        "/images/Speakers1.png",
        "/images/EarBuds1.png"
      ]
    };
    setProductData(newProduct);
    setFormImages(newProduct.images);
    setError(null);
    setTouched(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            Edit Product Images Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test how the image upload component handles existing product images during editing.
          </p>

          {/* Product Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Current Product:</h3>
            <p className="text-blue-800">
              <strong>ID:</strong> {productData.id} | <strong>Name:</strong> {productData.name} | <strong>Images:</strong> {productData.images.length}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleLoadDifferentProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Load Different Product
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
          </div>

          {/* Image Upload Component */}
          <ImageUpload
            name="images"
            label="Product Images"
            images={formImages}
            error={error}
            touched={touched}
            onChange={handleImageChange}
            onBlur={handleImageBlur}
            maxImages={5}
            maxSizePerImageMB={5}
            required
            className="w-full"
          />

          {/* Current State Display */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Current State:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Form Images:</strong> {formImages.length} images</p>
              <p><strong>Validation Status:</strong> {error ? '❌ Error' : formImages.length > 0 ? '✅ Valid' : '⚠️ No images'}</p>
              <p><strong>Touched:</strong> {touched ? 'Yes' : 'No'}</p>
              {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">🧪 Test Instructions:</h3>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>The component should show existing images with "📁 EXISTING" badges</li>
              <li>Existing images should display their current paths and original URLs</li>
              <li>You can add new images which will show "📤 NEW" badges</li>
              <li>You can remove existing images or reorder them</li>
              <li>Changes should be reflected in the "Current State" section</li>
              <li>Click "Load Different Product" to test with different existing images</li>
              <li>The first image is always marked as "PRIMARY"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadEditTest;