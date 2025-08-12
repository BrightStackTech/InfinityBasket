import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import crypto from 'crypto';
import { sendResetEmail } from '../utils/email.js';
import { sendPasswordResetConfirmation } from '../utils/email.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, isAdmin: true });
  if (admin && await bcrypt.compare(password, admin.password)) {
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const admin = await Admin.findOne({ isAdmin: true });
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save hashed token to admin
    admin.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    admin.resetPasswordExpiry = resetTokenExpiry;
    await admin.save();

    // Send reset email
    await sendResetEmail(admin.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Reset link sent to admin email'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset email'
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ isAdmin: true });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    // Send confirmation email
    await sendPasswordResetConfirmation(admin.email);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};