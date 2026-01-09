const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const InternalComponentReview = require('../models/InternalComponentReview');
const { protect, admin, optionalAuth } = require('../middleware/auth');

// Product routes with update functionality (reloaded)
const router = express.Router();

// Helper function to generate internal components data
const generateInternalComponents = () => {
  const internalComponentImages = [
    // DJ Speaker Components
    'DJSpeaker_Woofer1.png', 'DJSpeaker_HornTweeters2.png', 'DJSpeaker_ProfessionalCrossovers3.png',
    'DJSpeaker_ReinforcedCones4.png', 'DJSpeaker_CoolingSystem5.png', 'DJSpeaker_ProtectiveGrilles6.png',
    'DJSpeaker_PortSystems7.png', 'DJSpeaker_MountingHardware8.png',
    
    // Drums & Percussion Components
    'DrumsPercussion_DrumHeads1.png', 'DrumsPercussion_DrumStickTips2.png', 'DrumsPercussion_DrumShell3.png',
    'DrumsPercussion_TensionRods4.png', 'DrumsPercussion_DrumLugs5.png', 'DrumsPercussion_SnareWires6.png',
    'DrumsPercussion_DrumHoops7.png', 'DrumsPercussion_HihatClutch8.png',
    
    // EarBuds Components
    'EarBuds_Driver6mm_12mm1.png', 'EarBuds_SiliconeEarTipsSet2.png', 'EarBuds_Li-on_Batteries3.png',
    'EarBuds_Bluetooth_5.0_Module4.png', 'EarBuds_Memory_Foam_Tips5.png', 'EarBuds_Charging_Case6.png',
    'Earbud_WirelessChargingCoil7.png', 'Earbud_Cables8.png',
    
    // Earphones Components
    'Earphones_In_ear_Drivers1.png', 'Earphones_Audio Cables_3.5mm2.png', 'Earphones_Y_splitter_Connectors3.png',
    'Earphones_3.5mm_Connectors4.png', 'Earphones_StrainReliefBoots5.png', 'Earphones_CableShielding6.png',
    'Earphones_WireConductors7.png', 'Earphones_CableJackets8.png',
    
    // Guitars & Basses Components
    'GuitarsBasses_HumbuckerPickups1.png', 'GuitarsBasses_SingleCoilPickups2.png', 'GuitarsBasses_GuitarStrings3.png',
    'GuitarsBassesBassStrings4.png', 'GuitarsBasses_Potentiometers5.png', 'GuitarsBasses_Capacitors6.png',
    'GuitarsBasses_GuitarJacks7.png', 'GuitarsBasses_PickupRings8.png',
    
    // HeadPhones Components
    'HeadPhonesDriver1.png', 'HeadPhonesNeodymiumMagnet2.png', 'HeadPhonesVoiceCoil3.png',
    'HeadPhonesDiaphragm4.png', 'HeadPhones_HeadbandPaddingFoam5.png', 'HeadPhonesCables6.png',
    'HeadPhones_EarCupCushion7.png', 'HeadPhones_3.5mm_6.35mmConnectors8.png',
    
    // Speakers Components
    'Speakers_Woofers1.png', 'Speakers_Tweeters2.png', 'Speakers_Driver3.png',
    'Speakers_CrossoverNetworks4.png', 'Speakers_VoiceCoils5.png', 'Speakers_MagnetFerrite6.png',
    'Speakers_Cones7.png', 'Speakers_DustCaps8.png'
  ];

  const parseComponentName = (imageName) => {
    const baseName = imageName.replace('.png', '');
    const parts = baseName.split('_');
    
    const categoryMap = {
      'DJSpeaker': 'DJ Speaker Components',
      'DrumsPercussion': 'Drums & Percussion Components',
      'EarBuds': 'EarBuds Components',
      'Earbud': 'EarBuds Components',
      'Earphones': 'Earphones Components',
      'GuitarsBasses': 'Guitars & Basses Components',
      'HeadPhones': 'HeadPhones Components',
      'Speakers': 'Speakers Components'
    };

    const category = categoryMap[parts[0]] || 'Audio Components';
    
    let componentName = parts.slice(1).join(' ')
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\d+$/, '')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
    
    if (componentName === '') {
      const lastPart = baseName.split(/(?=[A-Z])/).pop();
      componentName = lastPart.replace(/\d+$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
    }
    
    let type = 'Specialized Components';
    if (componentName.includes('Driver') || componentName.includes('Woofer')) {
      type = 'Audio Drivers';
    } else if (componentName.includes('Pickup')) {
      type = 'Pickup Systems';
    } else if (componentName.includes('String')) {
      type = 'String Components';
    } else if (componentName.includes('Battery') || componentName.includes('Charging')) {
      type = 'Power Components';
    } else if (componentName.includes('Cable') || componentName.includes('Connector') || componentName.includes('Jack')) {
      type = 'Wiring & Connections';
    } else if (componentName.includes('Bluetooth') || componentName.includes('Module')) {
      type = 'Electronic Modules';
    } else if (componentName.includes('Magnet') || componentName.includes('Coil')) {
      type = 'Magnetic Systems';
    } else if (componentName.includes('Crossover') || componentName.includes('Network')) {
      type = 'Signal Processing';
    } else if (componentName.includes('Mount') || componentName.includes('Hardware') || componentName.includes('Lug') || componentName.includes('Rod')) {
      type = 'Mounting & Hardware';
    } else if (componentName.includes('Tips') || componentName.includes('Foam') || componentName.includes('Cushion') || componentName.includes('Case')) {
      type = 'Comfort & Acoustic';
    } else if (componentName.includes('Tweeter') || componentName.includes('Horn')) {
      type = 'High-Frequency Drivers';
    } else if (componentName.includes('Shell') || componentName.includes('Head') || componentName.includes('Cone')) {
      type = 'Structural Components';
    } else if (componentName.includes('Wire') || componentName.includes('Clutch') || componentName.includes('Hoop')) {
      type = 'Mechanical Components';
    } else if (componentName.includes('Capacitor') || componentName.includes('Potentiometer')) {
      type = 'Electronic Controls';
    } else if (componentName.includes('Grille') || componentName.includes('Dust') || componentName.includes('Port')) {
      type = 'Protection & Ventilation';
    } else if (componentName.includes('Cooling') || componentName.includes('System')) {
      type = 'Thermal Management';
    }
    
    const features = [];
    if (componentName.includes('Professional')) features.push('Professional Grade');
    if (componentName.includes('5.0')) features.push('Bluetooth 5.0');
    if (componentName.includes('6mm') || componentName.includes('12mm')) features.push('Precision Sized');
    if (componentName.includes('Memory Foam')) features.push('Memory Foam Technology');
    if (componentName.includes('Silicone')) features.push('Silicone Material');
    if (componentName.includes('Neodymium')) features.push('Neodymium Magnet');
    if (componentName.includes('Li-on')) features.push('Lithium Ion');
    if (componentName.includes('Wireless')) features.push('Wireless Technology');
    if (componentName.includes('3.5mm') || componentName.includes('6.35mm')) features.push('Standard Connector');
    if (componentName.includes('Reinforced')) features.push('Reinforced Construction');
    if (componentName.includes('Protective')) features.push('Protective Design');
    if (componentName.includes('Horn')) features.push('Horn-Loaded Design');
    if (componentName.includes('Ferrite')) features.push('Ferrite Core');
    
    if (features.length === 0) {
      features.push('High Quality', 'Professional Use', 'Durable Construction');
    }
    
    return {
      name: componentName,
      category: category,
      type: type,
      features: features
    };
  };

  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return internalComponentImages.map((imageName, index) => {
    const componentInfo = parseComponentName(imageName);
    const baseImageName = imageName.replace('.png', '');
    const galleryImages = [
      `/images/internal_components/images/${imageName}`,
      `/images/internal_components/images/${baseImageName}.1.png`,
      `/images/internal_components/images/${baseImageName}.2.png`,
      `/images/internal_components/images/${baseImageName}.3.png`
    ];
    
    const basePrice = Math.floor(seededRandom(index + 1) * 200) + 50;
    const discountPercent = Math.floor(seededRandom(index + 2) * 25) + 5;
    const originalPrice = Math.floor(basePrice * 1.3);
    const discountedPrice = Math.floor(originalPrice * (1 - discountPercent / 100));
    
    return {
      _id: `internal_component_${index + 1}`,
      name: componentInfo.name,
      description: `High-quality ${componentInfo.name.toLowerCase()} component for professional audio equipment. Perfect for repairs, upgrades, and custom builds.`,
      image: `/images/internal_components/images/${imageName}`,
      images: galleryImages,
      galleryImages: galleryImages,
      price: discountedPrice,
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      discount: discountPercent,
      category: 'internal-components',
      subcategory: componentInfo.category.toLowerCase().replace(/\s+/g, '-'),
      brand: 'SonicMart Components',
      stock: Math.floor(seededRandom(index + 3) * 50) + 10,
      inStock: true,
      isActive: true,
      rating: parseFloat((seededRandom(index + 4) * 1.5 + 3.5).toFixed(1)),
      averageRating: parseFloat((seededRandom(index + 4) * 1.5 + 3.5).toFixed(1)),
      totalReviews: Math.floor(seededRandom(index + 5) * 150) + 50,
      featured: seededRandom(index + 6) > 0.7,
      tags: ['component', 'internal', componentInfo.type.toLowerCase(), 'replacement'],
      specifications: {
        'Component Type': componentInfo.type,
        'Category': componentInfo.category,
        'Brand': 'SonicMart Components',
        'Application': componentInfo.features.join(', ')
      },
      features: componentInfo.features,
      createdAt: new Date(2024, 0, 1 + index), // Distribute dates
      salesCount: Math.floor(seededRandom(index + 7) * 500)
    };
  });
};

