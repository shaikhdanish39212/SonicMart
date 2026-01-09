const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

// Function to generate SKU from product name
const generateSKU = (name, index) => {
  const prefix = name.substring(0, 3).toUpperCase();
  const suffix = String(index + 1).padStart(3, '0');
  return `${prefix}${suffix}`;
};

// Function to determine brand from product name
const extractBrand = (name) => {
  const brands = {
    'Studio': 'AudioTech',
    'Gaming': 'GameSound', 
    'DJ': 'DJPro',
    'Noise Cancelling': 'SilenceMax',
    'Wireless': 'SoundPro',
    'Bluetooth': 'SoundPro',
    'Professional': 'ProAudio',
    'Bass': 'BassMax',
    'Sport': 'SportSound',
    'Premium': 'AudioTech'
  };

  for (const [keyword, brand] of Object.entries(brands)) {
    if (name.includes(keyword)) {
      return brand;
    }
  }
  
  return 'SoundsAccessories'; // Default brand
};

// Function to generate specifications based on category
const generateSpecifications = (category, name) => {
  const specs = {
    headphones: {
      frequency: "20Hz - 20kHz",
      impedance: "32 ohms",
      sensitivity: "98 dB",
      driverSize: "40mm",
      connectivity: ["Wired", "3.5mm"],
      weight: "280g",
      warranty: "2 years"
    },
    earbuds: {
      frequency: "20Hz - 20kHz",
      impedance: "16 ohms",
      sensitivity: "95 dB",
      driverSize: "12mm",
      connectivity: ["Bluetooth 5.0"],
      batteryLife: "6 hours + 18 hours case",
      weight: "5g per bud",
      warranty: "1 year"
    },
    speakers: {
      frequency: "50Hz - 20kHz",
      power: "100W",
      connectivity: ["Bluetooth", "AUX", "USB"],
      dimensions: "8\" x 6\" x 10\"",
      weight: "2.5kg",
      warranty: "2 years"
    }
  };

  let baseSpec = specs[category] || specs.headphones;
  
  // Modify specs based on product name
  if (name.includes('Wireless') || name.includes('Bluetooth')) {
    baseSpec.connectivity = ["Bluetooth 5.0", "Wireless"];
    if (category === 'headphones') {
      baseSpec.batteryLife = "25 hours";
      baseSpec.chargingTime = "2 hours";
    }
  }
  
  if (name.includes('Gaming')) {
    baseSpec.connectivity = ["USB", "3.5mm", "Wireless"];
    baseSpec.features = ["7.1 Surround Sound", "Gaming Microphone"];
  }
  
  if (name.includes('DJ') || name.includes('Professional')) {
    baseSpec.frequency = "5Hz - 30kHz";
    baseSpec.impedance = "35 ohms";
    baseSpec.sensitivity = "102 dB";
    baseSpec.warranty = "3 years";
  }

  return baseSpec;
};

// Function to generate features based on product name and category
const generateFeatures = (name, category) => {
  const features = [];
  
  if (name.includes('Noise Cancelling') || name.includes('ANC')) {
    features.push('Active Noise Cancelling');
  }
  
  if (name.includes('Wireless') || name.includes('Bluetooth')) {
    features.push('Wireless Connectivity');
  }
  
  if (name.includes('Gaming')) {
    features.push('Gaming Optimized', 'Clear Microphone', 'Comfortable for Long Sessions');
  }
  
  if (name.includes('DJ')) {
    features.push('Professional DJ Design', 'Superior Sound Isolation', 'Swivel Ear Cups');
  }
  
  if (name.includes('Premium') || name.includes('Pro')) {
    features.push('Premium Build Quality', 'High-End Audio Drivers');
  }
  
  if (name.includes('Bass')) {
    features.push('Enhanced Bass Response', 'Deep Low-End');
  }
  
  if (name.includes('Sport')) {
    features.push('Sweat Resistant', 'Secure Fit', 'IPX4 Water Resistance');
  }
  
  if (category === 'earbuds') {
    features.push('Compact Design', 'Portable Charging Case');
  }
  
  if (category === 'speakers') {
    features.push('High Power Output', 'Rich Sound Quality');
  }
  
  // Add default features if none were added
  if (features.length === 0) {
    features.push('High Quality Audio', 'Comfortable Design', 'Durable Construction');
  }
  
  return features;
};

const importProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Read the products JSON file from frontend
    const productsPath = path.join(__dirname, '../../myproject/products.json');
    
    if (!fs.existsSync(productsPath)) {
      console.error('❌ Products JSON file not found at:', productsPath);
      process.exit(1);
    }

    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(`📦 Found ${productsData.length} products to import`);

    // Clear existing products
    console.log('🧹 Clearing existing products...');
    await Product.deleteMany({});

    // Transform and import products
    console.log('🔄 Transforming and importing products...');
    
    const transformedProducts = productsData.map((product, index) => {
      const category = product.category || 'headphones';
      const brand = extractBrand(product.name);
      const specifications = generateSpecifications(category, product.name);
      const features = generateFeatures(product.name, category);
      
      return {
        name: product.name,
        description: product.description || `High-quality ${category} with excellent sound performance and comfortable design.`,
        price: product.price,
        originalPrice: product.discount ? product.price / (1 - product.discount / 100) : product.price,
        discount: product.discount || 0,
        category: category,
        brand: brand,
        model: `${brand.substring(0, 2).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
        image: product.image,
        galleryImages: product.galleryImages || [],
        sku: generateSKU(product.name, index),
        stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
        lowStockThreshold: 10,
        specifications: specifications,
        features: features,
        tags: [
          category,
          brand.toLowerCase(),
          ...product.name.toLowerCase().split(' ').filter(word => word.length > 3)
        ].slice(0, 5), // Limit to 5 tags
        isFeatured: index < 8, // Make first 8 products featured
        isActive: true,
        averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating between 3.0-5.0
        totalReviews: Math.floor(Math.random() * 50), // Random review count
        salesCount: Math.floor(Math.random() * 200), // Random sales count
        viewCount: Math.floor(Math.random() * 1000) // Random view count
      };
    });

    // Insert products in batches
    const batchSize = 10;
    let imported = 0;
    
    for (let i = 0; i < transformedProducts.length; i += batchSize) {
      const batch = transformedProducts.slice(i, i + batchSize);
      try {
        await Product.insertMany(batch);
        imported += batch.length;
        console.log(`✅ Imported batch ${Math.ceil((i + 1) / batchSize)} - Total: ${imported}/${transformedProducts.length}`);
      } catch (error) {
        console.error(`❌ Error importing batch ${Math.ceil((i + 1) / batchSize)}:`, error.message);
        // Continue with next batch
      }
    }

    console.log(`\n🎉 Successfully imported ${imported} products!`);
    
    // Display summary
    const categories = await Product.distinct('category');
    console.log('\n📊 Import Summary:');
    console.log(`Total Products: ${imported}`);
    console.log(`Categories: ${categories.join(', ')}`);
    console.log(`Featured Products: ${await Product.countDocuments({ isFeatured: true })}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing products:', error);
    process.exit(1);
  }
};

// Run the importer
if (require.main === module) {
  importProducts();
}

module.exports = importProducts;
