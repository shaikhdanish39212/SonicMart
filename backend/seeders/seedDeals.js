const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sounds-accessories');
    console.log('MongoDB connected for seeding deals');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const dealProducts = [
  {
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    description: "Industry-leading noise canceling technology with exceptional sound quality. 30-hour battery life and quick charge feature. Perfect for music lovers and frequent travelers.",
    price: 299,
    originalPrice: 399,
    discount: 25,
    category: "headphones",
    subcategory: "wireless",
    brand: "Sony",
    model: "WH-1000XM5",
    sku: "SONY-WH1000XM5-001",
    image: "/images/HeadPhones1.png",
    galleryImages: [
      "/images/HeadPhones1.1.png",
      "/images/HeadPhones1.2.png",
      "/images/HeadPhones1.3.png"
    ],
    stock: 45,
    averageRating: 4.8,
    totalReviews: 1250,
    features: [
      "Industry-leading noise canceling",
      "30-hour battery life",
      "Quick charge: 3 minutes for 3 hours",
      "Premium build quality",
      "Multipoint connection"
    ],
    specifications: {
      driverSize: "30mm",
      frequency: "4Hz-40kHz",
      batteryLife: "30 hours",
      weight: "250g",
      connectivity: ["Bluetooth 5.2"]
    },
    isActive: true,
    isFeatured: true
  },
  {
    name: "Apple AirPods Pro (2nd Generation)",
    description: "Revolutionary AirPods Pro with up to 2x more Active Noise Cancellation. Adaptive Transparency mode and Personalized Spatial Audio for immersive listening.",
    price: 199,
    originalPrice: 249,
    discount: 20,
    category: "earbuds",
    subcategory: "wireless",
    brand: "Apple",
    model: "AirPods Pro 2",
    sku: "APPLE-AIRPODS-PRO2-001",
    image: "/images/EarBuds1.png",
    galleryImages: [
      "/images/EarBuds1.1.png",
      "/images/EarBuds1.2.png",
      "/images/EarBuds1.3.png"
    ],
    stock: 65,
    averageRating: 4.7,
    totalReviews: 2100,
    features: [
      "Active Noise Cancellation",
      "Adaptive Transparency",
      "Personalized Spatial Audio",
      "Up to 6 hours listening time",
      "Lightning charging case"
    ],
    specifications: {
      driverSize: "Custom high-excursion Apple driver",
      batteryLife: "6 hours (earbuds), 30 hours (case)",
      weight: "5.3g per earbud",
      connectivity: ["Bluetooth 5.3"]
    },
    isActive: true,
    isFeatured: true
  },
  {
    name: "Bose SoundLink Revolve+ Bluetooth Speaker",
    description: "360-degree portable Bluetooth speaker with deep, immersive sound. Water-resistant design perfect for outdoor adventures. 16-hour battery life.",
    price: 229,
    originalPrice: 329,
    discount: 30,
    category: "speakers",
    subcategory: "portable",
    brand: "Bose",
    model: "SoundLink Revolve+",
    sku: "BOSE-SOUNDLINK-REV-001",
    image: "/images/DJSpeaker1.png",
    galleryImages: [
      "/images/DJSpeaker1.1.png",
      "/images/DJSpeaker1.2.png",
      "/images/DJSpeaker1.3.png"
    ],
    stock: 30,
    averageRating: 4.6,
    totalReviews: 850,
    features: [
      "360-degree sound",
      "Water-resistant (IPX4)",
      "16-hour battery life",
      "Built-in microphone",
      "Wireless range up to 30 feet"
    ],
    specifications: {
      dimensions: "7.25\" H x 4.1\" W x 4.1\" D",
      weight: "2 lbs",
      batteryLife: "16 hours",
      connectivity: ["Bluetooth 4.2"]
    },
    isActive: true,
    isFeatured: true
  },
  {
    name: "Audio-Technica AT2020USB+ Cardioid Condenser Microphone",
    description: "Professional studio-quality USB microphone perfect for podcasting, streaming, and music recording. Plug-and-play design with exceptional audio clarity.",
    price: 149,
    originalPrice: 199,
    discount: 25,
    category: "microphones",
    subcategory: "usb",
    brand: "Audio-Technica",
    model: "AT2020USB+",
    sku: "AT-AT2020USB-001",
    image: "/images/Microphone1.png",
    galleryImages: [
      "/images/Microphone1.1.png",
      "/images/Microphone1.2.png",
      "/images/Microphone1.3.png"
    ],
    stock: 25,
    averageRating: 4.9,
    totalReviews: 1800,
    features: [
      "Studio-quality recording",
      "Cardioid polar pattern",
      "USB plug-and-play",
      "Direct monitoring",
      "Compatible with all DAWs"
    ],
    specifications: {
      frequency: "20-20,000 Hz",
      sensitivity: "-37 dBV/Pa",
      connectivity: ["USB 2.0"]
    },
    isActive: true,
    isFeatured: true
  },
  {
    name: "Yamaha P-45 Digital Piano",
    description: "88-key weighted action digital piano with authentic piano sound. Perfect for beginners and intermediate players. Compact design with essential features.",
    price: 399,
    originalPrice: 549,
    discount: 27,
    category: "keyboards-pianos",
    subcategory: "digital-piano",
    brand: "Yamaha",
    model: "P-45",
    sku: "YAMAHA-P45-001",
    image: "/images/GuitarsBasses1.png",
    galleryImages: [
      "/images/GuitarsBasses1.1.png",
      "/images/GuitarsBasses1.2.png",
      "/images/GuitarsBasses1.3.png"
    ],
    stock: 15,
    averageRating: 4.5,
    totalReviews: 650,
    features: [
      "88 weighted keys",
      "10 different voices",
      "Graded Hammer Standard action",
      "Dual mode",
      "USB connectivity"
    ],
    specifications: {
      dimensions: "52.2\" x 11.6\" x 6.1\"",
      weight: "25.1 lbs",
      connectivity: ["USB"]
    },
    isActive: true,
    isFeatured: true
  },
  {
    name: "Shure SM58 Dynamic Vocal Microphone",
    description: "Industry-standard dynamic microphone for live vocals. Legendary reliability and exceptional performance. Built to withstand the rigors of touring.",
    price: 79,
    originalPrice: 109,
    discount: 28,
    category: "microphones",
    subcategory: "dynamic",
    brand: "Shure",
    model: "SM58",
    sku: "SHURE-SM58-001",
    image: "/images/Microphone1.png",
    galleryImages: [
      "/images/Microphone1.1.png",
      "/images/Microphone1.2.png",
      "/images/Microphone1.3.png"
    ],
    stock: 55,
    averageRating: 4.8,
    totalReviews: 3200,
    features: [
      "Industry standard for vocals",
      "Cardioid pickup pattern",
      "Built-in spherical filter",
      "Shock-mount system",
      "Legendary durability"
    ],
    specifications: {
      frequency: "50-15,000 Hz",
      sensitivity: "-54.5 dBV/Pa",
      connectivity: ["XLR"]
    },
    isActive: true,
    isFeatured: true
  }
];

const seedDeals = async () => {
  try {
    await connectDB();

    // Clear existing deal products (products with discount > 0)
    console.log('Clearing existing deal products...');
    await Product.deleteMany({ discount: { $gt: 0 } });

    // Insert new deal products
    console.log('Seeding deal products...');
    const createdProducts = await Product.insertMany(dealProducts);

    console.log(`✅ Successfully seeded ${createdProducts.length} deal products:`);
    createdProducts.forEach(product => {
      console.log(`   - ${product.name} (${product.discount}% off)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding deal products:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedDeals();
}

module.exports = { seedDeals, dealProducts };
