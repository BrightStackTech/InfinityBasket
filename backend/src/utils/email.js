import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailTemplate = (content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { 
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: white;
      }
      .header {
        text-align: center;
        padding: 20px;
        background: #1a1a1a;
      }
      .logo {
        width: 150px;
        height: auto;
      }
      .logo-text {
        color: #ffd700;
        font-size: 24px;
        font-family: Times New Roman, serif;
        margin: 10px 0;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #666;
        font-size: 12px;
      }
      .button {
        background: #ffd700;
        color: white;
        padding: 12px 25px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin: 20px 0;
      }
      .warning {
        color: #ff4444;
        font-size: 14px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://res.cloudinary.com/dvb5mesnd/image/upload/v1754402984/infinitybasketlogo_s7pmbl.png" alt="InfinityBasket Logo" class="logo">
        <div class="logo-text">InfinityBasket</div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} InfinityBasket. All rights reserved.</p>
        <p>123 Business Center, Mumbai 400021</p>
      </div>
    </div>
  </body>
  </html>
`;

export const sendResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password/${resetToken}`;
  
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">Password Reset Request</h1>
    <p>You requested to reset your password.</p>
    <p>Click the button below to reset your password:</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>Or copy and paste this link in your browser:</p>
    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p class="warning">If you didn't request this, please ignore this email.</p>
  `;

  const mailOptions = {
    from: `InfinityBasket <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'InfinityBasket - Password Reset Request',
    html: emailTemplate(content)
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetConfirmation = async (email) => {
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">Password Reset Confirmation</h1>
    <p>Your password has been reset successfully.</p>
    <p>If it wasn't you, please contact us immediately:</p>
    <a href="mailto:developer@infinitybasket.com" class="button">Contact Support</a>
    <p class="warning">Time of reset: ${new Date().toLocaleString()}</p>
  `;

  const mailOptions = {
    from: `InfinityBasket <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'InfinityBasket - Password Reset Confirmation',
    html: emailTemplate(content)
  };

  await transporter.sendMail(mailOptions);
};

export const sendContactFormEmail = async (formData) => {
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h1>
    <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h2 style="color: #333; margin-bottom: 15px;">Message Details:</h2>
      <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
      <p><strong>Subject:</strong> ${formData.subject}</p>
      <p><strong>Message:</strong></p>
      <p style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
        ${formData.message}
      </p>
    </div>
    <p style="color: #666; font-size: 14px;">
      This message was sent from the InfinityBasket contact form.
    </p>
  `;

  const mailOptions = {
    from: `InfinityBasket Contact Form <${process.env.EMAIL_USERNAME}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: formData.email,
    subject: `InfinityBasket Contact: ${formData.subject}`,
    html: emailTemplate(content)
  };

  await transporter.sendMail(mailOptions);
};

export const sendContactDetailsUpdateNotification = async (email, changes) => {
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">Contact Details Update Notification</h1>
    <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h2 style="color: #333; margin-bottom: 15px;">Contact Details Have Been Updated</h2>
      <p>The following contact details were updated:</p>
      <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
        ${Object.entries(changes)
          .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
          .join('')}
      </div>
      <p style="margin-top: 20px;">Time of update: ${new Date().toLocaleString()}</p>
    </div>
    <p class="warning" style="margin-top: 20px; color: #ff4444;">
      If you did not authorize these changes, please contact the developer immediately:
      <a href="mailto:developer@infinitybasket.com" style="color: #ff4444; text-decoration: underline;">
        developer@infinitybasket.com
      </a>
    </p>
  `;

  const mailOptions = {
    from: `InfinityBasket System <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'InfinityBasket - Contact Details Update Alert',
    html: emailTemplate(content)
  };

  await transporter.sendMail(mailOptions);
};

export const sendConfirmationEmail = async (email, content) => {
  const mailOptions = {
    from: `InfinityBasket <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Thank You for Contacting InfinityBasket',
    html: emailTemplate(content)
  };

  await transporter.sendMail(mailOptions);
};