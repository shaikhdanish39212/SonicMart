const nodemailer = require('nodemailer');

// Create transporter (reuse existing email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Check if user has notification type enabled
const shouldSendNotification = (user, notificationType) => {
  if (!user.notificationSettings) return false;
  return user.notificationSettings[notificationType] === true;
};

// Send email notification
const sendEmailNotification = async (user, subject, htmlContent) => {
  // Check if user has email notifications enabled
  if (!shouldSendNotification(user, 'emailNotifications')) {
    console.log(`📧 Skipping email to ${user.email} - Email notifications disabled`);
    return { success: false, reason: 'Email notifications disabled' };
  }

  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'YOUR_16_CHARACTER_APP_PASSWORD_HERE') {
    console.log('⚠️ Email not configured, logging notification instead');
    console.log(`📧 Would send email to ${user.email}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${htmlContent}`);
    return { success: false, error: 'Email not configured' };
  }

  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: user.email,
    subject: `SonicMart - ${subject}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">🎵 SonicMart</h1>
          <p style="color: #6b7280; font-size: 16px;">Your Premium Audio Store</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #374151; margin-bottom: 15px;">${subject}</h2>
          ${htmlContent}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
            You're receiving this because you have email notifications enabled.
          </p>
          <p style="color: #6b7280; font-size: 12px;">
            <a href="${process.env.FRONTEND_URL}/profile" style="color: #2563eb;">Manage notification preferences</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Email send failed to ${user.email}:`, error);
    return { success: false, error: error.message };
  }
};

// Send order update notification
const sendOrderUpdateNotification = async (user, order, status) => {
  if (!shouldSendNotification(user, 'orderUpdates')) {
    return { success: false, reason: 'Order notifications disabled' };
  }

  const statusMessages = {
    'pending': 'Your order has been received and is being processed.',
    'confirmed': 'Your order has been confirmed and will be shipped soon.',
    'shipped': 'Your order has been shipped and is on its way!',
    'delivered': 'Your order has been successfully delivered.',
    'cancelled': 'Your order has been cancelled.'
  };

  const statusEmojis = {
    'pending': '⏳',
    'confirmed': '✅',
    'shipped': '🚚',
    'delivered': '📦',
    'cancelled': '❌'
  };

  const subject = `${statusEmojis[status]} Order ${status.charAt(0).toUpperCase() + status.slice(1)} - #${order._id}`;
  
  const htmlContent = `
    <p style="margin: 0 0 15px 0; color: #374151;">Hello ${user.name || 'Customer'},</p>
    <p style="margin: 0 0 15px 0; color: #374151;">
      ${statusMessages[status]}
    </p>
    
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #374151;">Order Details:</h3>
      <p style="margin: 5px 0; color: #6b7280;"><strong>Order ID:</strong> #${order._id}</p>
      <p style="margin: 5px 0; color: #6b7280;"><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <p style="margin: 5px 0; color: #6b7280;"><strong>Items:</strong> ${order.items?.length || 0} item(s)</p>
    </div>
    
    <p style="margin: 15px 0 0 0; color: #374151;">
      <a href="${process.env.FRONTEND_URL}/orders" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Order Details
      </a>
    </p>
  `;

  return await sendEmailNotification(user, subject, htmlContent);
};

// Send marketing email notification
const sendMarketingNotification = async (user, subject, content) => {
  if (!shouldSendNotification(user, 'marketingEmails')) {
    return { success: false, reason: 'Marketing emails disabled' };
  }

  return await sendEmailNotification(user, subject, content);
};

