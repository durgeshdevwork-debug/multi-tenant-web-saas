import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendError } from '../../shared/utils/response';

type AuthUser = {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
  role?: string;
  tenantId?: string;
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password, req.headers);
    const user = result?.user as AuthUser | undefined;

    if (!result || !user) {
      return sendError(res, 'Invalid credentials', 401);
    }
    
    // Check if it's a tenant user
    if (user.role === 'admin') {
      return sendError(res, 'Admins should use the admin login portal', 403);
    }

    return sendSuccess(res, { user, token: result.token }, 'User login successful');
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 401);
  }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password, req.headers);
    const user = result?.user as AuthUser | undefined;

    if (!result || !user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    if (user.role !== 'admin') {
      return sendError(res, 'Access denied. Admins only.', 403);
    }

    return sendSuccess(res, { user, token: result.token }, 'Admin login successful');
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 401);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.logout(req.headers);
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Logout failed', 500);
  }
};
