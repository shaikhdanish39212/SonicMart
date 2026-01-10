const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('RAZORPAY_KEY_ID present:', !!process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET present:', !!process.env.RAZORPAY_KEY_SECRET);

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ Missing credentials!');
    process.exit(1);
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function testConnection() {
    try {
        console.log('Attempting to create a test order...');
        const options = {
            amount: 10000, // 100 INR
            currency: 'INR',
            receipt: 'test_receipt_1',
            notes: { desc: 'Test Order' }
        };

        const order = await razorpay.orders.create(options);
        console.log('✅ Success! Order created:', order.id);
        console.log('Order details:', order);
    } catch (error) {
        console.error('❌ Failed to create order:', error);
    }
}

testConnection();
