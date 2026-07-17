import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '@dormflow/shared-types';
import { StoreService } from '../services/store.service.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'dormflow-aachen-super-secret-key-2026';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function authenticateJwt(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      statusCode: 401,
      message: 'Authentication token required',
      correlationId: req.correlationId,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: UserRole };
    const store = StoreService.getInstance();
    const user = store.users.find(u => u.id === payload.sub);

    if (!user) {
      res.status(401).json({
        statusCode: 401,
        message: 'Invalid session or user not found',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    res.status(401).json({
      statusCode: 401,
      message: 'Invalid or expired token',
      correlationId: req.correlationId,
      timestamp: new Date().toISOString(),
    });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
        correlationId: req.correlationId,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        statusCode: 403,
        message: `Forbidden: role '${req.user.role}' lacks permission for this action`,
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}
