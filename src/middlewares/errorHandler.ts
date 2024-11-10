import { Request, Response, NextFunction } from 'express';
import logger from '@Utils/logger';
import { APP_CONFIG } from '@Config/appConfig';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    route: `${req.method} ${req.originalUrl}`,
    body: req.body,
  };

  logger.error(
    `Error occurred in route: ${errorDetails.route} - ${errorDetails.message}. ` +
      `Request body: ${JSON.stringify(errorDetails.body)}. ` +
      `Stack trace: ${errorDetails.stack}`
  );

  res.status(500).json({
    message: 'An unexpected error occurred',
    error: {
      message: errorDetails.message,
      stack:
        APP_CONFIG.NODE_ENV === 'development' ? errorDetails.stack : undefined,
    },
  });
};
