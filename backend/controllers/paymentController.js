const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper function to get Razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not found in environment variables');
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount must be at least ₹1'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      notes: notes || {}
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    res.json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    console.log('=== PAYMENT VERIFICATION DEBUG ===');
    console.log('Received data:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature ? `${razorpay_signature.substring(0, 10)}...` : 'undefined',
      orderData: orderData ? 'present' : 'missing'
    });

    // Check if all required fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        status: 'error',
        message: 'Missing required payment verification fields',
        missingFields: {
          razorpay_order_id: !razorpay_order_id,
          razorpay_payment_id: !razorpay_payment_id,
          razorpay_signature: !razorpay_signature
        }
      });
    }

    // Check if Razorpay secret is available
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.log('❌ Razorpay secret key not found');
      return res.status(500).json({
        status: 'error',
        message: 'Payment gateway configuration error'
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('Signature verification:', {
      body,
      expectedSignature: `${expectedSignature.substring(0, 10)}...`,
      receivedSignature: razorpay_signature ? `${razorpay_signature.substring(0, 10)}...` : 'undefined',
      match: expectedSignature === razorpay_signature
    });

    if (expectedSignature !== razorpay_signature) {
      console.log('❌ Payment verification failed - signature mismatch');
      return res.status(400).json({
        status: 'error',
        message: 'Payment signature verification failed',
        details: 'Signature mismatch - payment may have been tampered with'
      });
    }

    console.log('✅ Payment verification successful');

    // Create order in database
    if (orderData) {
      try {
        // Use the Order model's built-in orderNumber generation to avoid duplicates
        const Order = require('../models/Order');
        
        // Debug orderData structure
        console.log('=== ORDER DATA DEBUG ===');
        console.log('orderData:', JSON.stringify(orderData, null, 2));
        console.log('orderData.items:', orderData.items);
        if (orderData.items && orderData.items.length > 0) {
          console.log('First item structure:', JSON.stringify(orderData.items[0], null, 2));
        }
        
        // Process order items to include required fields
        const processedItems = orderData.items.map((item, index) => {
          console.log(`Processing item ${index}:`, {
            product: item.product,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            hasImage: !!item.image
          });
          
          return {
            product: item.product,
            name: item.name,
            image: item.image || item.images?.[0] || item.imageUrl || '/default-product.jpg',
            price: item.price,
            quantity: item.quantity,
            sku: item.sku || `SKU-${item.product || Math.random().toString(36).substr(2, 8).toUpperCase()}`
          };
        });

        console.log('Processed items:', JSON.stringify(processedItems, null, 2));

        const newOrder = new Order({
          user: req.user.id,
          // Let the pre-save middleware generate the orderNumber
          orderItems: processedItems,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: 'razorpay', // Use lowercase as per enum
          paymentResult: {
            id: razorpay_payment_id,
            status: 'success',
            update_time: new Date(),
            email_address: req.user.email
          },
          totalPrice: orderData.totalPrice,
          taxPrice: orderData.taxPrice,
          shippingPrice: orderData.shippingPrice,
          itemsPrice: orderData.totalPrice - (orderData.taxPrice || 0) - (orderData.shippingPrice || 0),
          couponCode: orderData.couponCode || null,
          discountAmount: orderData.discountAmount || 0,
          isPaid: true,
          paidAt: new Date()
        });

        console.log('Saving order to database...', { items: processedItems.length, coupon: orderData.couponCode });
        const savedOrder = await newOrder.save();
        console.log('Order saved successfully:', { 
          orderId: savedOrder._id, 
          orderNumber: savedOrder.orderNumber,
          coupon: savedOrder.couponCode 
        });

        // Handle coupon usage tracking for Razorpay payments
        if (orderData.couponCode) {
          try {
            console.log(`🎫 [RAZORPAY] Processing coupon ${orderData.couponCode} for order completion`);
            const Coupon = require('../models/Coupon');
            const couponUpdate = await Coupon.findOneAndUpdate(
              { code: orderData.couponCode.toUpperCase() },
              {
                $inc: { usageCount: 1 },
                $push: {
                  usedBy: {
                    user: req.user.id,
                    usedAt: new Date()
                  }
                }
              },
              { new: true }
            );
            
            if (couponUpdate) {
              console.log(`✅ [RAZORPAY] Coupon ${orderData.couponCode} usage incremented to ${couponUpdate.usageCount}/${couponUpdate.usageLimit}`);
            } else {
              console.log(`❌ [RAZORPAY] Coupon ${orderData.couponCode} not found for usage increment`);
            }
          } catch (couponError) {
            console.error('❌ [RAZORPAY] Error updating coupon usage for order:', couponError);
            // Don't fail the order if coupon update fails
          }
        }

        // Clear user's cart for Razorpay payments
        try {
          console.log(`🛒 [RAZORPAY] Clearing cart for user ${req.user.id}`);
          const Cart = require('../models/Cart');
          const cart = await Cart.findOne({ user: req.user.id });
          if (cart) {
            cart.clearCart();
            await cart.save();
            console.log(`🛒 [RAZORPAY] Cart cleared successfully`);
          }
        } catch (cartError) {
          console.error('❌ [RAZORPAY] Error clearing cart:', cartError);
        }

        // Update product stock
        console.log('Updating product stock...');
        for (const item of orderData.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity, salesCount: item.quantity } }
          );
        }
        console.log('Product stock updated successfully');

        res.json({
          status: 'success',
          message: 'Payment verified and order created successfully',
          data: {
            orderId: savedOrder._id,
            orderNumber: savedOrder.orderNumber,
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            order: savedOrder // Include full order data for frontend
          }
        });
      } catch (dbError) {
        console.error('❌ [RAZORPAY] Database error while creating order:', dbError);
        
        // Return failure for order creation issues
        return res.status(500).json({
          status: 'error',
          message: 'Payment verified but order creation failed',
          data: {
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            error: dbError.message,
            errorCode: dbError.code
          }
        });
      }
    } else {
      res.json({
        status: 'success',
        message: 'Payment verified successfully',
        data: {
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id
        }
      });
    }
  } catch (error) {
    console.error('❌ Verify payment error:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Payment verification failed';
    let statusCode = 500;
    
    if (error.message.includes('signature')) {
      errorMessage = 'Payment signature verification failed';
      statusCode = 400;
    } else if (error.message.includes('Missing required')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('configuration')) {
      errorMessage = 'Payment gateway configuration error';
      statusCode = 500;
    } else if (error.message.includes('Database')) {
      errorMessage = 'Order creation failed after payment verification';
      statusCode = 500;
    }
    
    res.status(statusCode).json({
      status: 'error',
      message: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      status: 'success',
      data: payment
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

// @desc    Refund payment
// @route   POST /api/payments/refund
// @access  Private/Admin
const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount, notes } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Amount in paise
      notes: notes || {}
    });

    res.json({
      status: 'success',
      message: 'Refund initiated successfully',
      data: refund
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Refund failed',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment
};