// Send security alert notification
const sendSecurityAlertNotification = async (user, alertType, details) => {
  if (!shouldSendNotification(user, 'securityAlerts')) {
    return { success: false, reason: 'Security alerts disabled' };
  }

  const alertMessages = {
    'password_changed': 'Your account password was successfully changed.',
    'login_suspicious': 'A suspicious login attempt was detected on your account.',
    'profile_updated': 'Your profile information was updated.',
    'new_device_login': 'A new device was used to access your account.'
  };

  const subject = `🔒 Security Alert - ${alertType.replace('_', ' ').toUpperCase()}`;
  
  const htmlContent = `
    <p style="margin: 0 0 15px 0; color: #374151;">Hello ${user.name || 'Customer'},</p>
    <p style="margin: 0 0 15px 0; color: #374151;">
      ${alertMessages[alertType] || 'A security event occurred on your account.'}
    </p>
    
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #dc2626;">Security Details:</h3>
      <p style="margin: 5px 0; color: #991b1b;"><strong>Event:</strong> ${alertType}</p>
      <p style="margin: 5px 0; color: #991b1b;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      ${details ? `<p style="margin: 5px 0; color: #991b1b;"><strong>Details:</strong> ${details}</p>` : ''}
    </div>
    
    <p style="margin: 15px 0 0 0; color: #374151;">
      If this wasn't you, please contact our support team immediately or change your password.
    </p>
    
    <p style="margin: 15px 0 0 0; color: #374151;">
      <a href="${process.env.FRONTEND_URL}/profile" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Secure My Account
      </a>
    </p>
  `;

  return await sendEmailNotification(user, subject, htmlContent);
};

// Send welcome email for new users
const sendWelcomeNotification = async (user) => {
  const subject = '🎉 Welcome to SonicMart!';
  
  const htmlContent = `
    <p style="margin: 0 0 15px 0; color: #374151;">Hello ${user.name || 'Customer'},</p>
    <p style="margin: 0 0 15px 0; color: #374151;">
      Welcome to SonicMart - Your Premium Audio Destination! 🎵
    </p>
    <p style="margin: 0 0 15px 0; color: #374151;">
      We're excited to have you join our community of audio enthusiasts.
    </p>
    
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #1d4ed8;">What's Next?</h3>
      <ul style="margin: 0; color: #1e40af;">
        <li>Explore our premium headphone collection</li>
        <li>Set up your profile preferences</li>
        <li>Add items to your wishlist</li>
        <li>Enjoy exclusive member deals</li>
      </ul>
    </div>
    
    <p style="margin: 15px 0 0 0; color: #374151;">
      <a href="${process.env.FRONTEND_URL}/products" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Start Shopping
      </a>
    </p>
  `;

  return await sendEmailNotification(user, subject, htmlContent);
};

// Log push notification (for future implementation)
const logPushNotification = (user, title, body) => {
  if (!shouldSendNotification(user, 'pushNotifications')) {
    console.log(`📱 Skipping push notification for ${user.email} - Push notifications disabled`);
    return { success: false, reason: 'Push notifications disabled' };
  }

  console.log(`📱 PUSH NOTIFICATION (Would send to ${user.email}):`);
  console.log(`Title: ${title}`);
  console.log(`Body: ${body}`);
  console.log(`🔔 To implement: Integrate with Firebase Cloud Messaging or similar service`);
  
  return { success: false, reason: 'Push notifications not implemented yet' };
};

// Log SMS notification (for future implementation)
const logSMSNotification = (user, message) => {
  if (!shouldSendNotification(user, 'smsNotifications')) {
    console.log(`📱 Skipping SMS for ${user.phone} - SMS notifications disabled`);
    return { success: false, reason: 'SMS notifications disabled' };
  }

  console.log(`📱 SMS NOTIFICATION (Would send to ${user.phone}):`);
  console.log(`Message: ${message}`);
  console.log(`📞 To implement: Integrate with Twilio, AWS SNS, or similar SMS service`);
  
  return { success: false, reason: 'SMS notifications not implemented yet' };
};

module.exports = {
  sendEmailNotification,
  sendOrderUpdateNotification,
  sendMarketingNotification,
  sendSecurityAlertNotification,
  sendWelcomeNotification,
  logPushNotification,
  logSMSNotification,
  shouldSendNotification
};