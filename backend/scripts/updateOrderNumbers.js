const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

// Generate order number function (same as in Order model)
async function generateOrderNumber() {
  const currentYear = new Date().getFullYear();
  const orderCount = await Order.countDocuments();
  const sequentialNumber = String(orderCount + 1).padStart(6, '0');
  return `SA-${currentYear}-${sequentialNumber}`;
}

async function updateOrderNumbers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sonicmart');
    console.log('📦 Connected to MongoDB');

    // Find orders without orderNumber
    const ordersWithoutNumbers = await Order.find({ 
      $or: [
        { orderNumber: { $exists: false } },
        { orderNumber: null },
        { orderNumber: '' }
      ]
    }).sort({ createdAt: 1 }); // Sort by creation date (oldest first)

    console.log(`🔍 Found ${ordersWithoutNumbers.length} orders without proper order numbers`);

    if (ordersWithoutNumbers.length === 0) {
      console.log('✅ All orders already have proper order numbers');
      process.exit(0);
    }

    let updatedCount = 0;

    for (let i = 0; i < ordersWithoutNumbers.length; i++) {
      const order = ordersWithoutNumbers[i];
      
      // Generate a sequential order number based on creation order
      const currentYear = new Date(order.createdAt).getFullYear();
      const sequentialNumber = String(i + 1).padStart(6, '0');
      const newOrderNumber = `SA-${currentYear}-${sequentialNumber}`;
      
      // Update the order
      await Order.findByIdAndUpdate(order._id, {
        orderNumber: newOrderNumber
      });
      
      updatedCount++;
      console.log(`✅ Updated order ${order._id} → ${newOrderNumber}`);
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} orders with proper order numbers`);
    
    // Verify the updates
    const remainingOrders = await Order.find({ 
      $or: [
        { orderNumber: { $exists: false } },
        { orderNumber: null },
        { orderNumber: '' }
      ]
    });

    if (remainingOrders.length === 0) {
      console.log('✅ All orders now have proper order numbers');
    } else {
      console.log(`⚠️  ${remainingOrders.length} orders still need order numbers`);
    }

  } catch (error) {
    console.error('❌ Error updating order numbers:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the update
updateOrderNumbers();