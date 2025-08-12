import { sendContactFormEmail } from '../utils/email.js';
import ContactDetails from '../models/contactdetails.model.js';
import { sendContactDetailsUpdateNotification } from '../utils/email.js';

export const submitContactForm = async (req, res) => {
  try {
    const formData = req.body;
    await sendContactFormEmail(formData);
    
    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

export const getContactDetails = async (req, res) => {
  try {
    let details = await ContactDetails.findOne();
    if (!details) {
      details = await ContactDetails.create({
        email: '',
        phone: '',
        location: '',
        mapUrl: '',
        hours: '',
        instagram: '',
        facebook: '',
        twitter: ''
      });
    }
    res.json(details);
  } catch (error) {
    console.error('Get contact details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact details'
    });
  }
};

export const updateContactDetails = async (req, res) => {
  try {
    const updates = req.body;
    let details = await ContactDetails.findOne();
    
    if (!details) {
      details = new ContactDetails(updates);
    } else {
      // Store old values for comparison
      const oldValues = { ...details.toObject() };
      
      // Update the values
      Object.assign(details, updates);
      await details.save();

      // Create changes object for email
      const changes = {};
      Object.keys(updates).forEach(key => {
        if (updates[key] !== oldValues[key]) {
          changes[key] = updates[key];
        }
      });

      // Only send email if there were actual changes
      if (Object.keys(changes).length > 0) {
        await sendContactDetailsUpdateNotification(
          process.env.ADMIN_EMAIL,
          changes
        );
      }
    }
    
    res.json({
      success: true,
      message: 'Contact details updated successfully',
      data: details
    });
  } catch (error) {
    console.error('Update contact details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact details'
    });
  }
};