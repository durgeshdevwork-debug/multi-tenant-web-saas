
import type { Request, Response, NextFunction } from 'express';
import { sendError } from '@shared/utils/response';

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  return sendError(res, 'Route not found', 404);
}

