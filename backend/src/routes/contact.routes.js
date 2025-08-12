import { Router } from 'express';
import { submitContactForm, getContactDetails, updateContactDetails } from '../controllers/contact.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', submitContactForm);
router.get('/details', getContactDetails);
router.put('/details', requireAdmin, updateContactDetails);

export default router;