import Product from '../models/product.model.js';
import cloudinary from '../config/cloudinary.js';

// Multer setup for memory storage
import multer from 'multer';
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const createProduct = async (req, res) => {
  try {
    const { name, brand, description, category } = req.body;
    let images = [];

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      // Convert buffer to base64 and upload
      const uploadPromises = req.files.map(file => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return cloudinary.uploader.upload(base64, { resource_type: 'image' });
      });
      const results = await Promise.all(uploadPromises);
      images = results.map(result => result.secure_url);
    }

    const product = new Product({
      name,
      brand,
      description,
      category,
      images,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, brand, description, category } = req.body;
    let images = [];

    // Keep existing images if provided
    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        images = req.body.existingImages;
      } else {
        images = [req.body.existingImages];
      }
    }

    // Upload new images to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return cloudinary.uploader.upload(base64, { resource_type: 'image' });
      });
      const results = await Promise.all(uploadPromises);
      images = [...images, ...results.map(result => result.secure_url)];
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, brand, description, category, images },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    // Count current featured products
    const featuredCount = await Product.countDocuments({ featured: true });

    // Check limits
    if (featured && featuredCount >= 6) {
      return res.status(400).json({
        success: false,
        message: 'Maximum limit of 6 featured products reached'
      });
    }

    if (!featured && featuredCount <= 4) {
      return res.status(400).json({
        success: false,
        message: 'Minimum of 4 featured products required'
      });
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      { featured },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: featured ? 'Product added to featured' : 'Product removed from featured'
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured status'
    });
  }
};

export const updateProductsOrder = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, order }

    // Use Promise.all to update all products simultaneously
    await Promise.all(
      updates.map(({ id, order }) => 
        Product.findByIdAndUpdate(id, { order }, { new: true })
      )
    );

    res.json({
      success: true,
      message: 'Product order updated successfully'
    });
  } catch (error) {
    console.error('Error updating product order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product order'
    });
  }
};

export const reorderProducts = async (req, res) => {
  try {
    const { updates } = req.body;

    // Validate request body
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: 'Updates must be an array'
      });
    }

    // Validate each update object
    for (const update of updates) {
      if (!update.id || typeof update.order !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Each update must have an id and order number'
        });
      }
    }

    // Update all products in parallel
    await Promise.all(
      updates.map(({ id, order }) =>
        Product.findByIdAndUpdate(
          id,
          { order },
          { new: true, runValidators: true }
        )
      )
    );

    res.json({
      success: true,
      message: 'Products reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder products'
    });
  }
};

// Remove updateProductsOrder function as it's now consolidated into reorderProducts