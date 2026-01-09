const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const guitarsBasesProducts = [
  {
    name: 'Professional Electric Guitar',
    price: 899.99,
    image: '/images/GuitarsBasses1.png',
    galleryImages: [
      '/images/GuitarsBasses1.1.png',
      '/images/GuitarsBasses1.2.png',
      '/images/GuitarsBasses1.3,png.jpg'
    ],
    description: 'High-quality electric guitar with premium pickups and exceptional tone for professional musicians.',
    category: 'guitars-basses',
    brand: 'StringMaster',
    sku: 'GB001',
    stock: 25,
    discount: 15,
    featured: true,
    specifications: {
      type: 'Electric Guitar',
      body: 'Solid Wood',
      neck: 'Maple',
      pickups: 'Humbucker',
      strings: '6-String'
    }
  },
  {
    name: 'Acoustic Steel String Guitar',
    price: 649.99,
    image: '/images/GuitarsBasses2.png',
    galleryImages: [
      '/images/GuitarsBasses2.1.png',
      '/images/GuitarsBasses2.2.png',
      '/images/GuitarsBasses2.3.png'
    ],
    description: 'Beautiful acoustic guitar with rich, warm tone perfect for fingerpicking and strumming.',
    category: 'guitars-basses',
    brand: 'StringMaster',
    sku: 'GB002',
    stock: 30,
    discount: 10,
    specifications: {
      type: 'Acoustic Guitar',
      body: 'Spruce Top',
      neck: 'Mahogany',
      strings: '6-String',
      finish: 'Natural'
    }
  },
  {
    name: 'Classical Nylon String Guitar',
    price: 549.99,
    image: '/images/GuitarsBasses3.png',
    galleryImages: [
      '/images/GuitarsBasses3.1.png',
      '/images/GuitarsBasses3.2.png',
      '/images/GuitarsBasses3.3.png'
    ],
    description: 'Traditional classical guitar with nylon strings, perfect for classical and flamenco music.',
    category: 'guitars-basses',
    brand: 'StringMaster',
    sku: 'GB003',
    stock: 20,
    discount: 20,
    specifications: {
      type: 'Classical Guitar',
      body: 'Cedar Top',
      neck: 'Spanish Cedar',
      strings: 'Nylon',
      scale: '650mm'
    }
  },
  {
    name: 'Electric Bass Guitar 4-String',
    price: 799.99,
    image: '/images/GuitarsBasses4.png',
    galleryImages: [
      '/images/GuitarsBasses4.1.png',
      '/images/GuitarsBasses4.2.png',
      '/images/GuitarsBasses4.3.png'
    ],
    description: 'Powerful 4-string electric bass with deep, punchy tone for rock, jazz, and funk.',
    category: 'guitars-basses',
    brand: 'BassForce',
    sku: 'GB004',
    stock: 15,
    discount: 25,
    featured: true,
    specifications: {
      type: 'Electric Bass',
      strings: '4-String',
      scale: '34 inch',
      pickups: 'P-Bass Style',
      body: 'Alder'
    }
  },
  {
    name: 'Semi-Hollow Electric Guitar',
    price: 1199.99,
    image: '/images/GuitarsBasses5.png',
    galleryImages: [
      '/images/GuitarsBasses5.1.png',
      '/images/GuitarsBasses5.2.png',
      '/images/GuitarsBasses5.3.png'
    ],
    description: 'Versatile semi-hollow electric guitar perfect for jazz, blues, and rock genres.',
    category: 'guitars-basses',
    brand: 'StringMaster',
    sku: 'GB005',
    stock: 12,
    discount: 12,
    specifications: {
      type: 'Semi-Hollow Electric',
      body: 'Maple',
      f_holes: 'Yes',
      pickups: 'Humbucker',
      bridge: 'Tune-o-matic'
    }
  },
  {
    name: 'Vintage Acoustic Guitar',
    price: 749.99,
    image: '/images/GuitarsBasses6.png',
    galleryImages: [
      '/images/GuitarsBasses6.1.png',
      '/images/GuitarsBasses6.2,png.jpg',
      '/images/GuitarsBasses6.3.png'
    ],
    description: 'Vintage-style acoustic guitar with aged finish and authentic vintage tone.',
    category: 'guitars-basses',
    brand: 'VintageSound',
    sku: 'GB006',
    stock: 18,
    discount: 18,
    specifications: {
      type: 'Vintage Acoustic',
      body: 'Aged Spruce',
      neck: 'Vintage Maple',
      finish: 'Aged Natural',
      year: 'Vintage Style'
    }
  },
  {
    name: 'Electric Guitar Starter Pack',
    price: 399.99,
    image: '/images/GuitarsBasses7.png',
    galleryImages: [
      '/images/GuitarsBasses7.1.png',
      '/images/GuitarsBasses7.2.png',
      '/images/GuitarsBasses7.3.png'
    ],
    description: 'Complete electric guitar starter pack with amplifier, cables, and accessories.',
    category: 'guitars-basses',
    brand: 'BeginnerPro',
    sku: 'GB007',
    stock: 35,
    discount: 30,
    specifications: {
      type: 'Electric Guitar Pack',
      includes: 'Guitar, Amp, Cable',
      amp_power: '10W',
      accessories: 'Pick, Strap',
      level: 'Beginner'
    }
  },
  {
    name: '5-String Electric Bass',
    price: 999.99,
    image: '/images/GuitarsBasses8.png',
    galleryImages: [
      '/images/GuitarsBasses8.1,png.jpg',
      '/images/GuitarsBasses8.1.png',
      '/images/GuitarsBasses8.2.png',
      '/images/GuitarsBasses8.3,png.jpg'
    ],
    description: 'Extended range 5-string electric bass for modern playing styles and extended low end.',
    category: 'guitars-basses',
    brand: 'BassForce',
    sku: 'GB008',
    stock: 10,
    discount: 15,
    featured: true,
    specifications: {
      type: '5-String Bass',
      strings: '5-String',
      scale: '35 inch',
      pickups: 'Active',
      preamp: 'Built-in'
    }
  },
  {
    name: 'Resonator Guitar',
    price: 849.99,
    image: '/images/GuitarsBasses9.png',
    galleryImages: [
      '/images/GuitarsBasses9.1.png',
      '/images/GuitarsBasses9.2.png',
      '/images/GuitarsBasses9.3.png'
    ],
    description: 'Unique resonator guitar with distinctive metallic tone, perfect for blues and slide guitar.',
    category: 'guitars-basses',
    brand: 'ResoTone',
    sku: 'GB009',
    stock: 8,
    discount: 22,
    specifications: {
      type: 'Resonator Guitar',
      cone: 'Metal Resonator',
      body: 'Steel',
      style: 'National Style',
      sound: 'Metallic Tone'
    }
  },
  {
    name: 'Fretless Electric Bass',
    price: 1149.99,
    image: '/images/GuitarsBasses10.png',
    galleryImages: [
      '/images/GuitarsBasses10.1.png',
      '/images/GuitarsBasses10.2.png',
      '/images/GuitarsBasses10.3.png'
    ],
    description: 'Smooth fretless electric bass for expressive playing and unique sliding tones.',
    category: 'guitars-basses',
    brand: 'BassForce',
    sku: 'GB010',
    stock: 6,
    discount: 20,
    specifications: {
      type: 'Fretless Bass',
      frets: 'Fretless',
      fingerboard: 'Ebony',
      strings: '4-String',
      tone: 'Smooth Sliding'
    }
  },
  {
    name: '12-String Acoustic Guitar',
    price: 899.99,
    image: '/images/GuitarsBasses11.png',
    galleryImages: [
      '/images/GuitarsBasses11.1.png',
      '/images/GuitarsBasses11.2,png.jpg',
      '/images/GuitarsBasses11.3.png'
    ],
    description: 'Rich-sounding 12-string acoustic guitar with full, chorus-like tone.',
    category: 'guitars-basses',
    brand: 'StringMaster',
    sku: 'GB011',
    stock: 14,
    discount: 16,
    specifications: {
      type: '12-String Acoustic',
      strings: '12-String',
      body: 'Dreadnought',
      sound: 'Chorus Effect',
      tuning: 'Standard 12-String'
    }
  },
  {
    name: 'Premium Hollow Body Guitar',
    price: 1599.99,
    image: '/images/GuitarsBasses12.png',
    galleryImages: [
      '/images/GuitarsBasses12.1.png',
      '/images/GuitarsBasses12.2.png',
      '/images/GuitarsBasses12.3.png'
    ],
    description: 'Luxury hollow body electric guitar with premium appointments and exceptional craftsmanship.',
    category: 'guitars-basses',
    brand: 'PremiumCraft',
    sku: 'GB012',
    stock: 5,
    discount: 10,
    featured: true,
    specifications: {
      type: 'Hollow Body Electric',
      body: 'Full Hollow',
      top: 'Flamed Maple',
      pickups: 'Premium Humbucker',
      finish: 'High Gloss'
    }
  }
];

const seedGuitarsBasses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove existing guitars-basses products
    await Product.deleteMany({ category: 'guitars-basses' });
    console.log('Removed existing guitars-basses products');

    // Insert new products
    const insertedProducts = await Product.insertMany(guitarsBasesProducts);
    console.log(`✅ Successfully seeded ${insertedProducts.length} guitars-basses products`);

    // Display summary
    console.log('\n=== GUITARS-BASSES PRODUCTS SUMMARY ===');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.discount}% off)`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding guitars-basses products:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedGuitarsBasses();
}

module.exports = seedGuitarsBasses;