import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../shared/utils/auth';
import { sendSuccess, sendError } from '@shared/utils/response';
import * as authController from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', authController.userLogin);
authRouter.post('/admin/login', authController.adminLogin);
authRouter.post('/logout', authController.logout);

authRouter.get('/profile', async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session) {
      return sendError(res, 'Not authenticated', 401);
    }

    return sendSuccess(res, session.user, 'Profile fetched');
  } catch (err) {
    next(err);
  }
});
