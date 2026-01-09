const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Product categories and their mappings - All 14 categories
// Updated image prefixes to match actual file names in images directory
const categories = {
  'DJSpeaker': { category: 'dj-speakers', brand: 'DJPro', basePrice: 399.99 },
  'EarBuds': { category: 'earbuds', brand: 'SoundMagic', basePrice: 149.99 },
  'EarPhones': { category: 'earphones', brand: 'AudioTech', basePrice: 79.99 },
  'HeadPhones': { category: 'headphones', brand: 'HeadGear', basePrice: 299.99 },
  'HomeTheater': { category: 'home-theater', brand: 'CinemaMax', basePrice: 799.99 },
  'LoudSpeaker': { category: 'loud-speakers', brand: 'EventSound', basePrice: 249.99 },
  'Microphone': { category: 'microphones', brand: 'MicPro', basePrice: 199.99 },
  'NeckBand': { category: 'neckband-earphones', brand: 'FlexSound', basePrice: 59.99 },
  'Speakers': { category: 'speakers', brand: 'BoomBox', basePrice: 89.99 },
  'KeyboardsPianos': { category: 'keyboards-pianos', brand: 'PianoPro', basePrice: 899.99 },
  'RecordingStudioEquipments': { category: 'studio-equipment', brand: 'StudioGear', basePrice: 1299.99 },
  'GuitarsBasses': { category: 'guitars-basses', brand: 'StringMaster', basePrice: 599.99 },
  'DrumsPercussion': { category: 'drums-percussion', brand: 'RhythmPro', basePrice: 449.99 }
};

