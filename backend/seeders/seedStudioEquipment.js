require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const studioEquipmentProducts = [
  {
    name: 'Professional Audio Interface',
    description: 'High-quality USB audio interface with multiple inputs and outputs for professional recording.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: 'studio-equipment',
    subcategory: 'Audio Interfaces',
    brand: 'StudioPro',
    model: 'SP-Interface-8',
    image: '/images/StudioEquipment1.png',
    galleryImages: [
      '/images/StudioEquipment1.1.png',
      '/images/StudioEquipment1.2.png',
      '/images/StudioEquipment1.3.png'
    ],
    specifications: {
      inputs: '8 XLR/TRS inputs',
      outputs: '8 balanced outputs',
      sampleRate: 'Up to 192kHz/24-bit',
      connectivity: 'USB 3.0'
    },
    features: [
      'Zero-latency monitoring',
      'Phantom power on all inputs',
      'MIDI I/O',
      'Professional preamps',
      'Bundled recording software'
    ],
    inStock: true,
    stockQuantity: 15,
    sku: 'SE001',
    weight: '2.5kg',
    dimensions: '25x20x8cm',
    warranty: '3 years',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Studio Monitor Speakers',
    description: 'Near-field studio monitors with accurate sound reproduction for mixing and mastering.',
    price: 449.99,
    originalPrice: 599.99,
    discount: 25,
    category: 'studio-equipment',
    subcategory: 'Studio Monitors',
    brand: 'MonitorMaster',
    model: 'MM-Studio-5',
    image: '/images/StudioEquipment2.png',
    galleryImages: [
      '/images/StudioEquipment2.1.png',
      '/images/StudioEquipment2.2.png',
      '/images/StudioEquipment2.3.png'
    ],
    specifications: {
      driver: '5-inch woofer, 1-inch tweeter',
      power: '50W bi-amplified',
      frequency: '45Hz - 22kHz',
      inputs: 'XLR, TRS, RCA'
    },
    features: [
      'Bi-amplified design',
      'Room correction EQ',
      'Multiple input options',
      'Magnetic shielding',
      'Professional accuracy'
    ],
    inStock: true,
    stockQuantity: 12,
    sku: 'SE002',
    weight: '8kg',
    dimensions: '30x20x25cm',
    warranty: '2 years',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Digital Mixing Console',
    description: 'Compact digital mixer with built-in effects and USB recording capabilities.',
    price: 799.99,
    originalPrice: 999.99,
    discount: 20,
    category: 'studio-equipment',
    subcategory: 'Mixing Consoles',
    brand: 'MixMaster',
    model: 'MM-Digital-16',
    image: '/images/StudioEquipment3.png',
    galleryImages: [
      '/images/StudioEquipment3.1.png',
      '/images/StudioEquipment3.2.png',
      '/images/StudioEquipment3.3.png'
    ],
    specifications: {
      channels: '16 input channels',
      effects: '100+ built-in effects',
      recording: 'USB multitrack recording',
      display: '7-inch touchscreen'
    },
    features: [
      'Digital signal processing',
      'Built-in effects library',
      'USB recording interface',
      'Motorized faders',
      'Scene recall memory'
    ],
    inStock: true,
    stockQuantity: 8,
    sku: 'SE003',
    weight: '12kg',
    dimensions: '60x45x15cm',
    warranty: '2 years',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Condenser Microphone',
    description: 'Large-diaphragm condenser microphone for professional vocal and instrument recording.',
    price: 199.99,
    originalPrice: 279.99,
    discount: 29,
    category: 'studio-equipment',
    subcategory: 'Microphones',
    brand: 'VocalPro',
    model: 'VP-Condenser-1',
    image: '/images/StudioEquipment4.png',
    galleryImages: [
      '/images/StudioEquipment4.1.png',
      '/images/StudioEquipment4.2.png',
      '/images/StudioEquipment4.3.png'
    ],
    specifications: {
      type: 'Large-diaphragm condenser',
      pattern: 'Cardioid',
      frequency: '20Hz - 20kHz',
      sensitivity: '-37dBV/Pa'
    },
    features: [
      'Gold-sputtered diaphragm',
      'Low self-noise',
      'High SPL capability',
      'Shock mount included',
      'Professional sound quality'
    ],
    inStock: true,
    stockQuantity: 25,
    sku: 'SE004',
    weight: '0.5kg',
    dimensions: '20x5x5cm',
    warranty: '2 years',
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Studio Headphones',
    description: 'Professional closed-back headphones for monitoring and mixing applications.',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    category: 'studio-equipment',
    subcategory: 'Studio Headphones',
    brand: 'AudioPro',
    model: 'AP-Studio-HD',
    image: '/images/StudioEquipment5.png',
    galleryImages: [
      '/images/StudioEquipment5.1.png',
      '/images/StudioEquipment5.2.png',
      '/images/StudioEquipment5.3.png'
    ],
    specifications: {
      driver: '40mm dynamic drivers',
      impedance: '32 ohms',
      frequency: '15Hz - 25kHz',
      cable: '3m detachable cable'
    },
    features: [
      'Closed-back design',
      'Comfortable padding',
      'Accurate sound reproduction',
      'Detachable cable',
      'Professional grade'
    ],
    inStock: true,
    stockQuantity: 30,
    sku: 'SE005',
    weight: '0.3kg',
    dimensions: '20x18x8cm',
    warranty: '2 years',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'MIDI Controller Keyboard',
    description: '61-key MIDI controller with velocity-sensitive keys and assignable controls.',
    price: 179.99,
    originalPrice: 249.99,
    discount: 28,
    category: 'studio-equipment',
    subcategory: 'MIDI Controllers',
    brand: 'KeyMaster',
    model: 'KM-MIDI-61',
    image: '/images/StudioEquipment6.png',
    galleryImages: [
      '/images/StudioEquipment6.1.png',
      '/images/StudioEquipment6.2.png',
      '/images/StudioEquipment6.3.png'
    ],
    specifications: {
      keys: '61 velocity-sensitive keys',
      controls: '8 knobs, 8 faders',
      pads: '16 velocity-sensitive pads',
      connectivity: 'USB, MIDI DIN'
    },
    features: [
      'Velocity-sensitive keys',
      'Assignable controls',
      'Drum pads included',
      'Software bundle',
      'Compact design'
    ],
    inStock: true,
    stockQuantity: 18,
    sku: 'SE006',
    weight: '4kg',
    dimensions: '100x30x8cm',
    warranty: '1 year',
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Audio Compressor',
    description: 'Analog-style compressor for dynamic control and sound shaping in the studio.',
    price: 349.99,
    originalPrice: 449.99,
    discount: 22,
    category: 'studio-equipment',
    subcategory: 'Signal Processing',
    brand: 'DynamicsPro',
    model: 'DP-Comp-1',
    image: '/images/StudioEquipment7.png',
    galleryImages: [
      '/images/StudioEquipment7.1.png',
      '/images/StudioEquipment7.2.png',
      '/images/StudioEquipment7.3.png'
    ],
    specifications: {
      type: 'VCA-based compressor',
      ratio: '1:1 to 20:1',
      attack: '0.1ms to 100ms',
      release: '50ms to 5s'
    },
    features: [
      'Analog-modeled compression',
      'Variable ratio control',
      'Side-chain input',
      'Vintage sound character',
      'Professional quality'
    ],
    inStock: true,
    stockQuantity: 10,
    sku: 'SE007',
    weight: '2kg',
    dimensions: '48x20x8cm',
    warranty: '2 years',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Studio Equalizer',
    description: 'Parametric equalizer with surgical precision for frequency shaping and correction.',
    price: 279.99,
    originalPrice: 369.99,
    discount: 24,
    category: 'studio-equipment',
    subcategory: 'Signal Processing',
    brand: 'EQMaster',
    model: 'EQ-Para-4',
    image: '/images/StudioEquipment8.png',
    galleryImages: [
      '/images/StudioEquipment8.1.png',
      '/images/StudioEquipment8.2.png',
      '/images/StudioEquipment8.3.png'
    ],
    specifications: {
      bands: '4-band parametric EQ',
      frequency: '20Hz - 20kHz',
      gain: '±15dB per band',
      q: '0.5 to 10'
    },
    features: [
      'Parametric frequency control',
      'High-precision filters',
      'Bypass switching',
      'Professional grade',
      'Transparent sound'
    ],
    inStock: true,
    stockQuantity: 14,
    sku: 'SE008',
    weight: '1.8kg',
    dimensions: '48x20x6cm',
    warranty: '2 years',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Digital Audio Workstation',
    description: 'Complete DAW software package for recording, editing, and mixing music.',
    price: 399.99,
    originalPrice: 599.99,
    discount: 33,
    category: 'studio-equipment',
    subcategory: 'Software',
    brand: 'DAWPro',
    model: 'DAW-Studio-Pro',
    image: '/images/StudioEquipment9.png',
    galleryImages: [
      '/images/StudioEquipment9.1.png',
      '/images/StudioEquipment9.2.png',
      '/images/StudioEquipment9.3.png'
    ],
    specifications: {
      tracks: 'Unlimited audio tracks',
      plugins: '100+ built-in plugins',
      formats: 'All major audio formats',
      compatibility: 'Windows, Mac, Linux'
    },
    features: [
      'Professional recording',
      'Advanced editing tools',
      'Built-in effects library',
      'MIDI sequencing',
      'Mixing and mastering'
    ],
    inStock: true,
    stockQuantity: 50,
    sku: 'SE009',
    weight: '0.1kg',
    dimensions: 'Digital download',
    warranty: '1 year support',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Studio Rack Mount',
    description: 'Professional 19-inch rack mount system for organizing studio equipment.',
    price: 129.99,
    originalPrice: 179.99,
    discount: 28,
    category: 'studio-equipment',
    subcategory: 'Accessories',
    brand: 'RackPro',
    model: 'RP-Rack-12U',
    image: '/images/StudioEquipment10.png',
    galleryImages: [
      '/images/StudioEquipment10.1.png',
      '/images/StudioEquipment10.2.png',
      '/images/StudioEquipment10.3.png'
    ],
    specifications: {
      size: '12U rack space',
      width: '19-inch standard',
      material: 'Steel construction',
      depth: 'Adjustable depth rails'
    },
    features: [
      'Professional rack standard',
      'Ventilated design',
      'Adjustable depth',
      'Cable management',
      'Sturdy construction'
    ],
    inStock: true,
    stockQuantity: 20,
    sku: 'SE010',
    weight: '15kg',
    dimensions: '60x55x53cm',
    warranty: '5 years',
    rating: 4.3,
    reviews: []
  },
  {
    name: 'Studio Cable Kit',
    description: 'Complete cable kit with XLR, TRS, and patch cables for studio connections.',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    category: 'studio-equipment',
    subcategory: 'Accessories',
    brand: 'CablePro',
    model: 'CP-Studio-Kit',
    image: '/images/StudioEquipment11.png',
    galleryImages: [
      '/images/StudioEquipment11.1.png',
      '/images/StudioEquipment11.2.png',
      '/images/StudioEquipment11.3.png'
    ],
    specifications: {
      xlr: '4x XLR cables (3m)',
      trs: '4x TRS cables (3m)',
      patch: '8x patch cables (0.5m)',
      quality: 'Oxygen-free copper'
    },
    features: [
      'Professional grade cables',
      'Gold-plated connectors',
      'Oxygen-free copper',
      'Flexible jacket',
      'Complete studio kit'
    ],
    inStock: true,
    stockQuantity: 35,
    sku: 'SE011',
    weight: '2kg',
    dimensions: '30x20x10cm',
    warranty: '2 years',
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Acoustic Treatment Panel',
    description: 'Professional acoustic foam panels for studio sound treatment and noise control.',
    price: 199.99,
    originalPrice: 279.99,
    discount: 29,
    category: 'studio-equipment',
    subcategory: 'Acoustic Treatment',
    brand: 'AcousticPro',
    model: 'AP-Foam-Pack',
    image: '/images/StudioEquipment12.png',
    galleryImages: [
      '/images/StudioEquipment12.1.png',
      '/images/StudioEquipment12.2.png',
      '/images/StudioEquipment12.3.png'
    ],
    specifications: {
      quantity: '12 panels (60x60cm)',
      thickness: '5cm thick foam',
      material: 'High-density foam',
      mounting: 'Adhesive backing'
    },
    features: [
      'Professional acoustic foam',
      'Noise reduction',
      'Easy installation',
      'Fire-resistant material',
      'Studio-grade treatment'
    ],
    inStock: true,
    stockQuantity: 25,
    sku: 'SE012',
    weight: '3kg',
    dimensions: '60x60x5cm per panel',
    warranty: '1 year',
    rating: 4.5,
    reviews: []
  }
];

const seedStudioEquipment = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove existing studio-equipment products
    await Product.deleteMany({ category: 'studio-equipment' });
    console.log('Removed existing studio-equipment products');

    // Insert new studio-equipment products
    const insertedProducts = await Product.insertMany(studioEquipmentProducts);
    console.log(`Successfully seeded ${insertedProducts.length} studio-equipment products`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding studio-equipment products:', error);
    process.exit(1);
  }
};

seedStudioEquipment();