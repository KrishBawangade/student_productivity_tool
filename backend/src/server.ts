import express, { Request, Response } from 'express';
import { env } from './config/env.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Global Middlewares
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'Nexus Academia Backend API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// Root API Welcome Endpoint
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Nexus Academia Standalone Express API v1',
    endpoints: {
      health: '/api/v1/health',
      tasks: '/api/v1/tasks',
      flashcards: '/api/v1/flashcards',
      copilot: '/api/v1/copilot',
      courses: '/api/v1/courses',
      analytics: '/api/v1/analytics',
      auth: '/api/v1/auth',
    },
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

// Start Express Server Listener
app.listen(env.PORT, () => {
  console.log(`🚀 [Nexus Academia Backend] Server running on http://localhost:${env.PORT}`);
  console.log(`📡 Health Check available at http://localhost:${env.PORT}/api/v1/health`);
});

export default app;