// @desc    Get all products with filtering and sorting
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  query('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit must be between 1 and 500'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive number')
], optionalAuth, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Build filter object
    let filter = { isActive: true };

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    // Subcategory filter
    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory;
    }

    // Brand filter
    if (req.query.brand) {
      filter.brand = new RegExp(req.query.brand, 'i');
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Rating filter
    if (req.query.rating) {
      filter.averageRating = { $gte: parseFloat(req.query.rating) };
    }

    // Stock filter
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Featured filter
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    // On Sale filter (products with discount > 0)
    if (req.query.onSale === 'true') {
      filter.discount = { $gt: 0 };
    }

    // Search filter
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'rating':
        sort.averageRating = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'popular':
        sort.salesCount = -1;
        break;
      case 'name':
        sort.name = 1;
        break;
      default:
        sort.createdAt = -1;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 300; // Default to 300 products per page to show all
    const skip = (page - 1) * limit;

    // Execute query for regular products 
    // Include internal components in all product listings
    // Only exclude them from featured/deals queries
    const shouldExcludeInternalComponents = req.query.featured || req.query.deal || filter.isFeatured;
    
    let allProducts = [];
    let totalCombinedCount = 0;
    
    if (shouldExcludeInternalComponents) {
      // For featured/deals queries, exclude internal components
      const productFilter = { ...filter, category: { $ne: 'internal-components' } };
      const [products, totalCount] = await Promise.all([
        Product.find(productFilter).sort(sort).select('-reviews'),
        Product.countDocuments(productFilter)
      ]);
      allProducts = [...products];
      totalCombinedCount = totalCount;
    } else {
      // For regular product listings, prioritize internal components first
      const [internalComponents, regularProducts] = await Promise.all([
        Product.find({ ...filter, category: 'internal-components' }).sort(sort).select('-reviews'),
        Product.find({ ...filter, category: { $ne: 'internal-components' } }).sort(sort).select('-reviews')
      ]);
      
      // Combine with internal components first, then regular products
      allProducts = [...internalComponents, ...regularProducts];
      totalCombinedCount = internalComponents.length + regularProducts.length;
    }
    
    // Apply pagination to the final results
    const paginatedProducts = allProducts.slice(skip, skip + limit);

    // Get categories and brands for filters
    const dbCategories = await Product.distinct('category', { isActive: true });
    // Add internal-components to categories since they're dynamically generated
    const categories = [...dbCategories];
    if (!categories.includes('internal-components')) {
      categories.push('internal-components');
    }
    const dbBrands = await Product.distinct('brand', { isActive: true });
    const brands = dbBrands;

    res.json({
      status: 'success',
      data: {
        products: paginatedProducts,
        filters: {
          categories,
          brands
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCombinedCount / limit),
          totalProducts: totalCombinedCount,
          productsPerPage: limit,
          hasNextPage: page * limit < totalCombinedCount,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching products'
    });
  }
});

