import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { UserRole } from '@dormflow/shared-types';
import { StoreService } from '../services/store.service.js';
import { authenticateJwt, requireRole } from '../middleware/auth.js';

export const buildingsRouter = Router();

// GET /api/buildings (Public or authenticated)
buildingsRouter.get('/', (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  res.json(store.buildings);
});

// POST /api/buildings (Managers only)
buildingsRouter.post('/', authenticateJwt, requireRole(UserRole.MANAGER), (req: Request, res: Response) => {
  const { name, address } = req.body;
  if (!name || !address) {
    res.status(400).json({
      statusCode: 400,
      message: 'Building name and address are required',
      correlationId: req.correlationId,
    });
    return;
  }

  const store = StoreService.getInstance();
  const newBuilding = {
    id: `bld-${crypto.randomUUID().slice(0, 8)}`,
    name,
    address,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.buildings.push(newBuilding);
  res.status(201).json(newBuilding);
});
