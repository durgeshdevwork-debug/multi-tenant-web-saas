import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { sendError } from '@shared/utils/response';
import { User } from '@modules/auth/models/user.model';
import { Session } from '@modules/auth/models/session.model';

export interface AuthenticatedRequest extends Request {
  authUser?: {
    id: string;
    email: string;
    role: string;
    tenantId?: string;
  };
  authSession?: unknown;
}

export async function authSession(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return sendError(res, 'Not authenticated', 401);
    }

    const payload = verifyToken(token) as any;
    
    if (!payload || !payload.id) {
       return sendError(res, 'Not authenticated', 401);
    }

    const session = await Session.findOne({ token, userId: payload.id });
    if (!session || session.expiresAt < new Date()) {
      return sendError(res, 'Session expired or not found', 401);
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return sendError(res, 'User not found', 401);
    }

    req.authUser = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    };
    req.authSession = session;
    return next();
  } catch (err) {
    return sendError(res, 'Not authenticated', 401);
  }
}

