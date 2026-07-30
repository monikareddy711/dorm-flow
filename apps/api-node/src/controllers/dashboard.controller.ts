import { Router, Request, Response } from 'express';
import { UserRole } from '@dormflow/shared-types';
import { StoreService } from '../services/store.service.js';
import { authenticateJwt, requireRole } from '../middleware/auth.js';

export const dashboardRouter = Router();

// GET /api/dashboard/summary (Staff only)
dashboardRouter.get(
  '/summary',
  authenticateJwt,
  requireRole(UserRole.MANAGER, UserRole.TECHNICIAN),
  (req: Request, res: Response) => {
    const store = StoreService.getInstance();
    const summary = store.getDashboardSummary();
    res.json(summary);
  },
);
