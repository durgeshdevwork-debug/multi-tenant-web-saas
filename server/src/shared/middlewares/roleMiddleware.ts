import { Request, Response, NextFunction } from 'express';
import { auth } from '../utils/auth';
import { fromNodeHeaders } from 'better-auth/node';

type SessionUser = {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
  role?: string;
  tenantId?: string;
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    const user = session?.user as SessionUser | undefined;

    if (!session || user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Admin access required',
        statusCode: 403,
        errors: []
      });
      return;
    }

    // Attach user to request for convenience
    (req as any).user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireTenantUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    const user = session?.user as SessionUser | undefined;

    if (!session) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
        statusCode: 401,
        errors: []
    });
    return;
    }

    // Only allow users that have a tenantId or admins
    if (user?.role !== 'admin' && !user?.tenantId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Tenant access required',
        statusCode: 403,
        errors: []
      });
      return;
    }

    (req as any).user = user;
    next();
  } catch (err) {
    next(err);
  }
};
