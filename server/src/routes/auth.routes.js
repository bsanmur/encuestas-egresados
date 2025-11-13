import { Router } from 'express';
import { register, login, forgotPassword, getSchools } from '../controllers/auth.controller.js';

const router = Router();

router.get('/schools', getSchools); // Public endpoint for registration
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

export default router;
