const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

async function checkOrderNumbers() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('📦 Connected to MongoDB Atlas');
    console.log('🔗 Database:', process.env.MONGODB_URI.split('@')[1].split('/')[1]);

    // Get all orders
    const allOrders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
    
    console.log(`\n📋 Recent Orders (${allOrders.length} found):`);
    console.log('='.repeat(80));
    
    if (allOrders.length === 0) {
      console.log('⚠️  No orders found in the database');
      
      // Check if there are any collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\n📊 Available collections:');
      collections.forEach(col => console.log(`  - ${col.name}`));
      
    } else {
      allOrders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`);
        console.log(`  ID: ${order._id}`);
        console.log(`  Order Number: ${order.orderNumber || 'NOT SET'}`);
        console.log(`  Created: ${order.createdAt}`);
        console.log(`  Status: ${order.orderStatus}`);
        console.log(`  User: ${order.user}`);
        console.log(`  Total: ₹${order.totalPrice}`);
        console.log(`  ID Slice: ${order._id.toString().slice(-8).toUpperCase()}`);
        console.log('-'.repeat(40));
      });

      // Look for the specific order
      const matchingOrder = allOrders.find(order => 
        order._id.toString().slice(-8).toUpperCase() === '423A6DD0'
      );
      
      if (matchingOrder) {
        console.log('\n🎯 Found the order from your image:');
        console.log(`  Full ID: ${matchingOrder._id}`);
        console.log(`  Order Number: ${matchingOrder.orderNumber || 'NOT SET'}`);
        console.log(`  Display ID: #${matchingOrder._id.toString().slice(-8).toUpperCase()}`);
        console.log(`  Status: ${matchingOrder.orderStatus}`);
      } else {
        console.log('\n🔍 Order with ID ending in 423A6DD0 not found in recent orders');
      }
    }

  } catch (error) {
    console.error('❌ Error checking orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📦 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the check
checkOrderNumbers();