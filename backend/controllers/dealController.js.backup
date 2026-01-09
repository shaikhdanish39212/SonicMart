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
    .populate('applicableProducts', 'name price image category averageRating stock isActive')
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
              price: product.price,
              originalPrice: product.price,
              discountedPrice: Math.max(0, discountedPrice),
              discountPercentage: deal.discountValue,
              discountAmount: discountAmount,
              image: product.image,
              averageRating: product.averageRating || 0,
              stock: product.stock,
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

    res.status(200).json({
      success: true,
      count: dealProducts.length,
      data: dealProducts
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
        categoryProducts.forEach(product => {
          // Generate random discount between 15% and 40%
          const discountPercentage = Math.floor(Math.random() * 26) + 15; // 15-40%
          const originalPrice = product.originalPrice || product.price;
          const discountedPrice = originalPrice * (1 - discountPercentage / 100);

          const dealProduct = {
            _id: product._id,
            name: product.name,
            description: product.description,
            price: Math.round(discountedPrice),
            originalPrice: originalPrice,
            discount: discountPercentage,
            category: product.category,
            images: product.images || [],
            image: product.image,
            galleryImages: product.galleryImages || [],
            brand: product.brand,
            model: product.model,
            features: product.features || [],
            stock: product.stock,
            sku: product.sku,
            tags: product.tags || [],
            averageRating: product.averageRating || 0,
            totalReviews: product.totalReviews || 0,
            isActive: product.isActive,
            isFeatured: true, // Mark all deal products as featured
            stockStatus: product.stockStatus,
            type: 'special-deal',
            dealInfo: {
              dealTitle: `${discountPercentage}% OFF - Limited Time!`,
              dealDescription: `Special discount on ${product.name}`,
              originalDiscount: 0,
              dealDiscount: discountPercentage,
              validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
              categoryDeal: true
            }
          };
          
          dealProducts.push(dealProduct);
        });

      } catch (categoryError) {
        console.error(`❌ Error processing category ${category}:`, categoryError.message);
      }
    }

    // If we have fewer than 20 products, add more from popular categories
    if (dealProducts.length < 20) {
      console.log(`🔄 Need more products. Current: ${dealProducts.length}, adding more...`);
      
      const additionalProducts = await Product.find({ 
        category: { $in: ['headphones', 'earbuds', 'speakers', 'microphones'] },
        isActive: true,
        stock: { $gt: 0 },
        _id: { $nin: dealProducts.map(p => p._id) } // Exclude already added products
      })
      .sort({ averageRating: -1, salesCount: -1 })
      .limit(24 - dealProducts.length);

      // Add special discounts to additional products
      additionalProducts.forEach(product => {
        const discountPercentage = Math.floor(Math.random() * 26) + 15; // 15-40%
        const originalPrice = product.originalPrice || product.price;
        const discountedPrice = originalPrice * (1 - discountPercentage / 100);

        const dealProduct = {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: Math.round(discountedPrice),
          originalPrice: originalPrice,
          discount: discountPercentage,
          category: product.category,
          images: product.images || [],
          image: product.image,
          galleryImages: product.galleryImages || [],
          brand: product.brand,
          model: product.model,
          features: product.features || [],
          stock: product.stock,
          sku: product.sku,
          tags: product.tags || [],
          averageRating: product.averageRating || 0,
          totalReviews: product.totalReviews || 0,
          isActive: product.isActive,
          isFeatured: true,
          stockStatus: product.stockStatus,
          type: 'special-deal',
          dealInfo: {
            dealTitle: `${discountPercentage}% OFF - Limited Time!`,
            dealDescription: `Special discount on ${product.name}`,
            originalDiscount: 0,
            dealDiscount: discountPercentage,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            categoryDeal: true
          }
        };
        
        dealProducts.push(dealProduct);
      });
    }

    // Shuffle the products to mix categories
    const shuffledDeals = dealProducts.sort(() => Math.random() - 0.5);

    // Limit to maximum 24 products
    const finalDeals = shuffledDeals.slice(0, 24);

    console.log(`🎉 Created ${finalDeals.length} special deals from ${categories.length} categories`);

    // Group products by category for summary
    const categorySummary = {};
    finalDeals.forEach(product => {
      if (!categorySummary[product.category]) {
        categorySummary[product.category] = 0;
      }
      categorySummary[product.category]++;
    });

    res.json({
      success: true,
      message: `Generated ${finalDeals.length} special deals from all categories`,
      data: finalDeals,
      products: finalDeals, // For compatibility
      meta: {
        totalDeals: finalDeals.length,
        categoriesIncluded: Object.keys(categorySummary).length,
        categorySummary: categorySummary,
        averageDiscount: Math.round(finalDeals.reduce((sum, p) => sum + p.discount, 0) / finalDeals.length),
        dealType: 'special-category-deals',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
  } catch (error) {
    console.error('❌ Error generating deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating special deals',
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
        price: 0,
        discountedPrice: 0,
        discount: adminDeal.discountValue,
        category: adminDeal.category || 'general',
        images: ['/images/deal-banner.jpg'],
        brand: 'SonicMart',
        type: 'admin-deal',
        validFrom: adminDeal.validFrom,
        validUntil: adminDeal.validUntil,
        dealId: adminDeal._id,
        applicableProducts: adminDeal.applicableProducts
      };
      
      return res.json({
        success: true,
        data: formattedDeal,
      });
    }

    // If not found as admin deal, try as product
    const product = await Product.findById(dealId);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Deal not found' 
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching deal by ID:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error' 
    });
  }
};

module.exports = { getDeals, getDealById };