require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const drumsPercussionProducts = [
  // Darbukas Collection
  {
    name: 'Traditional Turkish Darbuka',
    description: 'Authentic Turkish darbuka with aluminum body and natural skin head. Perfect for Middle Eastern music.',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'TurkishRhythm',
    model: 'TR-Darbuka-1',
    image: '/images/DrumsPercussion_Darbukas1.png',
    galleryImages: [
      '/images/DrumsPercussion_Darbukas1.1.png',
      '/images/DrumsPercussion_Darbukas1.2.png'
    ],
    specifications: {
      material: 'Aluminum body',
      head: 'Natural goatskin',
      size: '8.5 inch diameter',
      height: '16 inches'
    },
    features: [
      'Traditional Turkish design',
      'Aluminum construction',
      'Natural skin head',
      'Rich, warm tone',
      'Lightweight and portable'
    ],
    inStock: true,
    stockQuantity: 20,
    sku: 'DP001',
    weight: '1.5kg',
    dimensions: '22x22x41cm',
    warranty: '1 year',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Professional Darbuka Pro',
    description: 'High-end professional darbuka with superior sound quality and craftsmanship.',
    price: 229.99,
    originalPrice: 299.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'TurkishRhythm',
    model: 'TR-Darbuka-2',
    image: '/images/DrumsPercussion_Darbukas2.png',
    galleryImages: [
      '/images/DrumsPercussion_Darbukas2.1.png',
      '/images/DrumsPercussion_Darbukas2.2.png'
    ],
    specifications: {
      material: 'Cast aluminum',
      head: 'Premium synthetic',
      size: '9 inch diameter',
      height: '17 inches'
    },
    features: [
      'Professional grade',
      'Cast aluminum body',
      'Synthetic head',
      'Enhanced projection',
      'Tunable rim'
    ],
    inStock: true,
    stockQuantity: 15,
    sku: 'DP002',
    weight: '1.8kg',
    dimensions: '23x23x43cm',
    warranty: '2 years',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Decorative Darbuka Deluxe',
    description: 'Beautifully decorated darbuka with intricate patterns and premium finish.',
    price: 189.99,
    originalPrice: 249.99,
    discount: 24,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'TurkishRhythm',
    model: 'TR-Darbuka-3',
    image: '/images/DrumsPercussion_Darbukas3.png',
    galleryImages: [
      '/images/DrumsPercussion_Darbukas3.1.png',
      '/images/DrumsPercussion_Darbukas3.2.png'
    ],
    specifications: {
      material: 'Decorated aluminum',
      head: 'Natural goatskin',
      size: '8.5 inch diameter',
      height: '16 inches'
    },
    features: [
      'Intricate decorations',
      'Artistic patterns',
      'Natural skin head',
      'Beautiful finish',
      'Display worthy'
    ],
    inStock: true,
    stockQuantity: 12,
    sku: 'DP003',
    weight: '1.6kg',
    dimensions: '22x22x41cm',
    warranty: '1 year',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Compact Travel Darbuka',
    description: 'Compact and lightweight darbuka perfect for travel and practice sessions.',
    price: 99.99,
    originalPrice: 129.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'TurkishRhythm',
    model: 'TR-Darbuka-4',
    image: '/images/DrumsPercussion_Darbukas4.png',
    galleryImages: [
      '/images/DrumsPercussion_Darbukas4.1.png',
      '/images/DrumsPercussion_Darbukas4.2.png'
    ],
    specifications: {
      material: 'Lightweight aluminum',
      head: 'Synthetic',
      size: '7 inch diameter',
      height: '14 inches'
    },
    features: [
      'Compact size',
      'Travel friendly',
      'Lightweight design',
      'Good projection',
      'Affordable price'
    ],
    inStock: true,
    stockQuantity: 25,
    sku: 'DP004',
    weight: '1.2kg',
    dimensions: '18x18x36cm',
    warranty: '1 year',
    rating: 4.4,
    reviews: []
  },
  // Dholak Collection
  {
    name: 'Traditional Indian Dholak',
    description: 'Authentic Indian dholak with mango wood body and natural skin heads.',
    price: 179.99,
    originalPrice: 229.99,
    discount: 22,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'IndianBeats',
    model: 'IB-Dholak-1',
    image: '/images/DrumsPercussion_Dholak1.png',
    galleryImages: [
      '/images/DrumsPercussion_Dholak1.1.png',
      '/images/DrumsPercussion_Dholak1.2.png'
    ],
    specifications: {
      material: 'Mango wood',
      heads: 'Natural goatskin',
      size: '16 inch length',
      diameter: '10 inches'
    },
    features: [
      'Traditional design',
      'Mango wood body',
      'Natural skin heads',
      'Rich bass tone',
      'Rope tensioning'
    ],
    inStock: true,
    stockQuantity: 18,
    sku: 'DP005',
    weight: '3.5kg',
    dimensions: '41x26x26cm',
    warranty: '1 year',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Professional Dholak Pro',
    description: 'High-quality professional dholak with superior sound and craftsmanship.',
    price: 249.99,
    originalPrice: 319.99,
    discount: 22,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'IndianBeats',
    model: 'IB-Dholak-2',
    image: '/images/DrumsPercussion_Dholak2.png',
    galleryImages: [
      '/images/DrumsPercussion_Dholak2.1.png',
      '/images/DrumsPercussion_Dholak2.2.png'
    ],
    specifications: {
      material: 'Premium sheesham wood',
      heads: 'Concert-grade goatskin',
      size: '17 inch length',
      diameter: '11 inches'
    },
    features: [
      'Professional grade',
      'Premium materials',
      'Concert quality',
      'Enhanced projection',
      'Fine tuning capability'
    ],
    inStock: true,
    stockQuantity: 12,
    sku: 'DP006',
    weight: '4kg',
    dimensions: '43x28x28cm',
    warranty: '2 years',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Decorative Dholak Deluxe',
    description: 'Beautifully decorated dholak with brass fittings and artistic patterns.',
    price: 199.99,
    originalPrice: 259.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'IndianBeats',
    model: 'IB-Dholak-3',
    image: '/images/DrumsPercussion_Dholak3.png',
    galleryImages: [
      '/images/DrumsPercussion_Dholak3.1.png',
      '/images/DrumsPercussion_Dholak3.2.png'
    ],
    specifications: {
      material: 'Decorated mango wood',
      heads: 'Natural goatskin',
      size: '16 inch length',
      diameter: '10 inches'
    },
    features: [
      'Artistic decorations',
      'Brass fittings',
      'Beautiful patterns',
      'Traditional sound',
      'Display quality'
    ],
    inStock: true,
    stockQuantity: 15,
    sku: 'DP007',
    weight: '3.8kg',
    dimensions: '41x26x26cm',
    warranty: '1 year',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Student Dholak Basic',
    description: 'Entry-level dholak perfect for students and beginners learning Indian percussion.',
    price: 129.99,
    originalPrice: 169.99,
    discount: 24,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'IndianBeats',
    model: 'IB-Dholak-4',
    image: '/images/DrumsPercussion_Dholak4.png',
    galleryImages: [
      '/images/DrumsPercussion_Dholak4.1.png',
      '/images/DrumsPercussion_Dholak4.2.png'
    ],
    specifications: {
      material: 'Mango wood',
      heads: 'Synthetic',
      size: '15 inch length',
      diameter: '9 inches'
    },
    features: [
      'Student friendly',
      'Affordable price',
      'Good sound quality',
      'Durable construction',
      'Easy to maintain'
    ],
    inStock: true,
    stockQuantity: 30,
    sku: 'DP008',
    weight: '3kg',
    dimensions: '38x23x23cm',
    warranty: '1 year',
    rating: 4.3,
    reviews: []
  },
  // Djembe Collection
  {
    name: 'Traditional African Djembe',
    description: 'Authentic African djembe hand-carved from solid hardwood with goatskin head.',
    price: 199.99,
    originalPrice: 259.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'AfricanRhythm',
    model: 'AR-Djembe-1',
    image: '/images/DrumsPercussion_Djembe1.png',
    galleryImages: [
      '/images/DrumsPercussion_Djembe1.1.png',
      '/images/DrumsPercussion_Djembe1.2.png'
    ],
    specifications: {
      material: 'Hardwood body',
      head: 'Natural goatskin',
      size: '12 inch diameter',
      height: '24 inches'
    },
    features: [
      'Hand-carved design',
      'Traditional African style',
      'Natural goatskin head',
      'Rich, warm tone',
      'Rope tensioning system'
    ],
    inStock: true,
    stockQuantity: 16,
    sku: 'DP009',
    weight: '5kg',
    dimensions: '31x31x61cm',
    warranty: '1 year',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Large African Djembe',
    description: 'Large professional djembe with deep, resonant tone perfect for ensemble playing.',
    price: 279.99,
    originalPrice: 369.99,
    discount: 24,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'AfricanRhythm',
    model: 'AR-Djembe-2',
    image: '/images/DrumsPercussion_Djembe2.png',
    galleryImages: [
      '/images/DrumsPercussion_Djembe2.1.png',
      '/images/DrumsPercussion_Djembe2.2.png'
    ],
    specifications: {
      material: 'Hardwood body',
      head: 'Premium goatskin',
      size: '14 inch diameter',
      height: '26 inches'
    },
    features: [
      'Large 14-inch head',
      'Deep, resonant tone',
      'Hand-carved details',
      'Premium goatskin',
      'Professional quality'
    ],
    inStock: true,
    stockQuantity: 12,
    sku: 'DP010',
    weight: '6kg',
    dimensions: '36x36x66cm',
    warranty: '1 year',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Decorative Djembe Art',
    description: 'Artistically decorated djembe with beautiful carvings and painted designs.',
    price: 239.99,
    originalPrice: 309.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'AfricanRhythm',
    model: 'AR-Djembe-3',
    image: '/images/DrumsPercussion_Djembe3.png',
    galleryImages: [
      '/images/DrumsPercussion_Djembe3.1.png',
      '/images/DrumsPercussion_Djembe3.2.png'
    ],
    specifications: {
      material: 'Carved hardwood',
      head: 'Natural goatskin',
      size: '12 inch diameter',
      height: '24 inches'
    },
    features: [
      'Artistic carvings',
      'Painted designs',
      'Cultural patterns',
      'Display quality',
      'Authentic sound'
    ],
    inStock: true,
    stockQuantity: 10,
    sku: 'DP011',
    weight: '5.2kg',
    dimensions: '31x31x61cm',
    warranty: '1 year',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Compact Djembe Travel',
    description: 'Compact djembe perfect for travel, practice, and smaller venues.',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'AfricanRhythm',
    model: 'AR-Djembe-4',
    image: '/images/DrumsPercussion_Djembe4.png',
    galleryImages: [
      '/images/DrumsPercussion_Djembe4.1.png',
      '/images/DrumsPercussion_Djembe4.2.png'
    ],
    specifications: {
      material: 'Hardwood body',
      head: 'Synthetic',
      size: '10 inch diameter',
      height: '20 inches'
    },
    features: [
      'Compact size',
      'Travel friendly',
      'Good projection',
      'Lightweight',
      'Affordable price'
    ],
    inStock: true,
    stockQuantity: 22,
    sku: 'DP012',
    weight: '3.5kg',
    dimensions: '26x26x51cm',
    warranty: '1 year',
    rating: 4.4,
    reviews: []
  },
  // Acoustic Drums Collection
  {
    name: 'Professional Acoustic Drum Kit',
    description: 'Complete 5-piece acoustic drum set with cymbals and hardware. Perfect for live performances and studio recording.',
    price: 899.99,
    originalPrice: 1199.99,
    discount: 25,
    category: 'drums-percussion',
    subcategory: 'Acoustic Drums',
    brand: 'DrumMaster',
    model: 'DM-5000',
    image: '/images/DrumsPercussion_Drums1.png',
    galleryImages: [
      '/images/DrumsPercussion_Drums1.1.png',
      '/images/DrumsPercussion_Drums1.2.png'
    ],
    specifications: {
      material: 'Birch Wood',
      finish: 'Natural Satin',
      configuration: '5-piece kit',
      cymbals: 'Included'
    },
    features: [
      '5-piece configuration',
      'Birch wood shells',
      'Chrome hardware',
      'Professional cymbals included',
      'Adjustable stands'
    ],
    inStock: true,
    stockQuantity: 15,
    sku: 'DP013',
    weight: '45kg',
    dimensions: '150x120x100cm',
    warranty: '2 years',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Studio Acoustic Drum Kit',
    description: 'Premium studio-grade acoustic drum kit with maple shells and professional hardware.',
    price: 1299.99,
    originalPrice: 1699.99,
    discount: 24,
    category: 'drums-percussion',
    subcategory: 'Acoustic Drums',
    brand: 'DrumMaster',
    model: 'DM-Studio',
    image: '/images/DrumsPercussion_Drums2.png',
    galleryImages: [
      '/images/DrumsPercussion_Drums2.1.png',
      '/images/DrumsPercussion_Drums2.2.png'
    ],
    specifications: {
      material: 'Maple Wood',
      finish: 'High Gloss',
      configuration: '6-piece kit',
      cymbals: 'Premium included'
    },
    features: [
      '6-piece configuration',
      'Maple wood shells',
      'Premium hardware',
      'Studio-grade cymbals',
      'Professional stands'
    ],
    inStock: true,
    stockQuantity: 8,
    sku: 'DP014',
    weight: '52kg',
    dimensions: '160x130x110cm',
    warranty: '3 years',
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Compact Acoustic Drum Set',
    description: 'Space-saving 4-piece acoustic drum kit perfect for small venues and practice rooms.',
    price: 649.99,
    originalPrice: 849.99,
    discount: 24,
    category: 'drums-percussion',
    subcategory: 'Acoustic Drums',
    brand: 'DrumMaster',
    model: 'DM-Compact',
    image: '/images/DrumsPercussion_Drums3.png',
    galleryImages: [
      '/images/DrumsPercussion_Drums3.1.png',
      '/images/DrumsPercussion_Drums3.2.png'
    ],
    specifications: {
      material: 'Poplar Wood',
      finish: 'Satin Black',
      configuration: '4-piece kit',
      cymbals: 'Basic included'
    },
    features: [
      'Compact design',
      'Space-saving',
      'Good sound quality',
      'Affordable price',
      'Easy setup'
    ],
    inStock: true,
    stockQuantity: 20,
    sku: 'DP015',
    weight: '35kg',
    dimensions: '120x100x90cm',
    warranty: '2 years',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Junior Acoustic Drum Kit',
    description: 'Child-sized acoustic drum kit designed for young drummers and beginners.',
    price: 399.99,
    originalPrice: 519.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'Acoustic Drums',
    brand: 'DrumMaster',
    model: 'DM-Junior',
    image: '/images/DrumsPercussion_Drums4.png',
    galleryImages: [
      '/images/DrumsPercussion_Drums4.1.png',
      '/images/DrumsPercussion_Drums4.2.png'
    ],
    specifications: {
      material: 'Basswood',
      finish: 'Bright Colors',
      configuration: '3-piece kit',
      cymbals: 'Child-sized included'
    },
    features: [
      'Child-sized',
      'Colorful finish',
      'Easy to play',
      'Safe construction',
      'Educational value'
    ],
    inStock: true,
    stockQuantity: 25,
    sku: 'DP016',
    weight: '20kg',
    dimensions: '90x80x70cm',
    warranty: '1 year',
    rating: 4.6,
    reviews: []
  },
  // Electronic Drums Collection
  {
    name: 'Electronic Drum Set Pro',
    description: 'Advanced electronic drum kit with mesh heads and premium sound module. Ideal for practice and recording.',
    price: 1299.99,
    originalPrice: 1599.99,
    discount: 19,
    category: 'drums-percussion',
    subcategory: 'Electronic Drums',
    brand: 'ElectroBeat',
    model: 'EB-Pro8',
    image: '/images/DrumsPercussion_ElectricDrums1.png',
    galleryImages: [
      '/images/DrumsPercussion_ElectricDrums1.1.png',
      '/images/DrumsPercussion_ElectricDrums1.2.png'
    ],
    specifications: {
      pads: '8 velocity-sensitive pads',
      sounds: '500+ drum sounds',
      connectivity: 'USB, MIDI, Audio out',
      display: 'LCD with backlight'
    },
    features: [
      'Mesh drum heads',
      '500+ realistic sounds',
      'USB/MIDI connectivity',
      'Built-in metronome',
      'Recording capability'
    ],
    inStock: true,
    stockQuantity: 12,
    sku: 'DP017',
    weight: '25kg',
    dimensions: '120x100x80cm',
    warranty: '3 years',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Compact Electronic Drum Kit',
    description: 'Space-saving electronic drum kit perfect for home practice and small studios.',
    price: 799.99,
    originalPrice: 999.99,
    discount: 20,
    category: 'drums-percussion',
    subcategory: 'Electronic Drums',
    brand: 'ElectroBeat',
    model: 'EB-Compact',
    image: '/images/DrumsPercussion_ElectricDrums2.png',
    galleryImages: [
      '/images/DrumsPercussion_ElectricDrums2.1.png',
      '/images/DrumsPercussion_ElectricDrums2.2.png'
    ],
    specifications: {
      pads: '5 velocity-sensitive pads',
      sounds: '200+ drum sounds',
      connectivity: 'USB, Audio out',
      display: 'LED display'
    },
    features: [
      'Compact design',
      '200+ sounds',
      'USB connectivity',
      'Headphone output',
      'Easy setup'
    ],
    inStock: true,
    stockQuantity: 18,
    sku: 'DP018',
    weight: '15kg',
    dimensions: '90x70x60cm',
    warranty: '2 years',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Professional Electronic Drums',
    description: 'High-end electronic drum system with advanced sound engine and premium pads.',
    price: 1899.99,
    originalPrice: 2399.99,
    discount: 21,
    category: 'drums-percussion',
    subcategory: 'Electronic Drums',
    brand: 'ElectroBeat',
    model: 'EB-Professional',
    image: '/images/DrumsPercussion_ElectricDrums3.png',
    galleryImages: [
      '/images/DrumsPercussion_ElectricDrums3.1.png',
      '/images/DrumsPercussion_ElectricDrums3.2.png'
    ],
    specifications: {
      pads: '12 velocity-sensitive pads',
      sounds: '1000+ drum sounds',
      connectivity: 'USB, MIDI, Audio I/O',
      display: 'Color LCD touchscreen'
    },
    features: [
      'Premium mesh heads',
      '1000+ studio sounds',
      'Advanced sound engine',
      'Multi-zone pads',
      'Professional connectivity'
    ],
    inStock: true,
    stockQuantity: 6,
    sku: 'DP019',
    weight: '35kg',
    dimensions: '140x110x90cm',
    warranty: '3 years',
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Beginner Electronic Drum Set',
    description: 'Entry-level electronic drum kit perfect for beginners and practice sessions.',
    price: 449.99,
    originalPrice: 599.99,
    discount: 25,
    category: 'drums-percussion',
    subcategory: 'Electronic Drums',
    brand: 'ElectroBeat',
    model: 'EB-Beginner',
    image: '/images/DrumsPercussion_ElectricDrums4.png',
    galleryImages: [
      '/images/DrumsPercussion_ElectricDrums4.1.png',
      '/images/DrumsPercussion_ElectricDrums4.2.png'
    ],
    specifications: {
      pads: '4 velocity-sensitive pads',
      sounds: '100+ drum sounds',
      connectivity: 'Audio out, Headphones',
      display: 'Basic LED'
    },
    features: [
      'Beginner friendly',
      '100+ sounds',
      'Headphone practice',
      'Affordable price',
      'Simple controls'
    ],
    inStock: true,
    stockQuantity: 25,
    sku: 'DP020',
    weight: '12kg',
    dimensions: '80x60x50cm',
    warranty: '1 year',
    rating: 4.3,
    reviews: []
  },
  // Steel Drums Collection
  {
    name: 'Caribbean Steel Drum',
    description: 'Authentic Caribbean steel drum with rich, melodic tones perfect for tropical music.',
    price: 349.99,
    originalPrice: 449.99,
    discount: 22,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'CaribbeanSound',
    model: 'CS-Steel-1',
    image: '/images/DrumsPercussion_SteelDrums1.png',
    galleryImages: [
      '/images/DrumsPercussion_SteelDrums1.1.png',
      '/images/DrumsPercussion_SteelDrums1.2.png'
    ],
    specifications: {
      material: 'High-grade steel',
      notes: '8-note scale',
      finish: 'Chrome plated',
      stand: 'Adjustable included'
    },
    features: [
      'Authentic Caribbean sound',
      '8-note melodic scale',
      'Chrome finish',
      'Adjustable stand',
      'Mallets included'
    ],
    inStock: true,
    stockQuantity: 14,
    sku: 'DP021',
    weight: '8kg',
    dimensions: '60x60x90cm',
    warranty: '2 years',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Professional Steel Pan',
    description: 'Professional-grade steel pan with extended range and superior craftsmanship.',
    price: 599.99,
    originalPrice: 799.99,
    discount: 25,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'CaribbeanSound',
    model: 'CS-Steel-2',
    image: '/images/DrumsPercussion_SteelDrums2.png',
    galleryImages: [
      '/images/DrumsPercussion_SteelDrums2.1.png',
      '/images/DrumsPercussion_SteelDrums2.2.png'
    ],
    specifications: {
      material: 'Premium steel',
      notes: '12-note chromatic',
      finish: 'Polished steel',
      stand: 'Professional grade'
    },
    features: [
      'Professional quality',
      '12-note chromatic range',
      'Superior craftsmanship',
      'Professional stand',
      'Concert-grade sound'
    ],
    inStock: true,
    stockQuantity: 8,
    sku: 'DP022',
    weight: '12kg',
    dimensions: '70x70x95cm',
    warranty: '3 years',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Decorative Steel Drum',
    description: 'Beautifully decorated steel drum with artistic patterns and vibrant colors.',
    price: 429.99,
    originalPrice: 549.99,
    discount: 22,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'CaribbeanSound',
    model: 'CS-Steel-3',
    image: '/images/DrumsPercussion_SteelDrums3.png',
    galleryImages: [
      '/images/DrumsPercussion_SteelDrums3.1.png',
      '/images/DrumsPercussion_SteelDrums3.2.png'
    ],
    specifications: {
      material: 'Decorated steel',
      notes: '8-note scale',
      finish: 'Artistic paint',
      stand: 'Decorative included'
    },
    features: [
      'Artistic decorations',
      'Vibrant colors',
      'Cultural patterns',
      'Display quality',
      'Authentic sound'
    ],
    inStock: true,
    stockQuantity: 12,
    sku: 'DP023',
    weight: '9kg',
    dimensions: '60x60x90cm',
    warranty: '2 years',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Mini Steel Drum',
    description: 'Compact steel drum perfect for beginners and educational purposes.',
    price: 199.99,
    originalPrice: 259.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'World Percussion',
    brand: 'CaribbeanSound',
    model: 'CS-Steel-4',
    image: '/images/DrumsPercussion_SteelDrums4.png',
    galleryImages: [
      '/images/DrumsPercussion_SteelDrums4.1.png',
      '/images/DrumsPercussion_SteelDrums4.2.png'
    ],
    specifications: {
      material: 'Steel',
      notes: '6-note scale',
      finish: 'Basic chrome',
      stand: 'Compact included'
    },
    features: [
      'Compact size',
      'Beginner friendly',
      'Educational value',
      'Affordable price',
      'Easy to play'
    ],
    inStock: true,
    stockQuantity: 20,
    sku: 'DP024',
    weight: '5kg',
    dimensions: '45x45x75cm',
    warranty: '1 year',
    rating: 4.4,
    reviews: []
  },
  // Tabla Collection
  {
    name: 'Traditional Tabla Set',
    description: 'Authentic Indian tabla pair with premium quality wood and goatskin heads. Hand-crafted by master artisans.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: 'drums-percussion',
    subcategory: 'Traditional Percussion',
    brand: 'IndianClassic',
    model: 'IC-Tabla-1',
    image: '/images/DrumsPercussion_Tabla1.png',
    galleryImages: [
      '/images/DrumsPercussion_Tabla1.1.png',
      '/images/DrumsPercussion_Tabla1.2.png'
    ],
    specifications: {
      material: 'Sheesham wood',
      heads: 'Premium goatskin',
      size: 'Standard professional',
      tuning: 'Traditional rope system'
    },
    features: [
      'Hand-crafted construction',
      'Premium goatskin heads',
      'Traditional rope tuning',
      'Authentic sound',
      'Includes carrying case'
    ],
    inStock: true,
    stockQuantity: 20,
    sku: 'DP025',
    weight: '3kg',
    dimensions: '30x30x20cm',
    warranty: '1 year',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Professional Tabla Pro',
    description: 'Concert-grade tabla set with superior sound quality and premium materials.',
    price: 499.99,
    originalPrice: 649.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'Traditional Percussion',
    brand: 'IndianClassic',
    model: 'IC-Tabla-2',
    image: '/images/DrumsPercussion_Tabla2.png',
    galleryImages: [
      '/images/DrumsPercussion_Tabla2.1.png',
      '/images/DrumsPercussion_Tabla2.2.png'
    ],
    specifications: {
      material: 'Premium sheesham wood',
      heads: 'Concert-grade goatskin',
      size: 'Professional standard',
      tuning: 'Fine-tuning system'
    },
    features: [
      'Concert-grade quality',
      'Premium materials',
      'Superior sound clarity',
      'Professional tuning',
      'Luxury carrying case'
    ],
    inStock: true,
    stockQuantity: 12,
    sku: 'DP026',
    weight: '3.5kg',
    dimensions: '32x32x22cm',
    warranty: '2 years',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Decorative Tabla Deluxe',
    description: 'Beautifully decorated tabla set with brass fittings and artistic engravings.',
    price: 399.99,
    originalPrice: 519.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'Traditional Percussion',
    brand: 'IndianClassic',
    model: 'IC-Tabla-3',
    image: '/images/DrumsPercussion_Tabla3.png',
    galleryImages: [
      '/images/DrumsPercussion_Tabla3.1.png',
      '/images/DrumsPercussion_Tabla3.2.png'
    ],
    specifications: {
      material: 'Decorated sheesham wood',
      heads: 'Premium goatskin',
      size: 'Standard professional',
      tuning: 'Traditional system'
    },
    features: [
      'Artistic decorations',
      'Brass fittings',
      'Beautiful engravings',
      'Traditional sound',
      'Display worthy'
    ],
    inStock: true,
    stockQuantity: 15,
    sku: 'DP027',
    weight: '3.2kg',
    dimensions: '30x30x20cm',
    warranty: '1 year',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Student Tabla Basic',
    description: 'Entry-level tabla set perfect for students and beginners learning Indian classical music.',
    price: 199.99,
    originalPrice: 259.99,
    discount: 23,
    category: 'drums-percussion',
    subcategory: 'Traditional Percussion',
    brand: 'IndianClassic',
    model: 'IC-Tabla-4',
    image: '/images/DrumsPercussion_Tabla4.png',
    galleryImages: [
      '/images/DrumsPercussion_Tabla4.1.png',
      '/images/DrumsPercussion_Tabla4.2.png'
    ],
    specifications: {
      material: 'Mango wood',
      heads: 'Synthetic',
      size: 'Student size',
      tuning: 'Basic system'
    },
    features: [
      'Student friendly',
      'Affordable price',
      'Good sound quality',
      'Durable construction',
      'Easy maintenance'
    ],
    inStock: true,
    stockQuantity: 30,
    sku: 'DP028',
    weight: '2.5kg',
    dimensions: '28x28x18cm',
    warranty: '1 year',
    rating: 4.4,
    reviews: []
  }
];

const seedDrumsPercussion = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove existing drums-percussion products
    await Product.deleteMany({ category: 'drums-percussion' });
    console.log('Removed existing drums-percussion products');

    // Insert new drums-percussion products
    const insertedProducts = await Product.insertMany(drumsPercussionProducts);
    console.log(`Successfully seeded ${insertedProducts.length} drums-percussion products`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding drums-percussion products:', error);
    process.exit(1);
  }
};

seedDrumsPercussion();