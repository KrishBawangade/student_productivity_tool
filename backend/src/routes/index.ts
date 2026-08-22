import { Router } from 'express';
import tasksRouter from './tasks.routes.js';
import flashcardsRouter from './flashcards.routes.js';
import copilotRouter from './copilot.routes.js';
import coursesRouter from './courses.routes.js';
import userRouter from './user.routes.js';
import studySessionRouter from './studySession.routes.js';
import notesRouter from './notes.routes.js';

const apiRouter = Router();

// Register Module Routers
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/flashcards', flashcardsRouter);
apiRouter.use('/copilot', copilotRouter);
apiRouter.use('/courses', coursesRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/sessions', studySessionRouter);
apiRouter.use('/notes', notesRouter);

export default apiRouter;

