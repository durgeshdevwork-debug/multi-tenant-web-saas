
import type { Request, Response, NextFunction } from 'express';
import  {pinoHttp} from 'pino-http';
import { logger } from '@configs/logger';

export const requestLogger = pinoHttp({ logger });

export function requestLogMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  requestLogger(req, res);
  next();
}

