import type { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../utils/auth';
import { sendError } from '@shared/utils/response';

export interface AuthenticatedRequest extends Request {
  authUser?: {
    id: string;
    email: string;
  };
  authSession?: unknown;
}

export async function authSession(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    }); // pattern from Better Auth Express docs[web:17][web:20][web:35]

    if (!session) {
      return sendError(res, 'Not authenticated', 401);
    }

    req.authUser = {
      id: session.user.id,
      email: session.user.email
    };
    req.authSession = session.session;
    return next();
  } catch (err) {
    return next(err);
  }
}

