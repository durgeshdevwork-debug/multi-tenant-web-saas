import { Router } from 'express';
import { sendSuccess, sendError } from '@shared/utils/response';
import * as authController from './auth.controller';
import { authSession } from '@shared/middlewares/authSession';

export const authRouter = Router();

authRouter.post('/login', authController.userLogin);
authRouter.post('/admin/login', authController.adminLogin);
authRouter.post('/logout', authController.logout);

authRouter.get('/profile', authSession, async (req, res, next) => {
  try {
    const user = (req as any).authUser;
    if (!user) {
      return sendError(res, 'Not authenticated', 401);
    }
    return sendSuccess(res, user, 'Profile fetched');
  } catch (err) {
    next(err);
  }
});
