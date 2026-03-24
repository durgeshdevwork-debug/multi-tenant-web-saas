import { Request, Response, NextFunction } from 'express';
import { auth } from '../utils/auth';
import { fromNodeHeaders } from 'better-auth/node';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session || session.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Admin access required',
        statusCode: 403,
        errors: []
      });
      return;
    }

    // Attach user to request for convenience
    (req as any).user = session.user;
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
    if (session.user.role !== 'admin' && !session.user.tenantId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Tenant access required',
        statusCode: 403,
        errors: []
      });
      return;
    }

    (req as any).user = session.user;
    next();
  } catch (err) {
    next(err);
  }
};
