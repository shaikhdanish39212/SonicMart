const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

const microphoneProducts = [
  {
    name: "Professional Studio Condenser Microphone",
    description: "Capture studio-quality vocals and instruments with this professional large-diaphragm condenser microphone. Perfect for home studios, podcasting, and professional recording.",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: "microphones",
    brand: "AudioPro",
    model: "AP-CM1000",
    image: "/images/Microphone1.png",
    galleryImages: [
      "/images/Microphone1.1.png",
      "/images/Microphone1.2.png",
      "/images/Microphone1.3.png"
    ],
    sku: "MIC001",
    stock: 35,
    specifications: {
      type: "Condenser",
      pattern: "Cardioid",
      frequency: "20Hz - 20kHz",
      sensitivity: "-34dB",
      impedance: "150 ohms",
      connectivity: ["XLR"],
      weight: "380g",
      warranty: "2 years",
      color: ["Black", "Gold"]
    },
    features: [
      "Large Diaphragm",
      "Shock Mount Included",
      "Pop Filter",
      "Professional Audio Quality"
    ],
    tags: ["studio", "recording", "condenser", "professional"],
    isFeatured: true
  },
  {
    name: "USB Podcast Microphone",
    description: "Plug-and-play USB microphone perfect for podcasters, streamers, and content creators. Simple setup with excellent audio quality.",
    price: 129.99,
    originalPrice: 149.99,
    discount: 13,
    category: "microphones",
    brand: "StreamTech",
    model: "ST-USB100",
    image: "/images/Microphone2.png",
    galleryImages: [
      "/images/Microphone2.1.png",
      "/images/Microphone2.2.png"
    ],
    sku: "MIC002",
    stock: 50,
    specifications: {
      type: "Condenser",
      pattern: "Multiple (Cardioid, Omnidirectional, Bidirectional, Stereo)",
      frequency: "20Hz - 20kHz",
      bitDepth: "24-bit",
      sampleRate: "96kHz",
      connectivity: ["USB-C", "3.5mm"],
      weight: "450g",
      warranty: "1 year",
      color: ["Black", "Blue"]
    },
    features: [
      "Plug-and-Play USB",
      "Zero-Latency Monitoring",
      "Multiple Polar Patterns",
      "Headphone Output"
    ],
    tags: ["podcast", "streaming", "usb", "content creator"],
    isFeatured: true
  },
  {
    name: "Wireless Lavalier Microphone",
    description: "Professional wireless lavalier microphone system for interviews, video productions, and presentations. Clear audio with reliable wireless transmission.",
    price: 249.99,
    originalPrice: 299.99,
    discount: 17,
    category: "microphones",
    brand: "MobileAudio",
    model: "MA-WL200",
    image: "/images/Microphone3.png",
    galleryImages: [
      "/images/Microphone3.1.png",
      "/images/Microphone3.2.png"
    ],
    sku: "MIC003",
    stock: 25,
    specifications: {
      type: "Condenser",
      pattern: "Omnidirectional",
      frequency: "50Hz - 18kHz",
      range: "100m",
      batteryLife: "8 hours",
      connectivity: ["3.5mm", "XLR", "USB"],
      weight: "120g",
      warranty: "2 years",
      color: ["Black"]
    },
    features: [
      "Wireless Operation",
      "Dual Receiver",
      "Low-Profile Design",
      "Noise Reduction"
    ],
    tags: ["wireless", "lavalier", "video", "mobile"],
    isFeatured: false
  },
  {
    name: "Dynamic Performance Microphone",
    description: "Rugged dynamic microphone designed for live vocal performances. Exceptional feedback rejection and durability for stage use.",
    price: 149.99,
    originalPrice: 169.99,
    discount: 12,
    category: "microphones",
    brand: "StagePro",
    model: "SP-DM300",
    image: "/images/Microphone4.png",
    galleryImages: [
      "/images/Microphone4.1.png",
      "/images/Microphone4.2.png"
    ],
    sku: "MIC004",
    stock: 40,
    specifications: {
      type: "Dynamic",
      pattern: "Cardioid",
      frequency: "50Hz - 15kHz",
      impedance: "300 ohms",
      connectivity: ["XLR"],
      weight: "320g",
      warranty: "3 years",
      color: ["Black", "Silver"]
    },
    features: [
      "Shock Mounted Capsule",
      "On/Off Switch",
      "Stage-Ready Durability",
      "Handling Noise Reduction"
    ],
    tags: ["dynamic", "live", "performance", "stage"],
    isFeatured: false
  }
];

const seedMicrophones = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sounds-accessories');
    console.log('✅ Connected to MongoDB');

    // Add microphone products
    await Product.insertMany(microphoneProducts);
    console.log('✅ Microphone products added successfully');

    console.log('\n🎉 Microphone products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding microphone products:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedMicrophones();
}

module.exports = seedMicrophones;