// @desc    Get all product categories
// @route   GET /api/products/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    // Canonical list of categories to always expose in the UI
    const canonicalCategories = [
      'headphones',
      'earbuds',
      'earphones',
      'speakers',
      'microphones',
      'neckband-earphones',
      'dj-speakers',
      'loud-speakers',
      'home-theater',
      'guitars-basses',
      'keyboards-pianos',
      'drums-percussion',
      'studio-equipment',
      'internal-components'
    ];

    // Categories that currently exist in the database (active products)
    const dbCategories = await Product.distinct('category', { isActive: true });

    // Only use canonical categories (exclude internal component categories)
    const allCategories = canonicalCategories;

    // Compute product counts per category (only for canonical categories)
    const counts = await Product.aggregate([
      { $match: { isActive: true, category: { $in: canonicalCategories } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const countMap = counts.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});

    // Create category objects with proper formatting and counts
    const formattedCategories = allCategories.map(category => ({
      id: category,
      name: category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      productCount: countMap[category] || 0
    }));

    res.json({
      status: 'success',
      data: {
        categories: formattedCategories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching categories'
    });
  }
});

// @desc    Get internal component categories
// @route   GET /api/products/internal-categories
// @access  Public
router.get('/internal-categories', async (req, res) => {
  try {
    // Internal component categories that were previously filtered out
    const internalCategories = [
      'acoustic-elements',
      'audio-amplifiers',
      'audio-circuits',
      'connectors-cables',
      'control-interfaces',
      'mechanical-parts',
      'speaker-drivers'
    ];

    // Get all categories that exist in the database
    const dbCategories = await Product.distinct('category', { isActive: true });
    
    // Filter to only include internal categories that exist in the database
    const existingInternalCategories = internalCategories.filter(cat => dbCategories.includes(cat));

    // Compute product counts per internal category
    const counts = await Product.aggregate([
      { $match: { isActive: true, category: { $in: existingInternalCategories } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const countMap = counts.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});

    // Create category objects with proper formatting and counts
    const formattedCategories = existingInternalCategories.map(category => ({
      id: category,
      name: category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      productCount: countMap[category] || 0
    }));

    res.json({
      status: 'success',
      data: {
        categories: formattedCategories,
        totalProducts: Object.values(countMap).reduce((sum, count) => sum + count, 0)
      }
    });
  } catch (error) {
    console.error('Get internal categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching internal categories'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.findFeatured()
      .limit(limit)
      .select('-reviews')
      .sort({ salesCount: -1 });

    res.json({
      status: 'success',
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching featured products'
    });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/slug/:slug
// @access  Public
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    // Convert slug back to searchable name (replace hyphens with spaces)
    const searchName = slug.replace(/-/g, ' ');
    
    // Function to generate slug from name for comparison
    const generateSlug = (name) => {
      return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens
    };

    // Find products and check if any match the slug
    const products = await Product.find({ isActive: true }).populate('category');
    
    let product = null;
    for (const prod of products) {
      if (generateSlug(prod.name) === slug) {
        product = prod;
        break;
      }
    }

    // If no exact match, try fuzzy search
    if (!product) {
      product = await Product.findOne({
        name: { $regex: new RegExp(searchName.replace(/[-\s]/g, '[-\\s]'), 'i') },
        isActive: true
      }).populate('category');
    }

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Get related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4).select('name price images category brand rating numReviews');

    // Get user's wishlist if authenticated
    let isInWishlist = false;
    if (req.user) {
      const user = await User.findById(req.user.id);
      isInWishlist = user.wishlist.some(item => item.toString() === product._id.toString());
    }

    res.json({
      status: 'success',
      data: {
        product: {
          ...product.toObject(),
          isInWishlist
        },
        relatedProducts
      }
    });

  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching product'
    });
  }
});

