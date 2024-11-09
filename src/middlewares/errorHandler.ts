import { Request, Response } from 'express';
import logger from '@Utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response) => {
  logger.error(
    `Error occurred in route: ${req.method} ${req.originalUrl} - ${err.message}. ` +
      `Request body: ${JSON.stringify(req.body)}`
  );

  res.status(500).json({
    message: 'An unexpected error occurred',
    error: err.message,
  });
};
