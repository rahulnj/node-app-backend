import express from 'express';
import cookiesParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { APP_CONFIG } from '@Config/appConfig';
import connectDB from '@Db/dbConnection';
import logger from '@Utils/logger';

import apiRouter from '@Routes/index';

import validateEnvVariables from '@Middlewares/envValidationMiddleware';
import { logRequest } from '@Middlewares/loggerMiddleware';
import { errorHandler } from '@Middlewares/errorHandler';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(limiter);
app.use(validateEnvVariables());
app.use(logRequest);

app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiRouter);

app.use(errorHandler);

const establishServerConnection = async () => {
  const { PORT } = APP_CONFIG;
  await connectDB();

  app.listen(PORT, () => {
    if (APP_CONFIG.NODE_ENV === 'development') {
      logger.info(`Server is running in development mode on port ${PORT}`);
    } else {
      logger.info(
        `Server is running in ${
          process.env.NODE_ENV || 'production'
        } mode on port ${PORT}`
      );
    }
  });
};

establishServerConnection();