// @desc    Test endpoint to check generated internal components
// @route   GET /api/products/test-internal-components  
// @access  Public
router.get('/test-internal-components', (req, res) => {
  try {
    const internalComponents = generateInternalComponents();
    res.json(internalComponents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    // Check if this is an internal component ID
    if (req.params.id.startsWith('internal_component_')) {
      const internalComponents = generateInternalComponents();
      const componentIndex = parseInt(req.params.id.split('_')[2]) - 1;
      
      if (componentIndex >= 0 && componentIndex < internalComponents.length) {
        const component = internalComponents[componentIndex];
        
        // Get reviews for this internal component
        const componentReviews = await InternalComponentReview.find({
          componentId: req.params.id
        }).populate('user', 'name avatar').sort({ createdAt: -1 });

        // Calculate review statistics
        let reviewStats = {
          averageRating: 0,
          totalReviews: 0,
          starBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };

        if (componentReviews.length > 0) {
          const totalRating = componentReviews.reduce((sum, review) => sum + review.rating, 0);
          reviewStats.averageRating = Math.round((totalRating / componentReviews.length) * 10) / 10;
          reviewStats.totalReviews = componentReviews.length;
          
          // Calculate star breakdown
          componentReviews.forEach(review => {
            reviewStats.starBreakdown[review.rating]++;
          });
        }

        // Add review data to component
        component.reviews = componentReviews;
        component.averageRating = reviewStats.averageRating;
        component.totalReviews = reviewStats.totalReviews;
        component.reviewStats = reviewStats;
        
        // Get related internal components (same category)
        const relatedComponents = internalComponents
          .filter(comp => comp.category === component.category && comp._id !== component._id)
          .slice(0, 4);
        
        return res.json({
          status: 'success',
          data: {
            product: component,
            relatedProducts: relatedComponents
          }
        });
      } else {
        return res.status(404).json({
          status: 'error',
          message: 'Internal component not found'
        });
      }
    }

    // Validate ObjectId format for regular products
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!product || !product.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Increment view count safely without full validation
    try {
      await Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } });
      product.viewCount = (product.viewCount || 0) + 1;
    } catch (saveError) {
      console.error('Error updating view count:', saveError);
      // Continue without failing the entire request
    }

    // Get related products (same category, different product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
    .limit(4)
    .select('-reviews');

    res.json({
      status: 'success',
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error for ID:', req.params.id);
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching product'
    });
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    // Build filter for category
    const filter = { 
      isActive: true, 
      category: req.params.category 
    };

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'rating':
        sort.averageRating = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'popular':
        sort.salesCount = -1;
        break;
      case 'name':
        sort.name = 1;
        break;
      default:
        sort.createdAt = -1;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 300;
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select('-reviews'),
      Product.countDocuments(filter)
    ]);

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalProducts: totalCount,
          productsPerPage: limit,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching category products'
    });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, [
  body('rating')
    .toInt()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters')
], async (req, res) => {
  console.log('📝 Review submission endpoint hit!');
  console.log('📊 Request details:', {
    productId: req.params.id,
    userId: req.user?._id,
    userName: req.user?.name,
    body: req.body,
    headers: {
      authorization: req.headers.authorization ? 'Bearer [TOKEN]' : 'None',
      contentType: req.headers['content-type']
    },
    timestamp: new Date().toISOString()
  });
  
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, comment } = req.body;
    
    // Check if this is an internal component
    if (req.params.id.startsWith('internal_component_')) {
      console.log('🔧 Handling internal component review:', req.params.id);
      
      try {
        // Check if user already reviewed this internal component
        const existingReview = await InternalComponentReview.findOne({
          componentId: req.params.id,
          user: req.user._id
        });

        if (existingReview) {
          return res.status(400).json({
            status: 'error',
            message: 'You have already reviewed this component'
          });
        }

        // Create new internal component review
        const review = new InternalComponentReview({
          componentId: req.params.id,
          user: req.user._id,
          name: req.user.name,
          rating: parseInt(rating),
          comment: comment.trim()
        });

        await review.save();
        console.log('✅ Internal component review saved to database:', review);

        return res.status(201).json({
          status: 'success',
          message: 'Review added successfully for internal component',
          data: {
            review,
            isInternalComponent: true
          }
        });
      } catch (error) {
        console.error('💥 Internal component review error:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to add review for internal component'
        });
      }
    }
    
  const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this product'
      });
    }

    // Prepare review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: parseInt(rating),
      comment: comment.trim()
    };

    // Compute new stats without saving the full document
    const currentAvg = Number(product.averageRating || 0);
    const currentTotal = Number(product.totalReviews || 0);
    const newTotal = currentTotal + 1;
    const newAvgRaw = ((currentAvg * currentTotal) + review.rating) / newTotal;
    const newAvg = Math.round(newAvgRaw * 10) / 10;

    // Atomic update: push review and set stats
    await Product.updateOne(
      { _id: product._id },
      {
        $push: { reviews: review },
        $set: { averageRating: newAvg, totalReviews: newTotal }
      }
    );

    res.status(201).json({
      status: 'success',
      message: 'Review added successfully',
      data: {
        review,
        updatedStats: { averageRating: newAvg, totalReviews: newTotal },
        productId: product._id
      }
    });
  } catch (error) {
    console.error('💥 Add review error:', error);
    console.error('📊 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      productId: req.params.id,
      userId: req.user?._id,
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid review data',
        details: error.message
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding review',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['headphones', 'earbuds', 'speakers', 'microphones', 'accessories', 'cables', 'amplifiers', 'mixers', 'dj-speakers', 'home-theater', 'loud-speakers', 'neckband-earphones', 'earphones'])
    .withMessage('Please select a valid category'),
  body('brand')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Brand must be between 1 and 50 characters'),
  body('image')
    .notEmpty()
    .withMessage('Main product image is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('sku')
    .trim()
    .isLength({ min: 1 })
    .withMessage('SKU is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'SKU already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating product'
    });
  }
});

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isIn(['headphones', 'earbuds', 'speakers', 'microphones', 'accessories', 'cables', 'amplifiers', 'mixers', 'dj-speakers', 'home-theater', 'loud-speakers', 'neckband-earphones', 'earphones'])
    .withMessage('Please select a valid category'),
  body('brand')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Brand must be between 1 and 50 characters'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('sku')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('SKU is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Update only the fields that are provided
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    await product.save();

    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'SKU already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating product'
    });
  }
});

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting product'
    });
  }
});

module.exports = router;
