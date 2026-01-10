const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Helper function to convert image filename to product name
function imageToProductName(filename) {
  // Remove file extension
  const baseName = filename.replace(/\.(png|jpg|jpeg)$/i, '');

  // Remove version numbers (like .1, .2, .3)
  const nameWithoutVersion = baseName.replace(/\.\d+$/, '');

  // Split by underscore and capitalize each word
  return nameWithoutVersion
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase
}

// Helper function to generate category from filename
function getCategory(filename) {
  if (filename.startsWith('DJSpeaker_')) return 'dj-speakers';
  if (filename.startsWith('DrumsPercussion_')) return 'drums-percussion';
  if (filename.startsWith('EarBuds_') || filename.startsWith('Earbud_')) return 'earbuds';
  if (filename.startsWith('Earphones_')) return 'earphones';
  if (filename.startsWith('GuitarsBasses')) return 'guitars-basses';
  if (filename.startsWith('HeadPhones')) return 'headphones';
  if (filename.startsWith('Speakers_')) return 'speakers';
  return 'internal-components';
}

// Helper function to generate SKU
function generateSKU(category, name, index) {
  const categoryCode = category.replace('-', '').substring(0, 3).toUpperCase();
  return `IC-${categoryCode}-${String(index).padStart(3, '0')}`;
}

// Helper function to generate description
function generateDescription(name, category) {
  const descriptions = {
    'dj-speakers': `Professional ${name.toLowerCase()} designed for DJ and live sound applications. High-quality component for enhanced audio performance.`,
    'drums-percussion': `Premium ${name.toLowerCase()} for drums and percussion instruments. Crafted for durability and exceptional sound quality.`,
    'earbuds': `Advanced ${name.toLowerCase()} technology for wireless earbuds. Engineered for superior audio performance and reliability.`,
    'earphones': `High-performance ${name.toLowerCase()} component for professional earphones. Designed for exceptional audio clarity and durability.`,
    'guitars-basses': `Professional-grade ${name.toLowerCase()} for guitars and bass instruments. Premium component for enhanced tone and performance.`,
    'headphones': `Premium ${name.toLowerCase()} component for professional headphones. Engineered for exceptional audio quality and comfort.`,
    'speakers': `High-quality ${name.toLowerCase()} for speaker systems. Professional component designed for superior sound reproduction.`
  };

  return descriptions[category] || `Professional ${name.toLowerCase()} component for audio equipment.`;
}

// Helper function to generate brand based on category
function getBrand(category) {
  const brands = {
    'dj-speakers': 'DJPro Components',
    'drums-percussion': 'RhythmPro Parts',
    'earbuds': 'SoundMagic Tech',
    'earphones': 'AudioTech Parts',
    'guitars-basses': 'StringMaster Components',
    'headphones': 'HeadGear Parts',
    'speakers': 'BoomBox Components'
  };

  return brands[category] || 'AudioPro Components';
}

async function seedInternalComponents() {
  try {
    console.log('🔧 SEEDING INTERNAL COMPONENTS');
    console.log('==============================');

    await mongoose.connect(process.env.MONGODB_URI);

    // Check current product count
    const currentCount = await Product.countDocuments();
    console.log(`Current products in database: ${currentCount}`);

    // Get all internal component images
    const imagesDir = path.join(__dirname, '../../myproject/public/images/internal_components/images');
    const imageFiles = fs.readdirSync(imagesDir).filter(file =>
      /\.(png|jpg|jpeg)$/i.test(file) && !file.includes('.1.') && !file.includes('.2.') && !file.includes('.3.')
    );

    console.log(`Found ${imageFiles.length} main internal component images`);

    const products = [];
    let skuCounter = 1;

    for (const imageFile of imageFiles) {
      const category = getCategory(imageFile);
      const name = imageToProductName(imageFile);
      const brand = getBrand(category);
      const description = generateDescription(name, category);

      // Get gallery images (versions .1, .2, .3)
      const baseName = imageFile.replace(/\.(png|jpg|jpeg)$/i, '');
      const galleryImages = [];
      for (let i = 1; i <= 3; i++) {
        const galleryFile = `${baseName}.${i}.png`;
        if (fs.existsSync(path.join(imagesDir, galleryFile))) {
          galleryImages.push(`/images/internal_components/images/${galleryFile}`);
        }
      }

      // Generate price based on category
      const basePrices = {
        'dj-speakers': 89.99,
        'drums-percussion': 45.99,
        'earbuds': 29.99,
        'earphones': 19.99,
        'guitars-basses': 35.99,
        'headphones': 24.99,
        'speakers': 39.99
      };

      const basePrice = basePrices[category] || 29.99;
      const price = basePrice + (Math.random() * 50); // Add some variation
      const originalPrice = price * 1.2; // 20% markup for original price
      const discount = Math.floor(Math.random() * 20) + 5; // 5-25% discount

      const product = {
        name,
        description,
        price: Math.round(price * 100) / 100,
        originalPrice: Math.round(originalPrice * 100) / 100,
        discount,
        category: 'internal-components', // All internal components go in this category
        subcategory: category, // Store original category as subcategory for filtering
        brand,
        image: `/images/internal_components/images/${imageFile}`,
        galleryImages,
        sku: generateSKU(category, name, skuCounter++),
        stock: Math.floor(Math.random() * 50) + 10, // 10-60 stock
        specifications: {
          type: "Internal Component",
          compatibility: `${category.replace('-', ' ')} systems`,
          warranty: "1 year",
          material: "Premium grade materials"
        },
        features: [
          "High Quality Component",
          "Professional Grade",
          "Easy Installation",
          "Durable Construction"
        ],
        tags: ["internal", "component", "parts", category.replace('-', '')],
        isActive: true,
        isFeatured: Math.random() > 0.8 // 20% chance of being featured
      };

      products.push(product);
    }

    console.log(`\nCreated ${products.length} internal component products`);

    // Insert products into database
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Successfully inserted ${insertedProducts.length} internal components`);

    // Show summary by category
    const categorySummary = {};
    products.forEach(product => {
      categorySummary[product.category] = (categorySummary[product.category] || 0) + 1;
    });

    console.log('\n📊 INTERNAL COMPONENTS BY CATEGORY:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} components`);
    });

    const finalCount = await Product.countDocuments();
    console.log(`\n📈 DATABASE UPDATED:`);
    console.log(`  Before: ${currentCount} products`);
    console.log(`  After: ${finalCount} products`);
    console.log(`  Added: ${finalCount - currentCount} products`);

  } catch (error) {
    console.error('Error seeding internal components:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeder
seedInternalComponents();