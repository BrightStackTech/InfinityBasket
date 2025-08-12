import express from 'express';
import { createMessage, getMessages, deleteMessages, sendReply } from '../controllers/message.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', requireAdmin, getMessages);
router.delete('/multiple', requireAdmin, deleteMessages);
router.post('/:messageId/reply', requireAdmin, sendReply);

export default router;