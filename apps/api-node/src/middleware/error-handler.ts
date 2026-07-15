import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  console.error(`[Error] [${req.correlationId || 'N/A'}] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    statusCode,
    message,
    path: req.originalUrl,
    correlationId: req.correlationId,
    timestamp: new Date().toISOString(),
  });
}
