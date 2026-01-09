const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const keyboardsPianosProducts = [
  {
    name: 'Professional Digital Piano 88-Key',
    description: 'Full-size weighted action digital piano with authentic piano sound and touch sensitivity. Perfect for professional performances and practice.',
    price: 1299.99,
    originalPrice: 1599.99,
    discount: 19,
    category: 'keyboards-pianos',
    brand: 'Yamaha',
    model: 'P-125',
    sku: 'KP001',
    stock: 15,
    image: '/images/KeyboardsPianos1.png',
    galleryImages: [
      '/images/KeyboardsPianos1.1.png',
      '/images/KeyboardsPianos1.2.png',
      '/images/KeyboardsPianos1.3.png'
    ],
    specifications: {
      keys: '88 weighted keys',
      polyphony: '192 voices',
      sounds: '24 high-quality voices',
      connectivity: 'USB, MIDI, Bluetooth',
      dimensions: '132.6 x 29.5 x 16.6 cm',
      weight: '11.8 kg'
    },
    featured: true,
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Compact Electronic Keyboard 61-Key',
    description: 'Versatile 61-key electronic keyboard with hundreds of sounds, rhythms, and learning features. Ideal for beginners and hobbyists.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: 'keyboards-pianos',
    brand: 'Casio',
    model: 'CTK-3500',
    sku: 'KP002',
    stock: 25,
    image: '/images/KeyboardsPianos2.png',
    galleryImages: [
      '/images/KeyboardsPianos2.1.png',
      '/images/KeyboardsPianos2.2.png',
      '/images/KeyboardsPianos2.3.png'
    ],
    specifications: {
      keys: '61 full-size keys',
      polyphony: '48 voices',
      sounds: '400 tones',
      rhythms: '77 built-in rhythms',
      dimensions: '94.6 x 30.7 x 9.2 cm',
      weight: '3.4 kg'
    },
    featured: false,
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Stage Piano 73-Key Semi-Weighted',
    description: 'Professional stage piano with semi-weighted keys, premium sounds, and robust build quality for live performances.',
    price: 899.99,
    originalPrice: 1199.99,
    discount: 25,
    category: 'keyboards-pianos',
    brand: 'Roland',
    model: 'FP-30X',
    sku: 'KP003',
    stock: 12,
    image: '/images/KeyboardsPianos3.png',
    galleryImages: [
      '/images/KeyboardsPianos3.1.png',
      '/images/KeyboardsPianos3.2.png',
      '/images/KeyboardsPianos3.3.png'
    ],
    specifications: {
      keys: '73 semi-weighted keys',
      polyphony: '128 voices',
      sounds: '35 high-quality sounds',
      connectivity: 'USB, Bluetooth, Audio I/O',
      dimensions: '130.0 x 28.4 x 15.0 cm',
      weight: '16.7 kg'
    },
    featured: true,
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Synthesizer Workstation 61-Key',
    description: 'Advanced synthesizer workstation with powerful sound engine, sequencer, and extensive connectivity options for music production.',
    price: 1899.99,
    originalPrice: 2299.99,
    discount: 17,
    category: 'keyboards-pianos',
    brand: 'Korg',
    model: 'Kronos 61',
    sku: 'KP004',
    stock: 8,
    image: '/images/KeyboardsPianos4.png',
    galleryImages: [
      '/images/KeyboardsPianos4.1.png',
      '/images/KeyboardsPianos4.2.png',
      '/images/KeyboardsPianos4.3.png'
    ],
    specifications: {
      keys: '61 velocity-sensitive keys',
      polyphony: '120 voices',
      sounds: '1000+ programs',
      sequencer: '16-track MIDI sequencer',
      dimensions: '108.0 x 37.4 x 13.2 cm',
      weight: '18.0 kg'
    },
    featured: true,
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Portable Keyboard 49-Key',
    description: 'Ultra-portable 49-key keyboard with battery power, built-in speakers, and essential sounds for on-the-go music making.',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: 'keyboards-pianos',
    brand: 'Alesis',
    model: 'Melody 49',
    sku: 'KP005',
    stock: 30,
    image: '/images/KeyboardsPianos5.png',
    galleryImages: [
      '/images/KeyboardsPianos5.1.png',
      '/images/KeyboardsPianos5.2.png',
      '/images/KeyboardsPianos5.3.png'
    ],
    specifications: {
      keys: '49 velocity-sensitive keys',
      polyphony: '32 voices',
      sounds: '300 built-in sounds',
      power: 'Battery or AC adapter',
      dimensions: '78.7 x 26.7 x 7.6 cm',
      weight: '2.7 kg'
    },
    featured: false,
    rating: 4.3,
    reviews: []
  },
  {
    name: 'MIDI Controller Keyboard 25-Key',
    description: 'Compact 25-key MIDI controller with velocity-sensitive keys, knobs, and pads for music production and performance.',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    category: 'keyboards-pianos',
    brand: 'Akai',
    model: 'MPK Mini MK3',
    sku: 'KP006',
    stock: 40,
    image: '/images/KeyboardsPianos6.png',
    galleryImages: [
      '/images/KeyboardsPianos6.1.png',
      '/images/KeyboardsPianos6.2.png',
      '/images/KeyboardsPianos6.3.png'
    ],
    specifications: {
      keys: '25 velocity-sensitive keys',
      controls: '8 knobs, 8 pads',
      connectivity: 'USB-powered',
      software: 'Includes MPC Beats',
      dimensions: '31.8 x 18.1 x 4.1 cm',
      weight: '0.7 kg'
    },
    featured: false,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Upright Digital Piano Console',
    description: 'Elegant upright digital piano with wooden cabinet, 88 weighted keys, and premium piano samples for home use.',
    price: 2199.99,
    originalPrice: 2699.99,
    discount: 19,
    category: 'keyboards-pianos',
    brand: 'Kawai',
    model: 'CN29',
    sku: 'KP007',
    stock: 6,
    image: '/images/KeyboardsPianos7.png',
    galleryImages: [
      '/images/KeyboardsPianos7.1.png',
      '/images/KeyboardsPianos7.2.png',
      '/images/KeyboardsPianos7.3.png'
    ],
    specifications: {
      keys: '88 weighted hammer action',
      polyphony: '192 voices',
      sounds: '19 high-quality sounds',
      pedals: '3 pedals included',
      dimensions: '136.0 x 40.5 x 86.0 cm',
      weight: '43.0 kg'
    },
    featured: true,
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Arranger Keyboard 76-Key',
    description: 'Professional arranger keyboard with 76 keys, auto-accompaniment, and extensive sound library for live performance.',
    price: 1599.99,
    originalPrice: 1999.99,
    discount: 20,
    category: 'keyboards-pianos',
    brand: 'Yamaha',
    model: 'PSR-SX700',
    sku: 'KP008',
    stock: 10,
    image: '/images/KeyboardsPianos8.png',
    galleryImages: [
      '/images/KeyboardsPianos8.1.png',
      '/images/KeyboardsPianos8.2.png',
      '/images/KeyboardsPianos8.3.png'
    ],
    specifications: {
      keys: '76 velocity-sensitive keys',
      polyphony: '128 voices',
      sounds: '850+ voices',
      styles: '400+ accompaniment styles',
      dimensions: '121.7 x 46.0 x 16.1 cm',
      weight: '15.1 kg'
    },
    featured: false,
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Analog Synthesizer 37-Key',
    description: 'Vintage-style analog synthesizer with 37 keys, classic oscillators, and authentic analog sound for electronic music.',
    price: 799.99,
    originalPrice: 999.99,
    discount: 20,
    category: 'keyboards-pianos',
    brand: 'Moog',
    model: 'Subsequent 37',
    sku: 'KP009',
    stock: 5,
    image: '/images/KeyboardsPianos9.png',
    galleryImages: [
      '/images/KeyboardsPianos9.1.png',
      '/images/KeyboardsPianos9.2.png',
      '/images/KeyboardsPianos9.3.png'
    ],
    specifications: {
      keys: '37 velocity-sensitive keys',
      oscillators: '2 analog oscillators',
      filter: 'Moog ladder filter',
      sequencer: '32-step sequencer',
      dimensions: '58.4 x 24.1 x 8.9 cm',
      weight: '7.3 kg'
    },
    featured: true,
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Workstation Keyboard 88-Key',
    description: 'Professional 88-key workstation with sampling, sequencing, and comprehensive sound editing capabilities.',
    price: 2799.99,
    originalPrice: 3299.99,
    discount: 15,
    category: 'keyboards-pianos',
    brand: 'Kurzweil',
    model: 'PC4-7',
    sku: 'KP010',
    stock: 4,
    image: '/images/KeyboardsPianos10.png',
    galleryImages: [
      '/images/KeyboardsPianos10.1.png',
      '/images/KeyboardsPianos10.2.png',
      '/images/KeyboardsPianos10.3.png'
    ],
    specifications: {
      keys: '88 semi-weighted keys',
      polyphony: '128 voices',
      sounds: '1000+ programs',
      sampling: '16-bit/48kHz sampling',
      dimensions: '144.8 x 35.6 x 12.7 cm',
      weight: '22.7 kg'
    },
    featured: false,
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Electric Piano 73-Key Vintage',
    description: 'Classic electric piano with 73 keys, authentic vintage sound, and built-in effects for retro music styles.',
    price: 1199.99,
    originalPrice: 1499.99,
    discount: 20,
    category: 'keyboards-pianos',
    brand: 'Nord',
    model: 'Electro 6D 73',
    sku: 'KP011',
    stock: 7,
    image: '/images/KeyboardsPianos11.png',
    galleryImages: [
      '/images/KeyboardsPianos11.1.png',
      '/images/KeyboardsPianos11.2.png',
      '/images/KeyboardsPianos11.3.png'
    ],
    specifications: {
      keys: '73 waterfall keys',
      polyphony: '120 voices',
      sounds: 'Electric pianos, organs, synths',
      effects: 'Built-in reverb, delay, chorus',
      dimensions: '109.0 x 26.0 x 9.0 cm',
      weight: '12.9 kg'
    },
    featured: true,
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Home Piano 88-Key Weighted',
    description: 'Affordable 88-key weighted digital piano with realistic piano action and sound, perfect for home practice.',
    price: 699.99,
    originalPrice: 899.99,
    discount: 22,
    category: 'keyboards-pianos',
    brand: 'Casio',
    model: 'Privia PX-770',
    sku: 'KP012',
    stock: 18,
    image: '/images/KeyboardsPianos12.png',
    galleryImages: [
      '/images/KeyboardsPianos12.1.png',
      '/images/KeyboardsPianos12.2.png',
      '/images/KeyboardsPianos12.3.png'
    ],
    specifications: {
      keys: '88 weighted hammer action',
      polyphony: '128 voices',
      sounds: '19 high-quality tones',
      pedals: '3-pedal system',
      dimensions: '139.1 x 29.9 x 79.9 cm',
      weight: '31.5 kg'
    },
    featured: false,
    rating: 4.5,
    reviews: []
  }
];

const seedKeyboardsPianos = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove existing keyboards-pianos products
    await Product.deleteMany({ category: 'keyboards-pianos' });
    console.log('Removed existing keyboards-pianos products');

    // Insert new products
    const insertedProducts = await Product.insertMany(keyboardsPianosProducts);
    console.log(`Successfully seeded ${insertedProducts.length} keyboards-pianos products`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding keyboards-pianos products:', error);
    process.exit(1);
  }
};

seedKeyboardsPianos();