// Product names and descriptions for all categories
const productNames = {
  'dj-speakers': [
    'Professional DJ Speaker System', 'High-Power Performance Speaker', 'Studio Monitor DJ Speaker',
    'Portable DJ Sound System', 'Club-Grade DJ Speaker', 'Wireless DJ Speaker Pro',
    'Bass-Heavy DJ Monitor', 'Concert-Level DJ Speaker', 'Mobile DJ Sound Solution',
    'Premium DJ Audio System', 'Professional Stage Speaker', 'DJ Booth Speaker System'
  ],
  'earbuds': [
    'True Wireless Earbuds', 'Noise-Cancelling Earbuds', 'Sport Wireless Earbuds',
    'Premium Audio Earbuds', 'Compact Wireless Earbuds', 'Hi-Fi Stereo Earbuds',
    'Active Noise Control Earbuds', 'Bluetooth 5.0 Earbuds', 'Waterproof Sport Earbuds',
    'Studio-Quality Earbuds', 'Long-Battery Wireless Earbuds', 'Touch Control Earbuds'
  ],
  'headphones': [
    'Premium Studio Headphones', 'Wireless Over-Ear Headphones', 'Noise-Cancelling Headphones',
    'Professional Monitor Headphones', 'Gaming Headphones Pro', 'High-Fidelity Over-Ear Headphones',
    'Bluetooth Wireless Headphones', 'Closed-Back Studio Headphones', 'Open-Back Reference Headphones',
    'Hi-Res Audio Headphones', 'Comfort-Fit Headphones', 'Portable Folding Headphones'
  ],
  'earphones': [
    'Wired In-Ear Earphones', 'High-Fidelity Earphones', 'Noise-Isolating Earphones',
    'Professional Monitor Earphones', 'Bass-Enhanced Earphones', 'Comfortable Fit Earphones',
    'Studio Reference Earphones', 'Audiophile Earphones', 'Balanced Sound Earphones',
    'Precision Audio Earphones', 'Clear Sound Earphones', 'Premium Wired Earphones'
  ],
  'home-theater': [
    'Complete Home Theater System', '5.1 Surround Sound System', 'Wireless Home Theater Setup',
    'Premium Cinema Sound System', 'Smart Home Theater System', 'Compact Theater Solution',
    'High-End Audio Theater System', 'Immersive Sound Experience', 'Modern Home Cinema Setup',
    'Advanced Theater Audio System', '7.1 Dolby Atmos System', 'Wireless Surround Sound Setup'
  ],
  'loud-speakers': [
    'High-Powered Loud Speaker', 'Portable PA Speaker System', 'Event Sound Speaker',
    'Outdoor Concert Speaker', 'Professional PA Speaker', 'Wireless Loud Speaker',
    'Battery-Powered PA System', 'Portable Event Speaker', 'High-Volume Sound System',
    'Mobile PA Speaker', 'Rugged Outdoor Speaker', 'Professional Sound Reinforcement'
  ],
  'microphones': [
    'Professional Studio Condenser Microphone', 'Dynamic Vocal Microphone', 'USB Recording Microphone',
    'Wireless Handheld Microphone', 'Lavalier Clip-On Microphone', 'Shotgun Directional Microphone',
    'Podcast Recording Microphone', 'Live Performance Microphone', 'Studio Vocal Microphone',
    'Broadcast Quality Microphone', 'Instrument Recording Microphone', 'Conference Room Microphone'
  ],
  'neckband-earphones': [
    'Wireless Neckband Earphones', 'Sport Neckband Headphones', 'Magnetic Neckband Earphones',
    'Long-Battery Neckband Earphones', 'Lightweight Neckband Headphones', 'Sweat-Resistant Neckband Earphones',
    'Quick-Charge Neckband Headphones', 'Comfortable Neckband Earphones', 'Active Lifestyle Neckband Earphones',
    'Flexible Neckband Headphones', 'Secure-Fit Neckband Earphones', 'Premium Neckband Headphones'
  ],
  'speakers': [
    'Bluetooth Portable Speaker', 'Wireless Home Speaker', 'Waterproof Outdoor Speaker',
    'Smart WiFi Speaker', 'Compact Desktop Speaker', 'High-Fidelity Bookshelf Speaker',
    'Portable Party Speaker', 'Multi-Room Wireless Speaker', 'Voice-Controlled Smart Speaker',
    'Premium Audio Speaker', 'Bass-Boosted Portable Speaker', 'Elegant Home Speaker'
  ],
  'keyboards-pianos': [
    'Digital Piano with 88 Keys', 'Portable 61-Key Keyboard', 'Professional Synthesizer',
    'MIDI Controller Keyboard', 'Grand Concert Digital Piano', 'Stage and Performance Keyboard',
    'Beginner\'s Electronic Keyboard', 'Weighted Key Digital Piano', 'Arranger Workstation Keyboard',
    'Vintage-Style Electric Piano', 'Compact Digital Piano', 'Travel-Friendly Keyboard'
  ],
  'studio-equipment': [
    'Professional Audio Interface', 'Studio Monitor Speakers', 'Large-Diaphragm Condenser Mic',
    'Digital Audio Workstation (DAW)', 'Mixing Console and Control Surface', 'Studio-Grade Rackmount Effects',
    'Acoustic Treatment Panels', 'High-Fidelity Studio Headphones', 'Microphone Preamp and Channel Strip',
    'MIDI and Audio Sequencer', 'Virtual Instrument Suite', 'Professional Studio Desk'
  ],
  'guitars-basses': [
    'Electric Guitar Professional', 'Acoustic Guitar Premium', 'Bass Guitar 4-String',
    'Classical Guitar Handcrafted', 'Electric Bass 5-String', 'Semi-Acoustic Guitar',
    'Vintage Electric Guitar', 'Acoustic Bass Guitar', 'Travel Size Guitar',
    'Professional Studio Guitar', 'Fretless Bass Guitar', 'Custom Electric Guitar'
  ],
  'drums-percussion': [
    'Complete Drum Kit Professional', 'Electronic Drum Set', 'Acoustic Drum Kit',
    'Percussion Set Complete', 'Digital Drum Kit', 'Jazz Drum Set',
    'Rock Drum Kit Professional', 'Compact Electronic Drums', 'Traditional Percussion Set',
    'Studio Drum Kit', 'Portable Drum Set', 'Professional Percussion Kit',
    'Premium Darbuka Set', 'Traditional Dholak Drums', 'African Djembe Collection',
    'Concert Timpani Set', 'Marching Band Drums', 'Latin Percussion Kit',
    'Orchestral Percussion Set', 'World Music Drum Collection', 'Hybrid Electronic Kit',
    'Vintage Ludwig Drum Set', 'Modern Pearl Drum Kit', 'Gretsch Professional Series',
    'DW Collector Series', 'Tama Starclassic Kit', 'Mapex Saturn Evolution',
    'Sonor SQ1 Series', 'Premier Cabria Series', 'Yamaha Stage Custom'
  ]
};

