import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { schoolAnalytics } from '../controllers/mailing.controller.js';

const router = Router();

// Protected Mailing/Admin Routes
router.use(authMiddleware, requireRole('ADMIN'));

router.get('/dashboard/analytics', schoolAnalytics);

router.get('/mailing/subscribers', authMiddleware, requireRole('ADMIN'), mailingController.getSubscribers);
router.post('/mailing/send', authMiddleware, requireRole('ADMIN'), mailingController.sendNewsletter);

export default router;
