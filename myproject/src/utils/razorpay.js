// Razorpay Configuration and Utilities

// Razorpay API Key (Public Key) - Make sure this is correct
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_S2DRgwMm0De1EZ';

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async ({
  amount,
  orderId,
  name,
  email,
  contact,
  onSuccess,
  onFailure,
  onDismiss
}) => {
  try {
    const res = await loadRazorpayScript();
    if (!res) {
      const error = { description: 'Razorpay SDK failed to load. Please check your internet connection.' };
      console.error('Razorpay SDK failed to load');
      if (onFailure) {
        onFailure(error);
      }
      return;
    }

    // Validate required parameters
    if (!amount || amount <= 0) {
      const error = { description: 'Invalid amount provided' };
      console.error('Invalid amount:', amount);
      if (onFailure) {
        onFailure(error);
      }
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // Amount in paise (multiply by 100)
      currency: 'INR',
      name: 'Sounds Accessories',
      description: 'Premium Audio Equipment & Components',
      order_id: orderId || `order_${Date.now()}`, // Generate order ID if not provided
      handler: function (response) {
        // Payment successful
        console.log('Payment Success:', response);
        if (onSuccess) {
          onSuccess(response);
        }
      },
      prefill: {
        name: name || '',
        email: email || '',
        contact: contact || ''
      },
      notes: {
        address: 'Sounds Accessories Store',
        website: 'sounds-accessories.com'
      },
      theme: {
        color: '#FF6B6B'
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        emi: false
      },
      modal: {
        ondismiss: function () {
          console.log('Payment modal dismissed');
          if (onDismiss) {
            onDismiss();
          }
        }
      },
      retry: {
        enabled: true,
        max_count: 3
      },
      timeout: 300, // 5 minutes timeout
      remember_customer: false
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.on('payment.failed', function (response) {
      console.error('Payment Failed:', response.error);
      if (onFailure) {
        onFailure(response.error);
      }
    });

    paymentObject.open();
  } catch (error) {
    console.error('Error initializing Razorpay payment:', error);
    if (onFailure) {
      onFailure({ description: error.message || 'Failed to initialize payment' });
    }
  }
};

// Format currency for display
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Validate Razorpay response
export const validateRazorpayResponse = (response) => {
  return response &&
    response.razorpay_payment_id &&
    response.razorpay_order_id &&
    response.razorpay_signature;
};
