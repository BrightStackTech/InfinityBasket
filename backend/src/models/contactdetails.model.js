import mongoose from 'mongoose';

const contactDetailsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  mapUrl: {
    type: String,
    required: true
  },
  hours: {
    type: String,
    required: true
  },
  instagram: {
    type: String,
    trim: true,
    default: ''
  },
  facebook: {
    type: String,
    trim: true,
    default: ''
  },
  twitter: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('ContactDetails', contactDetailsSchema);