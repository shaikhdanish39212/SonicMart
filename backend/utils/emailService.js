const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
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

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'YOUR_16_CHARACTER_APP_PASSWORD_HERE') {
    console.log('⚠️ Email not configured, falling back to console log');
    console.log('Password reset token for', email, ':', resetToken);
    console.log('Reset link: http://localhost:5174/reset-password?token=' + resetToken);
    return { success: false, error: 'Email not configured' };
  }

  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - SonicMart',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">🔒 Password Reset Request</h1>
          <p style="color: #6b7280; font-size: 16px;">Reset your SonicMart account password</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 15px 0; color: #374151;">Hello,</p>
          <p style="margin: 0 0 15px 0; color: #374151;">
            We received a request to reset the password for your SonicMart account associated with <strong>${email}</strong>.
          </p>
          <p style="margin: 0 0 20px 0; color: #374151;">
            Click the button below to reset your password. This link will expire in 10 minutes for security reasons.
          </p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #3b82f6, #ef4444); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: bold;
                      display: inline-block;">
              Reset My Password
            </a>
          </div>
          
          <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. 
            Your password will remain unchanged.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
            This email was sent by <strong>SonicMart</strong>
          </p>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2025 SonicMart. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  testEmailConfig
};