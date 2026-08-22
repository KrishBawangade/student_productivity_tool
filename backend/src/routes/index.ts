import { Router } from 'express';
import tasksRouter from './tasks.routes.js';
import flashcardsRouter from './flashcards.routes.js';
import copilotRouter from './copilot.routes.js';
import coursesRouter from './courses.routes.js';

const apiRouter = Router();

// Register Module Routers
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/flashcards', flashcardsRouter);
apiRouter.use('/copilot', copilotRouter);
apiRouter.use('/courses', coursesRouter);

export default apiRouter;

