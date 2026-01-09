const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sounds-accessories');
    console.log('MongoDB connected for seeding all category deals');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const allCategoryDeals = [
  // Headphones Category
  {
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    description: "Industry-leading noise canceling technology with exceptional sound quality. 30-hour battery life and quick charge feature.",
    price: 299,
    originalPrice: 399,
    discount: 25,
    category: "headphones",
    subcategory: "wireless",
    brand: "Sony",
    model: "WH-1000XM5",
    sku: "SONY-WH1000XM5-DEAL",
    image: "/images/HeadPhones1.png",
    galleryImages: ["/images/HeadPhones1.1.png", "/images/HeadPhones1.2.png", "/images/HeadPhones1.3.png"],
    stock: 45,
    averageRating: 4.8,
    totalReviews: 1250,
    features: ["Industry-leading noise canceling", "30-hour battery life", "Quick charge: 3 minutes for 3 hours", "Premium build quality", "Multipoint connection"],
    specifications: {
      driverSize: "30mm",
      frequency: "4Hz-40kHz",
      batteryLife: "30 hours",
      weight: "250g",
      connectivity: ["Bluetooth 5.2"],
      color: ["Black", "Silver"]
    },
    isActive: true,
    isFeatured: true
  },

  // Earbuds Category
  {
    name: "Apple AirPods Pro (2nd Generation)",
    description: "Revolutionary AirPods Pro with up to 2x more Active Noise Cancellation. Adaptive Transparency mode and Personalized Spatial Audio.",
    price: 199,
    originalPrice: 249,
    discount: 20,
    category: "earbuds",
    subcategory: "wireless",
    brand: "Apple",
    model: "AirPods Pro 2",
    sku: "APPLE-AIRPODS-PRO2-DEAL",
    image: "/images/EarBuds1.png",
    galleryImages: ["/images/EarBuds1.1.png", "/images/EarBuds1.2.png", "/images/EarBuds1.3.png"],
    stock: 65,
    averageRating: 4.7,
    totalReviews: 2100,
    features: ["Active Noise Cancellation", "Adaptive Transparency", "Personalized Spatial Audio", "Up to 6 hours listening time", "Lightning charging case"],
    specifications: {
      driverSize: "Custom high-excursion Apple driver",
      batteryLife: "6 hours (earbuds), 30 hours (case)",
      weight: "5.3g per earbud",
      connectivity: ["Bluetooth 5.3"],
      color: ["White"]
    },
    isActive: true,
    isFeatured: true
  },

  // Speakers Category
  {
    name: "Bose SoundLink Revolve+ Bluetooth Speaker",
    description: "360-degree portable Bluetooth speaker with deep, immersive sound. Water-resistant design perfect for outdoor adventures.",
    price: 229,
    originalPrice: 329,
    discount: 30,
    category: "speakers",
    subcategory: "portable",
    brand: "Bose",
    model: "SoundLink Revolve+",
    sku: "BOSE-SOUNDLINK-REV-DEAL",
    image: "/images/DJSpeaker1.png",
    galleryImages: ["/images/DJSpeaker1.1.png", "/images/DJSpeaker1.2.png", "/images/DJSpeaker1.3.png"],
    stock: 30,
    averageRating: 4.6,
    totalReviews: 850,
    features: ["360-degree sound", "Water-resistant (IPX4)", "16-hour battery life", "Built-in microphone", "Wireless range up to 30 feet"],
    specifications: {
      batteryLife: "16 hours",
      weight: "2 lbs",
      dimensions: "7.25\" H x 4.1\" W x 4.1\" D",
      connectivity: ["Bluetooth 4.2"],
      color: ["Black", "Silver"]
    },
    isActive: true,
    isFeatured: true
  },

  // Microphones Category
  {
    name: "Audio-Technica AT2020USB+ Cardioid Condenser Microphone",
    description: "Professional studio-quality USB microphone perfect for podcasting, streaming, and music recording. Plug-and-play design.",
    price: 149,
    originalPrice: 199,
    discount: 25,
    category: "microphones",
    subcategory: "usb",
    brand: "Audio-Technica",
    model: "AT2020USB+",
    sku: "AT-AT2020USB-DEAL",
    image: "/images/Microphone1.png",
    galleryImages: ["/images/Microphone1.1.png", "/images/Microphone1.2.png", "/images/Microphone1.3.png"],
    stock: 25,
    averageRating: 4.9,
    totalReviews: 1800,
    features: ["Studio-quality recording", "Cardioid polar pattern", "USB plug-and-play", "Direct monitoring", "Compatible with all DAWs"],
    specifications: {
      frequency: "20-20,000 Hz",
      sensitivity: "-37 dBV/Pa",
      connectivity: ["USB"],
      color: ["Black"]
    },
    isActive: true,
    isFeatured: true
  },

  // Guitars & Basses Category
  {
    name: "Fender Player Stratocaster Electric Guitar",
    description: "Classic Fender Stratocaster with modern player-friendly features. Alnico 5 pickups deliver crystal-clear bell-like high end, punchy mids and robust low end.",
    price: 649,
    originalPrice: 799,
    discount: 19,
    category: "guitars-basses",
    subcategory: "electric-guitar",
    brand: "Fender",
    model: "Player Stratocaster",
    sku: "FENDER-PLAYER-STRAT-DEAL",
    image: "/images/GuitarsBasses1.png",
    galleryImages: ["/images/GuitarsBasses1.1.png", "/images/GuitarsBasses1.2.png", "/images/GuitarsBasses1.3.png"],
    stock: 15,
    averageRating: 4.7,
    totalReviews: 950,
    features: ["Alnico 5 pickups", "Modern C-shaped neck", "22 medium-jumbo frets", "2-point tremolo bridge", "Master volume and tone controls"],
    specifications: {
      body: "Alder",
      neck: "Maple",
      fretboard: "Maple",
      pickups: "3 Player Series Alnico 5 Strat Single-Coil",
      connectivity: ["1/4 inch jack"],
      color: ["3-Color Sunburst", "Black", "White"]
    },
    isActive: true,
    isFeatured: true
  },

  // Keyboards & Pianos Category
  {
    name: "Yamaha P-45 Digital Piano",
    description: "88-key weighted action digital piano with authentic piano sound. Perfect for beginners and intermediate players with compact design.",
    price: 399,
    originalPrice: 549,
    discount: 27,
    category: "keyboards-pianos",
    subcategory: "digital-piano",
    brand: "Yamaha",
    model: "P-45",
    sku: "YAMAHA-P45-DEAL",
    image: "/images/GuitarsBasses1.png",
    galleryImages: ["/images/GuitarsBasses1.1.png", "/images/GuitarsBasses1.2.png", "/images/GuitarsBasses1.3.png"],
    stock: 15,
    averageRating: 4.5,
    totalReviews: 650,
    features: ["88 weighted keys", "10 different voices", "Graded Hammer Standard action", "Dual mode", "USB connectivity"],
    specifications: {
      keys: "88",
      weight: "25.1 lbs",
      dimensions: "52.2\" x 11.6\" x 6.1\"",
      connectivity: ["USB", "Sustain pedal jack"],
      color: ["Black"]
    },
    isActive: true,
    isFeatured: true
  },

  // Drums & Percussion Category
  {
    name: "Roland TD-1DMK V-Drums Electronic Drum Kit",
    description: "Complete electronic drum kit with mesh heads for realistic feel. Perfect for home practice with headphones or amplified performance.",
    price: 449,
    originalPrice: 599,
    discount: 25,
    category: "drums-percussion",
    subcategory: "electronic-drums",
    brand: "Roland",
    model: "TD-1DMK",
    sku: "ROLAND-TD1DMK-DEAL",
    image: "/images/DJSpeaker1.png",
    galleryImages: ["/images/DJSpeaker1.1.png", "/images/DJSpeaker1.2.png", "/images/DJSpeaker1.3.png"],
    stock: 20,
    averageRating: 4.6,
    totalReviews: 425,
    features: ["Mesh head snare drum", "15 preset drum kits", "Dual-trigger cymbal pads", "Built-in metronome", "Headphone output"],
    specifications: {
      pads: "4 drum pads, 3 cymbal pads",
      sounds: "15 drum kits",
      connectivity: ["Headphone jack", "Audio input", "USB"],
      power: "AC adapter",
      color: ["Black"]
    },
    isActive: true,
    isFeatured: true
  },

  // Studio Equipment Category
  {
    name: "Focusrite Scarlett 2i2 Audio Interface",
    description: "Professional 2-in, 2-out USB audio interface for recording. Industry-leading sound quality with zero-latency monitoring.",
    price: 139,
    originalPrice: 179,
    discount: 22,
    category: "studio-equipment",
    subcategory: "audio-interface",
    brand: "Focusrite",
    model: "Scarlett 2i2",
    sku: "FOCUSRITE-2I2-DEAL",
    image: "/images/DJSpeaker1.png",
    galleryImages: ["/images/DJSpeaker1.1.png", "/images/DJSpeaker1.2.png", "/images/DJSpeaker1.3.png"],
    stock: 35,
    averageRating: 4.7,
    totalReviews: 1560,
    features: ["2 Scarlett mic preamps", "Air mode for enhanced highs", "Zero-latency monitoring", "USB bus powered", "Includes Pro Tools First"],
    specifications: {
      inputs: "2 x XLR-1/4\" combo",
      outputs: "2 x 1/4\" balanced",
      sampleRate: "Up to 192kHz/24-bit",
      connectivity: ["USB-C"],
      color: ["Red"]
    },
    isActive: true,
    isFeatured: true
  }
];

const seedAllCategoryDeals = async () => {
  try {
    await connectDB();
    
    // Clear existing deal products (products with discount > 0)
    await Product.deleteMany({ discount: { $gt: 0 } });
    console.log('Cleared existing deal products');
    
    // Insert new deal products
    const insertedProducts = await Product.insertMany(allCategoryDeals);
    console.log(`Successfully seeded ${insertedProducts.length} deal products from all categories`);
    
    // Display summary
    const categorySummary = {};
    insertedProducts.forEach(product => {
      categorySummary[product.category] = (categorySummary[product.category] || 0) + 1;
    });
    
    console.log('\nDeal Products by Category:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} product(s)`);
    });
    
    console.log('\nAll category deals seeded successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding all category deals:', error);
    process.exit(1);
  }
};

seedAllCategoryDeals();
