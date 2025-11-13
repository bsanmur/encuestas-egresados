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
  createSurvey,
  listSurveys,
  getSurvey,
  updateSurvey,
  deleteSurvey,
  getSurveyAnalytics
} from '../controllers/admin.controller.js';

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

// === Alumnos ===
router.get('/alumni', listAlumni);
router.put('/alumni/:id', updateAlumni);
router.delete('/alumni/:id', deleteAlumni);
router.put('/alumni/approve/:id', approveAlumni);

// === Escuelas ===
router.get('/schools', listSchools);
router.post('/schools', createSchool);
router.put('/schools/:id', updateSchool);
router.delete('/schools/:id', deleteSchool);
router.post('/schools/assign-user', assignUserToSchool);

// === Analíticas ===
router.get('/analytics/global', globalAnalytics);

// === Encuestas ===
router.post('/surveys', createSurvey);
router.get('/surveys', listSurveys);
router.get('/surveys/:id', getSurvey);
router.put('/surveys/:id', updateSurvey);
router.delete('/surveys/:id', deleteSurvey);
router.get('/surveys/:id/analytics', getSurveyAnalytics);

export default router;