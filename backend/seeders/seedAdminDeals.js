const mongoose = require('mongoose');
const Product = require('../models/Product');
const Deal = require('../models/Deal');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sounds-accessories');
        console.log('MongoDB connected for seeding admin deals');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

const seedAdminDeals = async () => {
    try {
        await connectDB();

        // Clear existing deals
        await Deal.deleteMany({});
        console.log('Cleared existing deals');

        // Get some products from each category to attach to deals
        const headphones = await Product.find({ category: 'headphones', isActive: true }).limit(3);
        const earbuds = await Product.find({ category: 'earbuds', isActive: true }).limit(3);
        const speakers = await Product.find({ category: 'speakers', isActive: true }).limit(3);
        const microphones = await Product.find({ category: 'microphones', isActive: true }).limit(3);

        console.log(`Found: ${headphones.length} headphones, ${earbuds.length} earbuds, ${speakers.length} speakers, ${microphones.length} microphones`);

        const allProductIds = [
            ...headphones.map(p => p._id),
            ...earbuds.map(p => p._id),
            ...speakers.map(p => p._id),
            ...microphones.map(p => p._id)
        ];

        if (allProductIds.length === 0) {
            console.log('❌ No products found in database. Please seed products first.');
            process.exit(1);
        }

        // Create deal with future dates to pass validation
        const now = new Date();
        const validFrom = new Date(now);
        validFrom.setHours(0, 0, 0, 0);

        const validUntil = new Date(validFrom);
        validUntil.setDate(validUntil.getDate() + 30); // 30 days from now

        const deals = [
            {
                title: 'Mega Audio Sale - Premium Headphones',
                description: 'Get amazing discounts on top brand headphones and earbuds. Limited time offer on premium audio equipment.',
                type: 'percentage',
                discountValue: 25,
                category: 'all',
                applicableProducts: allProductIds,
                minimumOrderAmount: 0,
                validFrom: validFrom,
                validUntil: validUntil,
                isActive: true,
                featured: true,
                tags: ['sale', 'headphones', 'audio']
            }
        ];

        const createdDeals = await Deal.insertMany(deals);
        console.log(`✅ Successfully created ${createdDeals.length} deal(s)`);
        console.log(`   Products in deals: ${allProductIds.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin deals:', error);
        process.exit(1);
    }
};

seedAdminDeals();
