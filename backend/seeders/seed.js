const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

// Sample products data based on your frontend structure
const products = [
  {
    name: "Premium Studio Headphones",
    description: "Experience crystal clear sound with these professional-grade headphones. Perfect for studio recording, mixing, and casual listening.",
    price: 299.99,
    originalPrice: 349.99,
    discount: 15,
    category: "headphones",
    brand: "AudioTech",
    model: "AT-SH1000",
    image: "/images/HeadPhones1.png",
    galleryImages: [
      "/images/HeadPhones1.1.png",
      "/images/HeadPhones1.2.png"
    ],
    sku: "12345678",
    stock: 50,
    specifications: {
      frequency: "20Hz - 20kHz",
      impedance: "32 ohms",
      sensitivity: "98 dB",
      driverSize: "40mm",
      connectivity: ["Wired", "3.5mm"],
      weight: "250g",
      warranty: "2 years"
    },
    features: [
      "Noise Cancelling",
      "Professional Grade",
      "Comfortable Padding",
      "Adjustable Headband"
    ],
    tags: ["studio", "professional", "headphones"],
    isFeatured: true
  },
  {
    name: "Wireless Gaming Headset",
    description: "Immersive gaming experience with surround sound and crystal clear microphone for competitive gaming.",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: "headphones",
    brand: "GameSound",
    model: "GS-WH200",
    image: "/images/HeadPhones2.png",
    galleryImages: [
      "/images/HeadPhones2.1.png",
      "/images/HeadPhones2.2.png",
      "/images/Headphones2.3.png",
      "/images/Headphones2.4.png"
    ],
    sku: "87654321",
    stock: 75,
    specifications: {
      frequency: "20Hz - 20kHz",
      impedance: "32 ohms",
      sensitivity: "105 dB",
      driverSize: "50mm",
      connectivity: ["Wireless", "Bluetooth", "USB"],
      batteryLife: "25 hours",
      chargingTime: "2 hours",
      weight: "320g",
      warranty: "1 year"
    },
    features: [
      "7.1 Surround Sound",
      "Wireless Connectivity",
      "Gaming Microphone",
      "RGB Lighting"
    ],
    tags: ["gaming", "wireless", "surround"],
    isFeatured: true
  },
  {
    name: "Pro DJ Headphones",
    description: "Professional DJ headphones with superior sound isolation and robust build quality for club and studio use.",
    price: 349.99,
    originalPrice: 399.99,
    discount: 10,
    category: "headphones",
    brand: "DJPro",
    model: "DJ-PRO500",
    image: "/images/Headphones3.png",
    galleryImages: [
      "/images/Headphones3.1.png",
      "/images/Headphones3.2.png",
      "/images/Headphones3.3.png",
      "/images/Headphones3.4.png"
    ],
    sku: "11223344",
    stock: 30,
    specifications: {
      frequency: "5Hz - 30kHz",
      impedance: "35 ohms",
      sensitivity: "102 dB",
      driverSize: "45mm",
      connectivity: ["Wired", "3.5mm", "6.35mm"],
      weight: "380g",
      warranty: "3 years"
    },
    features: [
      "Professional DJ Design",
      "Superior Sound Isolation",
      "Swivel Ear Cups",
      "Detachable Cable"
    ],
    tags: ["dj", "professional", "club"],
    isFeatured: true
  },
  {
    name: "Active Noise Cancelling Headphones",
    description: "Premium noise cancelling headphones perfect for travel and work with exceptional battery life.",
    price: 399.99,
    originalPrice: 499.99,
    discount: 20,
    category: "headphones",
    brand: "SilenceMax",
    model: "SM-ANC1000",
    image: "/images/Headphones4.png",
    galleryImages: [
      "/images/Headphones4.1.png",
      "/images/Headphones4.2.png"
    ],
    sku: "33445566",
    stock: 40,
    specifications: {
      frequency: "20Hz - 20kHz",
      impedance: "32 ohms",
      sensitivity: "100 dB",
      driverSize: "40mm",
      connectivity: ["Wireless", "Bluetooth", "Wired"],
      batteryLife: "30 hours",
      chargingTime: "3 hours",
      weight: "280g",
      warranty: "2 years"
    },
    features: [
      "Active Noise Cancelling",
      "Long Battery Life",
      "Quick Charge",
      "Travel Case Included"
    ],
    tags: ["anc", "travel", "wireless"],
    isFeatured: false
  },
  {
    name: "True Wireless Earbuds Pro",
    description: "Premium true wireless earbuds with active noise cancellation and wireless charging case.",
    price: 249.99,
    originalPrice: 299.99,
    discount: 15,
    category: "earbuds",
    brand: "SoundPro",
    model: "SP-TWS100",
    image: "/images/EarBuds1.png",
    galleryImages: [
      "/images/EarBuds1.1.png",
      "/images/EarBuds1.2.png",
      "/images/EarBuds1.3.png"
    ],
    sku: "77889900",
    stock: 100,
    specifications: {
      frequency: "20Hz - 20kHz",
      impedance: "16 ohms",
      sensitivity: "98 dB",
      driverSize: "12mm",
      connectivity: ["Bluetooth 5.2"],
      batteryLife: "8 hours + 24 hours case",
      chargingTime: "1.5 hours",
      weight: "5g per bud",
      warranty: "1 year"
    },
    features: [
      "Active Noise Cancellation",
      "Wireless Charging Case",
      "IPX4 Water Resistance",
      "Touch Controls"
    ],
    tags: ["wireless", "anc", "waterproof"],
    isFeatured: true
  },
  {
    name: "Professional DJ Speaker System",
    description: "High-powered DJ speaker system perfect for events, clubs, and professional performances.",
    price: 899.99,
    originalPrice: 1199.99,
    discount: 25,
    category: "speakers",
    brand: "BeatMaster",
    model: "BM-DJ2000",
    image: "/images/DJSpeaker1.png",
    galleryImages: [
      "/images/DJSpeaker1.1.png",
      "/images/DJSpeaker1.2.png",
      "/images/DJSpeaker1.3.png"
    ],
    sku: "99887766",
    stock: 15,
    specifications: {
      frequency: "40Hz - 20kHz",
      power: "2000W",
      connectivity: ["XLR", "TRS", "Bluetooth"],
      dimensions: "15\" x 12\" x 24\"",
      weight: "25kg",
      warranty: "2 years"
    },
    features: [
      "High Power Output",
      "Multiple Connectivity Options",
      "Professional Grade",
      "Built-in DSP"
    ],
    tags: ["dj", "professional", "high-power"],
    isFeatured: true
  },
  {
    name: 'Wireless Over-Ear Headphones',
    image: '/images/Headphones1.png',
    description: 'High-quality headphones with comfortable over-ear design and wireless connectivity.',
    brand: 'AudioPhile',
    price: 249.99,
    stock: 10,
    averageRating: 4.5,
    totalReviews: 12,
    isFeatured: true,
    category: 'headphones',
    sku: '44556677',
    galleryImages: [
      '/images/Headphones1.1.png',
      '/images/Headphones1.2.png',
      '/images/Headphones1.3.png'
    ]
  },
  {
    name: 'Premium Studio Headphones',
    image: '/images/Headphones2.png',
    description: 'Professional studio headphones for accurate sound reproduction and monitoring.',
    brand: 'SoundPro',
    price: 349.99,
    stock: 7,
    averageRating: 4.8,
    totalReviews: 9,
    isFeatured: true,
    category: 'headphones',
    sku: '22334455',
    galleryImages: [
      '/images/Headphones2.1.png',
      '/images/Headphones2.2.png',
      '/images/Headphones2.3.png'
    ]
  },
  {
    name: 'Bluetooth Portable Speaker',
    image: '/images/Speaker1.png',
    description: 'Compact and powerful Bluetooth speaker for music on the go.',
    brand: 'SoundWave',
    price: 89.99,
    stock: 20,
    averageRating: 4.2,
    totalReviews: 15,
    isFeatured: true,
    category: 'speakers',
    sku: '66778899',
    galleryImages: [
      '/images/Speaker1.1.png',
      '/images/Speaker1.2.png',
      '/images/Speaker1.3.png'
    ]
  },
  {
    name: 'Wired In-Ear Earphones',
    image: '/images/Earphones1.png',
    description: 'High-fidelity wired earphones for immersive audio experience.',
    brand: 'AudioQuest',
    price: 59.99,
    stock: 25,
    averageRating: 4.0,
    totalReviews: 10,
    isFeatured: false,
    category: 'earphones',
    sku: '88990011',
    galleryImages: [
      '/images/Earphones1.1.png',
      '/images/Earphones1.2.png',
      '/images/Earphones1.3.png'
    ]
  }
];

