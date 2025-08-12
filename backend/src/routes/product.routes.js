import { Router } from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  upload, 
  toggleFeatured,
  reorderProducts 
} from '../controllers/product.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Static routes first
router.post('/', requireAdmin, upload.array('media'), createProduct);
router.get('/', getProducts);
router.put('/reorder', requireAdmin, reorderProducts); // Move this before dynamic routes

// Dynamic routes (:id) after
router.get('/:id', getProductById);
router.put('/:id', requireAdmin, upload.array('media'), updateProduct);
router.put('/:id/toggle-featured', requireAdmin, toggleFeatured);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;