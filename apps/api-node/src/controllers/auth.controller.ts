import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRole, RegisterDto, LoginDto } from '@dormflow/shared-types';
import { StoreService } from '../services/store.service.js';
import { authenticateJwt, JWT_SECRET } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', (req: Request, res: Response) => {
  const { email, password, displayName, buildingId, roomNumber, role } = req.body as RegisterDto;

  if (!email || !password || !displayName) {
    res.status(400).json({
      statusCode: 400,
      message: 'Email, password, and displayName are required fields',
      correlationId: req.correlationId,
    });
    return;
  }

  const store = StoreService.getInstance();
  const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    res.status(409).json({
      statusCode: 409,
      message: 'A user with this email address already exists',
      correlationId: req.correlationId,
    });
    return;
  }

  const building = buildingId ? store.buildings.find(b => b.id === buildingId) : null;
  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = {
    id: `usr-${crypto.randomUUID().slice(0, 8)}`,
    email: email.toLowerCase(),
    displayName,
    passwordHash,
    role: role || UserRole.RESIDENT,
    buildingId: buildingId || null,
    buildingName: building ? building.name : null,
    roomNumber: roomNumber || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.users.push(newUser);

  const { passwordHash: _, ...safeUser } = newUser;
  const token = jwt.sign(
    { sub: safeUser.id, email: safeUser.email, role: safeUser.role },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  res.status(201).json({
    accessToken: token,
    user: safeUser,
  });
});

authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body as LoginDto;

  if (!email || !password) {
    res.status(400).json({
      statusCode: 400,
      message: 'Email and password are required',
      correlationId: req.correlationId,
    });
    return;
  }

  const store = StoreService.getInstance();
  const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({
      statusCode: 401,
      message: 'Invalid email or password credentials',
      correlationId: req.correlationId,
    });
    return;
  }

  const { passwordHash: _, ...safeUser } = user;
  const token = jwt.sign(
    { sub: safeUser.id, email: safeUser.email, role: safeUser.role },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  res.json({
    accessToken: token,
    user: safeUser,
  });
});

authRouter.get('/me', authenticateJwt, (req: Request, res: Response) => {
  res.json(req.user);
});