// Sample admin user
const adminUser = {
  name: "Admin User",
  email: "admin@soundsaccessories.com",
  password: "admin123456",
  role: "admin",
  phone: "1234567890",
  isActive: true,
  isEmailVerified: true
};

// Sample regular user
const regularUser = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "user",
  phone: "9876543210",
  isActive: true,
  isEmailVerified: true
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create users
    console.log('👤 Creating users...');
    const createdAdminUser = await User.create(adminUser);
    const createdRegularUser = await User.create(regularUser);
    console.log(`✅ Created admin user: ${createdAdminUser.email}`);
    console.log(`✅ Created regular user: ${createdRegularUser.email}`);

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Add some sample reviews to products
    console.log('⭐ Adding sample reviews...');
    for (let i = 0; i < Math.min(3, createdProducts.length); i++) {
      const product = createdProducts[i];
      
      product.reviews.push({
        user: createdRegularUser._id,
        name: createdRegularUser.name,
        rating: 5,
        comment: "Excellent product! Highly recommended."
      });

      product.reviews.push({
        user: createdAdminUser._id,
        name: createdAdminUser.name,
        rating: 4,
        comment: "Good quality and great value for money."
      });

      product.calculateAverageRating();
      await product.save();
    }

    console.log('✅ Sample reviews added');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@soundsaccessories.com / admin123456');
    console.log('User: john@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