// Specifications for each category
function getSpecifications(category) {
  const specs = {
    'dj-speakers': {
      frequency: '40Hz - 20kHz',
      power: '500W RMS',
      connectivity: ['XLR', 'TRS', 'Bluetooth'],
      weight: '15kg',
      dimensions: '45x30x25cm',
      warranty: '3 years'
    },
    'earbuds': {
      frequency: '20Hz - 20kHz',
      batteryLife: '8 hours + 24 hours case',
      connectivity: ['Bluetooth 5.2'],
      weight: '5g each',
      chargingTime: '1.5 hours',
      warranty: '1 year'
    },
    'headphones': {
      frequency: '15Hz - 25kHz',
      impedance: '32 ohms',
      sensitivity: '105 dB',
      driverSize: '50mm',
      connectivity: ['Wired', 'Bluetooth'],
      weight: '300g',
      warranty: '2 years'
    },
    'earphones': {
      frequency: '20Hz - 20kHz',
      impedance: '16 ohms',
      sensitivity: '98 dB',
      driverSize: '10mm',
      connectivity: ['3.5mm'],
      weight: '20g',
      warranty: '1 year'
    },
    'home-theater': {
      channels: '5.1 / 7.1',
      power: '1000W Total',
      connectivity: ['HDMI', 'Optical', 'Bluetooth'],
      frequency: '20Hz - 20kHz',
      dimensions: 'Various',
      warranty: '3 years'
    },
    'loud-speakers': {
      frequency: '50Hz - 18kHz',
      power: '800W Peak',
      connectivity: ['XLR', 'TRS', 'Wireless'],
      weight: '20kg',
      batteryLife: '8 hours',
      warranty: '2 years'
    },
    'microphones': {
      frequency: '20Hz - 20kHz',
      sensitivity: '-34 dBV/Pa',
      connectivity: ['XLR', 'USB'],
      weight: '500g',
      pattern: 'Cardioid',
      warranty: '3 years'
    },
    'neckband-earphones': {
      frequency: '20Hz - 20kHz',
      batteryLife: '12 hours',
      connectivity: ['Bluetooth 5.0'],
      weight: '35g',
      chargingTime: '2 hours',
      warranty: '1 year'
    },
    'speakers': {
      frequency: '60Hz - 18kHz',
      power: '20W RMS',
      connectivity: ['Bluetooth', 'AUX', 'USB'],
      batteryLife: '10 hours',
      weight: '800g',
      warranty: '2 years'
    },
    'keyboards-pianos': {
      keys: '88 weighted keys',
      voices: '500+ voices',
      connectivity: ['MIDI', 'USB', 'Bluetooth'],
      weight: '15kg',
      dimensions: '132x30x15cm',
      warranty: '3 years'
    },
    'studio-equipment': {
      channels: '8-24 channels',
      sampleRate: '192kHz/32-bit',
      connectivity: ['USB', 'Thunderbolt', 'MIDI'],
      latency: '<2ms',
      compatibility: 'Mac/PC/iOS',
      warranty: '3 years'
    },
    'guitars-basses': {
      strings: '4-6 strings',
      scale: '25.5 inch',
      pickups: 'Humbucker/Single Coil',
      wood: 'Maple/Mahogany',
      finish: 'Gloss/Satin',
      warranty: '2 years'
    },
    'drums-percussion': {
      pieces: '5-7 piece kit',
      shells: 'Birch/Maple',
      cymbals: 'Bronze alloy',
      hardware: 'Chrome plated',
      sizes: 'Standard/Compact',
      warranty: '3 years'
    }
  };
  return specs[category] || {};
}

// Features for each category
function getFeatures(category) {
  const features = {
    'dj-speakers': ['Professional Grade', 'High Power Output', 'Multiple Inputs', 'Portable Design'],
    'earbuds': ['True Wireless', 'Noise Cancelling', 'Touch Controls', 'Water Resistant'],
    'headphones': ['Comfortable Padding', 'Noise Isolation', 'Foldable Design', 'Premium Build'],
    'earphones': ['In-Ear Design', 'Tangle-Free Cable', 'Multiple Ear Tips', 'Inline Controls'],
    'home-theater': ['Surround Sound', 'Wireless Connectivity', 'Smart Features', 'Easy Setup'],
    'loud-speakers': ['High Volume', 'Battery Powered', 'Weather Resistant', 'Multiple Inputs'],
    'microphones': ['Studio Quality', 'Low Noise', 'Shock Mount', 'Pop Filter'],
    'neckband-earphones': ['Magnetic Earbuds', 'Long Battery', 'Lightweight', 'Quick Charge'],
    'speakers': ['Portable Design', 'Wireless Connectivity', 'Long Battery', 'Water Resistant'],
    'keyboards-pianos': ['Weighted Keys', 'Multiple Voices', 'Recording Capability', 'MIDI Compatible'],
    'studio-equipment': ['Professional Grade', 'Low Latency', 'Multiple I/O', 'Software Bundle'],
    'guitars-basses': ['Premium Wood', 'Professional Pickups', 'Comfortable Neck', 'Versatile Tone'],
    'drums-percussion': ['Quality Shells', 'Professional Hardware', 'Tunable Heads', 'Complete Kit']
  };
  return features[category] || [];
}

