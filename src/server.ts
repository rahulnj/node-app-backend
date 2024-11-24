import express from 'express';
import cookiesParser from 'cookie-parser';

import { APP_CONFIG } from '@Config/appConfig';
import connectDB from '@Db/dbConnection';
import logger from '@Utils/logger';

import authRouter from '@Routes/auth';
import profileRouter from '@Routes/profiles';

import validateEnvVariables from '@Middlewares/envValidationMiddleware';
import { logRequest } from '@Middlewares/loggerMiddleware';
import { errorHandler } from '@Middlewares/errorHandler';

const app = express();

app.use(validateEnvVariables());
app.use(logRequest);

app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', authRouter);
app.use('/api/v1/profiles', profileRouter);

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
