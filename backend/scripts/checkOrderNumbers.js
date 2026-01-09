const mongoose = require('mongoose');
require('dotenv').config();

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Order = require('../models/Order');
    
    // Check for duplicate order numbers
    const duplicates = await Order.aggregate([
      { $group: { _id: '$orderNumber', count: { $sum: 1 }, orders: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    console.log('Duplicate order numbers found:', duplicates.length);
    if (duplicates.length > 0) {
      console.log('Duplicates:', duplicates);
    }
    
    // Check latest orders
    const latest = await Order.find().sort({ createdAt: -1 }).limit(5).select('orderNumber createdAt orderStatus totalPrice');
    console.log('Latest orders:');
    latest.forEach(order => {
      console.log(`  ${order.orderNumber} - ${order.createdAt} - ${order.orderStatus} - ₹${order.totalPrice}`);
    });
    
    // Check total order count
    const totalCount = await Order.countDocuments();
    console.log(`Total orders in database: ${totalCount}`);
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkOrders();