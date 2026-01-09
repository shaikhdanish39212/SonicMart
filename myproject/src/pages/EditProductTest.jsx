import React, { useState } from 'react';
import ProductForm from '../components/admin/ProductForm';

const EditProductTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample product data with images (similar to what comes from the backend)
  const sampleProduct = {
    _id: "sample123",
    name: "Premium Studio Headphones",
    description: "Experience crystal clear sound with these professional-grade headphones. Perfect for studio recording, mixing, and casual listening.",
    price: 299.99,
    category: "headphones",
    brand: "AudioTech",
    stock: 50,
    sku: "ATH001",
    image: "/images/HeadPhones1.png",
    galleryImages: [
      "/images/HeadPhones1.1.png",
      "/images/HeadPhones1.2.png",
      "/images/HeadPhones1.3.png"
    ]
  };

  const handleSave = (formData) => {
    console.log('Form saved with data:', formData);
    alert('Product saved! Check console for data.');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            Edit Product Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test the edit functionality with existing product images.
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Sample Product Data:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Name:</strong> {sampleProduct.name}</p>
                <p><strong>Main Image:</strong> {sampleProduct.image}</p>
                <p><strong>Gallery Images:</strong> {sampleProduct.galleryImages.join(', ')}</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-coral text-white px-6 py-3 rounded-lg hover:bg-brand-coral/90 transition-colors"
            >
              Edit Product (Test)
            </button>

            {isModalOpen && (
              <ProductForm
                product={sampleProduct}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">Expected Behavior:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>✅ When you click "Edit Product", the form should open</li>
              <li>✅ The form should show all existing images in the "Product Images" section</li>
              <li>✅ You should see 4 images total (1 main + 3 gallery images)</li>
              <li>✅ Images should have "EXISTING" badges</li>
              <li>✅ Full File Paths section should show paths for existing images</li>
              <li>✅ You can add new images alongside existing ones</li>
              <li>✅ You can remove existing images</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductTest;