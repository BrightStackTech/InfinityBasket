import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  description: String,
  category: String,
  images: [String],
  featured: { type: Boolean, default: false },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;