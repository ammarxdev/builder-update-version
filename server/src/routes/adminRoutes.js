import { Router } from 'express';
import { adminLogin, getAdminProfile, createAdmin } from '../controllers/adminAuthController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// Admin Authentication
router.post('/login', adminLogin);
router.get('/profile', adminAuth, getAdminProfile);
router.post('/create', createAdmin); // Remove or protect this in production

export default router;
