import { Router } from 'express';
import tasksRouter from './tasks.routes.js';

const apiRouter = Router();

// Register Module Routers
apiRouter.use('/tasks', tasksRouter);

export default apiRouter;
