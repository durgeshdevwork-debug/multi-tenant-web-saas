
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
import { env } from '@configs/env';
import { requestLogMiddleware } from '@shared/middlewares/requestLogger';
import { errorHandler } from '@shared/errors/errorHandler';
import { notFound } from '@shared/middlewares/notFound';
import { registerRoutes } from './routes/index';
import { auth } from './shared/utils/auth';

export const app = express();

// CORS – can be applied globally
app.use(
  cors({
    origin: env.CORS_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  })
);
// Better Auth handler (must be before express.json)[web:17][web:20]
app.all('/api/auth/{*any}', toNodeHandler(auth));
console.log
// Now, for the rest of your routes:
app.use(helmet());
app.use(express.json()); // safe after auth handler
app.use(requestLogMiddleware);
// Health route without auth
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Example `/api/me` route using Better Auth session[web:17][web:20]
app.get('/api/me', async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
        statusCode: 401,
        errors: []
      });
    }

    return res.json({
      success: true,
      message: 'Session fetched',
      statusCode: 200,
      data: session
    });
  } catch (err) {
    next(err);
  }
});

// Register your feature modules
registerRoutes(app);

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);

