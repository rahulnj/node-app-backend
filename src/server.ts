import express from 'express';
import connectDB from '@Db/dbConnection';
import { AppConfig } from '@Config/appConfig';
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
  const { PORT } = AppConfig;
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

establishServerConnection();
