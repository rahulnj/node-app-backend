import express from 'express';
import connectDB from './database/database';
import { AppConfig } from './config/appConfig';
import userRouter from './routes/users';

const app = express();

app.use(express.json());
app.use('/api/users', userRouter);

const establishServerConnection = async () => {
  const { PORT } = AppConfig;
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

establishServerConnection();
