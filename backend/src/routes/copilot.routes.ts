import { Router } from 'express';
import { copilotController } from '../controllers/copilotController.js';

const router = Router();

// /api/v1/copilot
router.post('/chat', (req, res, next) => copilotController.chat(req, res, next));
router.post('/explain', (req, res, next) => copilotController.explain(req, res, next));

export default router;
