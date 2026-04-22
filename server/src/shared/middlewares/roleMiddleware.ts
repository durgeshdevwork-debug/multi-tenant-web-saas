import { Request, Response, NextFunction } from 'express';
import { authSession, AuthenticatedRequest } from './authSession';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  authSession(req as AuthenticatedRequest, res, () => {
    const user = (req as AuthenticatedRequest).authUser;

    if (!user || user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Admin access required',
        statusCode: 403,
        errors: []
      });
      return;
    }

    (req as any).user = user;
    next();
  });
};

export const requireTenantUser = async (req: Request, res: Response, next: NextFunction) => {
  authSession(req as AuthenticatedRequest, res, () => {
    const user: any = (req as AuthenticatedRequest).authUser;

    // We can allow users that have a tenantId or admins
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
  });
};
