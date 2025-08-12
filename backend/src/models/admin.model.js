import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: true },
  
  resetPasswordToken: String,
  resetPasswordExpiry: Date
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;