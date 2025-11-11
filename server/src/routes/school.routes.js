import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { schoolAnalytics } from '../controllers/school.controller.js';

const router = Router();

router.use(authMiddleware, requireRole('SCHOOL'));

router.get('/dashboard/analytics', schoolAnalytics);

export default router;
