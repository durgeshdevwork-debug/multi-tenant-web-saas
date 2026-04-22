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
    const result = await AuthService.login(email, password);
    const user = result?.user as AuthUser | undefined;

    if (!result || !user) {
      return sendError(res, 'Invalid credentials', 401);
    }
    
    // Check if it's a tenant user
    if (user.role === 'admin') {
      return sendError(res, 'Admins should use the admin login portal', 403);
    }

    res.cookie('jwt', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return sendSuccess(res, { user, token: result.token }, 'User login successful');
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 401);
  }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    const user = result?.user as AuthUser | undefined;

    if (!result || !user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    if (user.role !== 'admin') {
      return sendError(res, 'Access denied. Admins only.', 403);
    }

    res.cookie('jwt', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, { user, token: result.token }, 'Admin login successful');
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 401);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
    await AuthService.logout(token);
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict' });
    
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Logout failed', 500);
  }
};
