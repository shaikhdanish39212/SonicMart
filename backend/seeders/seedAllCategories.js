const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
  // Headphones
  {
    name: "Premium Studio Headphones",
    description: "Crystal clear sound for studio recording and mixing.",
    price: 299.99,
    originalPrice: 349.99,
    discount: 15,
    category: "headphones",
    brand: "AudioTech",
    model: "AT-SH1000",
    image: "/images/HeadPhones1.png",
    galleryImages: ["/images/HeadPhones1.1.png", "/images/HeadPhones1.2.png"],
    sku: "ATH001A",
    stock: 50,
    specifications: { frequency: "20Hz - 20kHz", impedance: "32 ohms", connectivity: ["Wired", "3.5mm"], weight: "250g", warranty: "2 years" },
    features: ["Noise Cancelling", "Professional Grade"],
    tags: ["studio", "headphones"],
    isFeatured: true
  },
  // Wireless Earbuds
  {
    name: "True Wireless Earbuds",
    description: "Exceptional sound quality and comfort.",
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    category: "earbuds",
    brand: "SoundMagic",
    model: "SM-TWE100",
    image: "/images/EarBuds1.png",
    galleryImages: ["/images/EarBuds1.1.png", "/images/EarBuds1.2.png"],
    sku: "EB001A",
    stock: 120,
    specifications: { batteryLife: "24 hours", connectivity: ["Bluetooth 5.2"], weight: "50g", warranty: "1 year" },
    features: ["Water Resistant", "Touch Controls"],
    tags: ["wireless", "earbuds"],
    isFeatured: true
  },
  // Speakers
  {
    name: "Room-Filling Bluetooth Speaker",
    description: "Powerful sound for any room.",
    price: 89.99,
    originalPrice: 129.99,
    discount: 30,
    category: "speakers",
    brand: "BoomBox",
    model: "BB-S100",
    image: "/images/Speaker1.png",
    galleryImages: ["/images/Speaker1.1.png"],
    sku: "SPK001A",
    stock: 85,
    specifications: { power: "20W", connectivity: ["Bluetooth", "AUX"], weight: "1.2kg", warranty: "1 year" },
    features: ["Portable", "Long Battery Life"],
    tags: ["bluetooth", "speaker"],
    isFeatured: true
  },
  // Microphones
  {
    name: "Professional Studio Condenser Microphone",
    description: "Perfect for home studios and podcasting.",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: "microphones",
    brand: "AudioPro",
    model: "AP-CM1000",
    image: "/images/Microphone1.png",
    galleryImages: ["/images/Microphone1.1.png"],
    sku: "MIC001A",
    stock: 60,
    specifications: { type: "Condenser", pattern: "Cardioid", connectivity: ["XLR"], weight: "380g", warranty: "2 years" },
    features: ["Shock Mount Included", "Pop Filter"],
    tags: ["studio", "microphone"],
    isFeatured: true
  },
  // Neckband Earphones
  {
    name: "Wireless Neckband Earphones",
    description: "Comfortable and long-lasting for active lifestyles.",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    category: "neckband-earphones",
    brand: "FlexSound",
    model: "FS-NB100",
    image: "/images/Neckband1.png",
    galleryImages: ["/images/Neckband1.1.png"],
    sku: "NB001A",
    stock: 12,
    specifications: { batteryLife: "18 hours", connectivity: ["Bluetooth"], weight: "30g", warranty: "1 year" },
    features: ["Magnetic Earbuds", "Quick Charge"],
    tags: ["neckband", "earphones"],
    isFeatured: false
  },
  // DJ Speakers
  {
    name: "Professional DJ Speaker",
    description: "High power for performances and events.",
    price: 399.99,
    originalPrice: 499.99,
    discount: 20,
    category: "dj-speakers",
    brand: "DJPro",
    model: "DJP-1000",
    image: "/images/DJSpeaker1.png",
    galleryImages: ["/images/DJSpeaker1.1.png"],
    sku: "DJS001A",
    stock: 12,
    specifications: { power: "1000W", connectivity: ["XLR", "Bluetooth"], weight: "15kg", warranty: "2 years" },
    features: ["Bass Boost", "LED Lighting"],
    tags: ["dj", "speaker"],
    isFeatured: false
  },
  // Loud Speakers
  {
    name: "High-Powered Loud Speaker",
    description: "Ideal for events and professional use.",
    price: 249.99,
    originalPrice: 299.99,
    discount: 17,
    category: "loud-speakers",
    brand: "EventSound",
    model: "ES-LS500",
    image: "/images/LoudSpeaker1.png",
    galleryImages: ["/images/LoudSpeaker1.1.png"],
    sku: "LS001A",
    stock: 10,
    specifications: { power: "500W", connectivity: ["XLR", "AUX"], weight: "8kg", warranty: "2 years" },
    features: ["Portable", "Rugged Design"],
    tags: ["loud", "speaker"],
    isFeatured: false
  },
  // Home Theater
  {
    name: "Complete Home Theater System",
    description: "Immersive entertainment and theater experience.",
    price: 799.99,
    originalPrice: 999.99,
    discount: 20,
    category: "home-theater",
    brand: "CinemaMax",
    model: "CM-HT2000",
    image: "/images/HomeTheater1.png",
    galleryImages: ["/images/HomeTheater1.1.png"],
    sku: "HT001A",
    stock: 10,
    specifications: { channels: "5.1", connectivity: ["HDMI", "Bluetooth"], weight: "20kg", warranty: "3 years" },
    features: ["Surround Sound", "Wireless Subwoofer"],
    tags: ["home theater", "cinema"],
    isFeatured: false
  }
];

const seedAllCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sounds-accessories');
    console.log('✅ Connected to MongoDB');
    await Product.deleteMany({});
    console.log('✅ All products deleted');
    await Product.insertMany(products);
    console.log('✅ All category products added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding all categories:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAllCategories();
}

module.exports = seedAllCategories;