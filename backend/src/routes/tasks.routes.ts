import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';

const router = Router();

// /api/v1/tasks
router.get('/', (req, res, next) => taskController.getTasks(req, res, next));
router.post('/', (req, res, next) => taskController.createTask(req, res, next));
router.get('/:id', (req, res, next) => taskController.getTaskById(req, res, next));
router.put('/:id', (req, res, next) => taskController.updateTask(req, res, next));
router.delete('/:id', (req, res, next) => taskController.deleteTask(req, res, next));

export default router;
