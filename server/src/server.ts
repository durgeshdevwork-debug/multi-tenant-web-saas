
import http from 'node:http';
import { app } from './app';
import { env } from '@configs/env';
import { connectDB, disconnectDB } from '@configs/db';
import { logger } from '@configs/logger';

async function start() {
  await connectDB();

  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`Server listening on http://${env.HOST}:${env.PORT}`);
  });

  const shutdown = (signal: NodeJS.Signals) => {
    logger.info({ signal }, 'Received shutdown signal');
    server.close(async (err) => {
      if (err) {
        logger.error({ err }, 'Error closing HTTP server');
        process.exit(1);
      }
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});

