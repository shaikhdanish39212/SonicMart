const Product = require('../models/Product');
const Deal = require('../models/Deal');

// @desc    Get all deals (fetch actual deals from database)
// @route   GET /api/deals
// @access  Public
const getDeals = async (req, res) => {
  try {
    console.log('🎯 Fetching actual deals from database...');
    
    // Get current date for filtering active deals
    const now = new Date();
    
    // Fetch active deals from database
    const deals = await Deal.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    })
  .populate('applicableProducts', 'name price image category averageRating totalReviews stock isActive brand')
    .sort({ featured: -1, createdAt: -1 });

    console.log(`📋 Found ${deals.length} active deals in database`);

    // Transform deals to include product information with discounts applied
    const dealProducts = [];
    
    for (const deal of deals) {
      if (deal.applicableProducts && deal.applicableProducts.length > 0) {
        // Process each product in this deal
        for (const product of deal.applicableProducts) {
          if (product.isActive && product.stock > 0) {
            // Calculate discounted price
            let discountedPrice = product.price;
            let discountAmount = 0;
            
            if (deal.type === 'percentage') {
              discountAmount = (product.price * deal.discountValue) / 100;
              discountedPrice = product.price - discountAmount;
            } else if (deal.type === 'fixed') {
              discountAmount = Math.min(deal.discountValue, product.price);
              discountedPrice = product.price - discountAmount;
            }
            
            // Create deal product object
            const dealProduct = {
              _id: product._id,
              name: product.name,
              category: product.category,
              price: Math.round(discountedPrice),
              originalPrice: product.price,
              discountedPrice: Math.max(0, Math.round(discountedPrice)),
              discountPercentage: deal.type === 'percentage' ? deal.discountValue : Math.round((discountAmount / product.price) * 100),
              discountAmount: Math.round(discountAmount),
              discount: deal.type === 'percentage' ? deal.discountValue : Math.round((discountAmount / product.price) * 100),
              image: product.image,
              averageRating: product.averageRating || 0,
              rating: product.averageRating || 0,
              totalReviews: typeof product.totalReviews === 'number' ? product.totalReviews : (Array.isArray(product.reviews) ? product.reviews.length : 0),
              reviewCount: typeof product.totalReviews === 'number' ? product.totalReviews : (Array.isArray(product.reviews) ? product.reviews.length : 0),
              brand: product.brand,
              stock: product.stock,
              isActive: product.isActive,
              isFeatured: deal.featured || false,
              type: 'admin-deal',
              dealInfo: {
                dealId: deal._id,
                dealTitle: deal.title,
                dealDescription: deal.description,
                dealType: deal.type,
                validUntil: deal.validUntil,
                featured: deal.featured
              }
            };
            
            dealProducts.push(dealProduct);
          }
        }
      }
    }

    console.log(`✅ Processed ${dealProducts.length} products with active deals`);

    // If no deals found, return empty array with success
    if (dealProducts.length === 0) {
      console.log('ℹ️ No active deals found, returning empty array');
      return res.status(200).json({
        success: true,
        message: 'No active deals found',
        count: 0,
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: dealProducts.length,
      data: dealProducts,
      meta: {
        totalDeals: dealProducts.length,
        dealType: 'admin-deals',
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error fetching deals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching deals',
      error: error.message
    });
  }
};

// @desc    Get deal by ID (handles both admin deals and products)
// @route   GET /api/deals/:id
// @access  Public
const getDealById = async (req, res) => {
  try {
    const dealId = req.params.id;
    
    // First try to find it as an admin deal
    const adminDeal = await Deal.findById(dealId).populate('applicableProducts');
    
    if (adminDeal) {
      // Format admin deal for frontend
      const formattedDeal = {
        _id: adminDeal._id,
        name: adminDeal.title,
        description: adminDeal.description,
        type: adminDeal.type,
        discountValue: adminDeal.discountValue,
        category: adminDeal.category,
        validFrom: adminDeal.validFrom,
        validUntil: adminDeal.validUntil,
        isActive: adminDeal.isActive,
        featured: adminDeal.featured,
        applicableProducts: adminDeal.applicableProducts
      };
      
      return res.json({
        success: true,
        data: formattedDeal
      });
    }
    
    // If not found as admin deal, try to find as product
    const product = await Product.findById(dealId);
    
    if (product) {
      return res.json({
        success: true,
        data: product
      });
    }
    
    // Not found
    res.status(404).json({
      success: false,
      message: 'Deal not found'
    });
    
  } catch (error) {
    console.error('❌ Error fetching deal by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching deal',
      error: error.message
    });
  }
};

module.exports = { getDeals, getDealById };