import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { getMyProfile, updateMyProfile } from '../controllers/alumni.controller.js';

const router = Router();

router.use(authMiddleware, requireRole('ALUMNI'));

router.get('/profile/me', getMyProfile);
router.put('/profile/me', updateMyProfile);
// router.put('/subscribe', updateSubscription);

export default router;
