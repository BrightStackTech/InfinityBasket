import { Router } from 'express';
import { login, requestPasswordReset, resetPassword } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);

router.get('/dashboard', requireAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password', requireAdmin, resetPassword);

export default router;