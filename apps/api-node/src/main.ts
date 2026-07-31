import express from 'express';
import cors from 'cors';
import { correlationMiddleware } from './middleware/correlation.js';
import { errorHandler } from './middleware/error-handler.js';
import { authRouter } from './controllers/auth.controller.js';
import { buildingsRouter } from './controllers/buildings.controller.js';
import { issuesRouter } from './controllers/issues.controller.js';
import { dashboardRouter } from './controllers/dashboard.controller.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id'],
}));
app.use(express.json());
app.use(correlationMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'dormflow-api-node',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    correlationId: req.correlationId,
  });
});

// OpenAPI Spec endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    openapi: '3.0.3',
    info: {
      title: 'DormFlow Aachen API',
      description: 'Dormitory Maintenance and Shared-Facility Management Enterprise REST API',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Local Development' }],
    paths: {
      '/api/auth/register': { post: { summary: 'Register a new user' } },
      '/api/auth/login': { post: { summary: 'Login and obtain JWT token' } },
      '/api/auth/me': { get: { summary: 'Get current user profile' } },
      '/api/issues': {
        get: { summary: 'List and filter issues' },
        post: { summary: 'Create a new maintenance issue' },
      },
      '/api/issues/{issueId}': {
        get: { summary: 'Get issue details' },
        patch: { summary: 'Update issue' },
        delete: { summary: 'Delete issue (manager only)' },
      },
      '/api/issues/{issueId}/status': { patch: { summary: 'Update issue status and append history' } },
      '/api/issues/{issueId}/assignment': { patch: { summary: 'Assign issue to manager or technician' } },
      '/api/issues/{issueId}/comments': {
        get: { summary: 'Get issue comments' },
        post: { summary: 'Add a comment (public or internal)' },
      },
      '/api/buildings': { get: { summary: 'List all Aachen dorm buildings' } },
      '/api/dashboard/summary': { get: { summary: 'Manager operational metrics and KPIs' } },
    },
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/dashboard', dashboardRouter);

// Centralized error handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[DormFlow API] Server running at http://localhost:${PORT}`);
    console.log(`[DormFlow API] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[DormFlow API] OpenAPI spec: http://localhost:${PORT}/api/docs`);
  });
}

export default app;
