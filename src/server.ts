import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';

dotenv.config();

const app = express();

app.use('/test', (req: Request, res: Response) => {
  res.send('Hello World 1');
});

app.use('/test/1', (req: Request, res: Response) => {
  res.send('Hello World 2');
});

const establishServerConnection = async () => {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

establishServerConnection();
