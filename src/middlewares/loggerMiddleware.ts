import { Request, Response, NextFunction } from 'express';
import logger from '@Utils/logger';

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
};

export default logRequest;
