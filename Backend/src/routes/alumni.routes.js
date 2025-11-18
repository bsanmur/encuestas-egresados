import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  getMyProfile,
  updateMyProfile,
  updateSubscription,
  getMySurveys,
  getSurveyForAlumni,
  submitSurveyResponse,
} from '../controllers/alumni.controller.js';

const router = Router();

// All routes require ALUMNI authentication
router.use(authMiddleware, requireRole('ALUMNI'));

// Profile routes
router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);

// Subscription management
router.put('/subscribe', updateSubscription);

// Survey routes
router.get('/surveys', getMySurveys);
router.get('/surveys/:surveyId', getSurveyForAlumni);
router.post('/surveys/:surveyId/submit', submitSurveyResponse);

export default router;
