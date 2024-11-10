import express from 'express';
import connectDB from '@Db/dbConnection';
import { APP_CONFIG } from '@Config/appConfig';
import logger from '@Utils/logger';

import userRouter from '@Routes/users';

import { errorHandler } from '@Middlewares/errorHandler';
import { logRequest } from '@Middlewares/loggerMiddleware';

const app = express();

app.use(logRequest);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);

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
