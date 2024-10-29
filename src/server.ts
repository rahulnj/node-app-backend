import express, { Request, Response } from 'express';
import connectDB from './database/database';
import { AppConfig } from './config/appConfig';

const app = express();

app.use('/test', (req: Request, res: Response) => {
  res.send('Hello World 1');
});

app.use('/test/1', (req: Request, res: Response) => {
  res.send('Hello World 2');
});

const establishServerConnection = async () => {
  const { PORT } = AppConfig;
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

establishServerConnection();
