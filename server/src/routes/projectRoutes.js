import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listProjects, getProject, createProject, updateProject, deleteProject, downloadProject } from '../controllers/projectController.js';

const router = Router();

router.get('/', auth, listProjects);
router.post('/', auth, createProject);
router.get('/:id', auth, getProject);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);
router.get('/:id/download', auth, downloadProject);

export default router;
