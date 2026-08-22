import { Router } from 'express';
import { StudySessionController } from '../controllers/studySessionController.js';

const router = Router();
const controller = new StudySessionController();

// /api/v1/sessions
router.get('/', controller.getSessions);
router.post('/', controller.logSession);
router.get('/analytics', controller.getAnalytics);
router.delete('/:id', controller.deleteSession);

export default router;