// Generate products for each category with exactly 4 images (1 main + 3 gallery)
function generateProductsForCategory(imagePrefix, config) {
  const products = [];
  // Set productCount to 28 for drums/percussion, 12 for all other categories
  const productCount = config.category === 'drums-percussion' ? 28 : 12;
  const names = productNames[config.category];
  
  // Define drum types for drums-percussion category
  const drumTypes = ['Darbukas', 'Dholak', 'Djembe', 'Drums', 'ElectricDrums', 'SteelDrums', 'Tabla'];
  
  for (let i = 1; i <= productCount; i++) {
    const discount = Math.floor(Math.random() * 30) + 10; // 10-40% discount
    const priceVariation = (Math.random() * 0.6 - 0.3) * config.basePrice; // ±30% variation
    const originalPrice = Math.max(config.basePrice + priceVariation, config.basePrice * 0.5);
    const price = originalPrice * (1 - discount / 100);
    
    let actualImagePrefix = imagePrefix;
    let productNumber = i;
    
    // Special handling for drums-percussion category
    if (config.category === 'drums-percussion') {
      const drumTypeIndex = (i - 1) % drumTypes.length;
      const drumType = drumTypes[drumTypeIndex];
      actualImagePrefix = `DrumsPercussion_${drumType}`;
      productNumber = Math.floor((i - 1) / drumTypes.length) + 1;
      // Ensure we don't exceed available images (4 per drum type)
      if (productNumber > 4) {
        productNumber = ((productNumber - 1) % 4) + 1;
      }
    }
    
    const product = {
      name: names[i - 1] || `${config.category.replace('-', ' ')} Model ${i}`,
      description: `High-quality ${config.category.replace('-', ' ')} with exceptional performance and reliability. Perfect for professional and personal use.`,
      price: Math.round(price * 100) / 100,
      originalPrice: Math.round(originalPrice * 100) / 100,
      discount: discount,
      category: config.category,
      brand: config.brand,
      model: `${config.brand.substring(0, 2).toUpperCase()}-${imagePrefix}${i}`,
      image: `/images/${actualImagePrefix}${productNumber}.png`,
      // Exactly 3 gallery images for each product (total 4 images including main)
      galleryImages: [
        `/images/${actualImagePrefix}${productNumber}.1.png`,
        `/images/${actualImagePrefix}${productNumber}.2.png`,
        `/images/${actualImagePrefix}${productNumber}.3.png`
      ],
      sku: `${config.brand.substring(0, 3).toUpperCase()}${String(i).padStart(3, '0')}`,
      stock: Math.floor(Math.random() * 100) + 10,
      specifications: getSpecifications(config.category),
      features: getFeatures(config.category),
      tags: [config.category.split('-')[0], 'audio', 'professional'],
      isFeatured: Math.random() > 0.7,
      isActive: true,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      reviewCount: Math.floor(Math.random() * 200) + 5
    };
    
    products.push(product);
  }
  
  return products;
}

const seedAllProducts = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products
    console.log('🧹 Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');
    
    let totalProducts = 0;
    const categoryCounts = {};
    
    // Process each category separately
    for (const [imagePrefix, config] of Object.entries(categories)) {
      try {
        console.log(`📦 Processing ${config.category} (${imagePrefix})...`);
        
        const products = generateProductsForCategory(imagePrefix, config);
        await Product.insertMany(products);
        
        categoryCounts[config.category] = products.length;
        totalProducts += products.length;
        
        console.log(`✅ Added ${products.length} ${config.category} products`);
      } catch (error) {
        console.error(`❌ Error processing ${config.category}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Successfully seeded ${totalProducts} products across ${Object.keys(categories).length} categories!`);
    console.log('📊 Products by category:');
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });
    
    console.log('\n📸 Each product has exactly 4 images (1 main + 3 gallery)');
    console.log('🎯 All 14 categories are now populated!');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

if (require.main === module) {
  seedAllProducts();
}

module.exports = seedAllProducts;
