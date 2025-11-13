import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  listAlumni,
  updateAlumni,
  deleteAlumni,
  approveAlumni,
  listSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  assignUserToSchool,
  globalAnalytics,
  createSurvey
} from '../controllers/admin.controller.js';

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

router.get('/alumni', listAlumni);
router.put('/alumni/:id', updateAlumni);
router.delete('/alumni/:id', deleteAlumni);
router.put('/alumni/approve/:id', approveAlumni);

router.get('/schools', listSchools);
router.post('/schools', createSchool);
router.put('/schools/:id', updateSchool);
router.delete('/schools/:id', deleteSchool);
router.post('/schools/assign-user', assignUserToSchool);

router.get('/analytics/global', globalAnalytics);

router.post('/surveys', createSurvey);

export default router;
