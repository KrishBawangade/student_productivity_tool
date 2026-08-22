import { Router } from 'express';
import tasksRouter from './tasks.routes.js';
import flashcardsRouter from './flashcards.routes.js';

const apiRouter = Router();

// Register Module Routers
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/flashcards', flashcardsRouter);

export default apiRouter;
