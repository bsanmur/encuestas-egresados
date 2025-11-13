import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { getSubscribers, sendNewsletter } from '../controllers/mailing.controller.js';

const router = Router();

// Protected Mailing/Admin Routes
router.use(authMiddleware, requireRole('ADMIN'));

// router.get('/subscribers', authMiddleware, requireRole('ADMIN'), getSubscribers);
router.post('/send', authMiddleware, requireRole('ADMIN'), sendNewsletter);

export default router;
