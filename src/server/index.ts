import { server } from './server';
import initializeSocket from '@Socket/socket';
import connectDB from '@Db/dbConnection';
import logger from '@Utils/logger';
import { APP_CONFIG } from '@Config/appConfig';

const initializeServer = async () => {
  try {
    await connectDB();
    const { PORT } = APP_CONFIG;

    server.listen(PORT, () => {
      logger.info(
        `🚀 Server running on port ${PORT} in ${APP_CONFIG.NODE_ENV} mode`
      );
      initializeSocket(server);
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      logger.warn(`${signal} received. Shutting down...`);
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });

      // Force close server after 10 seconds if cleanup fails
      setTimeout(() => {
        logger.error('Forcefully shutting down.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Error during server initialization:', error);
    process.exit(1);
  }
};

initializeServer();
