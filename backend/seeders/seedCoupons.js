const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
require('dotenv').config();

const seedCoupons = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sounds-accessories';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri.replace(/:([^:@]+)@/, ':****@'));

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    // Test coupons with valid future dates
    const testCoupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome discount - 10% off',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 100,
        maxDiscountAmount: 500,
        usageLimit: 100,
        validUntil: new Date('2027-12-31'),
        isActive: true
      },
      {
        code: 'SAVE50',
        description: 'Save ₹50 on orders above ₹300',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 300,
        maxDiscountAmount: 50,
        usageLimit: 50,
        validUntil: new Date('2027-12-31'),
        isActive: true
      },
      {
        code: 'NEWUSER',
        description: 'New user special - 15% off',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 200,
        maxDiscountAmount: 300,
        usageLimit: 25,
        validUntil: new Date('2027-12-31'),
        isActive: true
      }
    ];

    const createdCoupons = await Coupon.insertMany(testCoupons);
    console.log(`✅ Created ${createdCoupons.length} test coupons:`);
    createdCoupons.forEach(coupon => {
      console.log(`   - ${coupon.code}: ${coupon.description}`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedCoupons();
}

module.exports = seedCoupons;