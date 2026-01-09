const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const testSeeder = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Count existing products
    const existingCount = await Product.countDocuments();
    console.log(`📊 Current products in database: ${existingCount}`);
    
    // Test creating a single product
    const testProduct = {
      name: 'Test Product',
      description: 'Test description',
      price: 99.99,
      originalPrice: 129.99,
      discount: 23,
      category: 'speakers',
      brand: 'TestBrand',
      model: 'TEST-001',
      image: '/images/test.png',
      sku: 'TEST001',
      stock: 50
    };
    
    console.log('🧪 Testing product creation...');
    const createdProduct = await Product.create(testProduct);
    console.log('✅ Test product created successfully:', createdProduct.name);
    
    // Clean up test product
    await Product.findByIdAndDelete(createdProduct._id);
    console.log('🧹 Test product cleaned up');
    
    console.log('🎉 Database connection and product creation working correctly!');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error in test seeder:', error);
    process.exit(1);
  }
};

testSeeder();