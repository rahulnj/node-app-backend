import express from 'express';
import cookiesParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import cors from 'cors';
import { APP_CONFIG } from '@Config/appConfig';
import connectDB from '@Db/dbConnection';
import logger from '@Utils/logger';
import apiRouter from '@Routes/index';
import validateEnvVariables from '@Middlewares/envValidationMiddleware';
import { logRequest } from '@Middlewares/loggerMiddleware';
import { errorHandler, notFoundHandler } from '@Middlewares/errorHandler';

const app = express();

// Security middlewares
app.use(helmet());
// app.use(cors({ origin: APP_CONFIG.ALLOWED_ORIGINS }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Middleware
app.use(validateEnvVariables());
app.use(logRequest);
app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', apiRouter);

// Error handlers
app.use([notFoundHandler, errorHandler]);

const initializeServer = async () => {
  const { PORT } = APP_CONFIG;

  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(
        `Server is running in ${APP_CONFIG.NODE_ENV} mode on port ${PORT}`
      );
    });

    const controlledShutdown = () => {
      logger.info('Received shutdown signal, shutting down gracefully...');
      server.close(() => {
        logger.info('Closed out remaining connections.');
        process.exit(0);
      });

      // Force close server after 10 seconds
      setTimeout(() => {
        logger.error(
          'Could not close connections in time, forcefully shutting down'
        );
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', controlledShutdown);
    process.on('SIGINT', controlledShutdown);
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

initializeServer();
