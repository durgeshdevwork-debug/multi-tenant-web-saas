
import type { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  errors?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Request successful',
  statusCode = 200
) {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    statusCode,
    data
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: unknown
) {
  const payload: ApiResponse = {
    success: false,
    message,
    statusCode,
    errors: errors ?? []
  };
  return res.status(statusCode).json(payload);
}