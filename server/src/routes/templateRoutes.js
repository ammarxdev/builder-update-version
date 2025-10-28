import { Router } from 'express';
import { listTemplates, getTemplate, createTemplate, deleteTemplate } from '../controllers/templateController.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// Public routes - anyone can view templates
router.get('/', listTemplates);
router.get('/:id', getTemplate);

// Admin only routes - only admins can create/delete templates
router.post('/', adminAuth, createTemplate);
router.delete('/:id', adminAuth, deleteTemplate);

export default router;
