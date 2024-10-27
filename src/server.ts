import express, { Request, Response } from 'express';

const app = express();

app.use('/test', (req: Request, res: Response) => {
  res.send('Hello World 1');
});

app.use('/test/1', (req: Request, res: Response) => {
  res.send('Hello World 2');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
