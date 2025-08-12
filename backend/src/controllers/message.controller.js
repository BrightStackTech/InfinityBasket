import Message from '../models/message.model.js';
import { sendConfirmationEmail, sendContactFormEmail } from '../utils/email.js';

export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const currentTime = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata'
    });

    // 1. Save message to database first
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      status: 'pending'
    });

    // 2. Prepare confirmation email content
    const confirmationContent = `
      <h1 style="color: #333; margin-bottom: 20px;">Thank You for Contacting Us</h1>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you shortly.</p>
      <p>Below are the details of your submission:</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Submission Time:</strong></td>
            <td style="padding: 8px 0;">${currentTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Name:</strong></td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Email:</strong></td>
            <td style="padding: 8px 0;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Subject:</strong></td>
            <td style="padding: 8px 0;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;" colspan="2">
              <strong>Message:</strong>
              <div style="background: white; padding: 10px; border-radius: 5px; margin-top: 5px;">
                ${message}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <p>Reference ID: ${newMessage._id}</p>
      <p style="margin-top: 20px;">Best regards,<br>InfinityBasket Team</p>
    `;

    // 3. Send both emails in parallel
    await Promise.all([
      sendConfirmationEmail(email, confirmationContent),
      sendContactFormEmail({ name, email, subject, message })
    ]);

    console.log('Message stored and emails sent successfully');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error in createMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

export const deleteMessages = async (req, res) => {
  try {
    const { ids } = req.body;
    await Message.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: 'Messages deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete messages',
      error: error.message
    });
  }
};

export const sendReply = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { replyContent } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Update message with reply
    message.reply = {
      content: replyContent,
      repliedAt: new Date()
    };
    message.status = 'replied';
    await message.save();

    // Prepare reply email content
    const replyEmailContent = `
      <h1 style="color: #333; margin-bottom: 20px;">Reply to Your Message</h1>
      <p>Dear ${message.name},</p>
      <p>We have received your message and here is our response:</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Your original message (ID: ${message._id}):</strong></p>
        <div style="background: white; padding: 10px; border-radius: 5px; margin: 10px 0;">
          ${message.message}
        </div>
        <p style="margin-top: 15px;"><strong>Our reply:</strong></p>
        <div style="background: white; padding: 10px; border-radius: 5px;">
          ${replyContent}
        </div>
      </div>
      <p style="color: #666; margin-top: 20px; font-style: italic;">
        Do not reply to this email. For further communication, please send a new email to ${process.env.ADMIN_EMAIL}
      </p>
    `;

    // Send reply email
    await sendConfirmationEmail(message.email, replyEmailContent);

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
};