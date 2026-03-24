
import type { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';
import { logger } from '@configs/logger';
import { sendError } from '@shared/utils/response';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    logger.warn({ err }, 'AppError');
    return sendError(res, err.message, err.statusCode, err.details);
  }

  logger.error({ err }, 'Unhandled error');
  return sendError(res);
}

